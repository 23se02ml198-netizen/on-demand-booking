import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env configuration if present
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if .env is missing
  }
}

const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
export const isPostgres = Boolean(databaseUrl);

let pool = null;
let sqliteDb = null;
let lastInsertedId = 1;

if (isPostgres) {
  console.log('[Database] Connecting to PostgreSQL Database...');
  const needsSsl = !databaseUrl.includes('localhost') && !databaseUrl.includes('.railway.internal');
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: needsSsl ? { rejectUnauthorized: false } : false
  });
} else {
  const dbPath = process.env.DB_PATH
    ? path.resolve(__dirname, process.env.DB_PATH)
    : path.join(__dirname, 'services.db');
  console.log(`[Database] SQLite Database connected successfully: ${dbPath}`);
  sqliteDb = new DatabaseSync(dbPath);
}

// Convert SQLite '?' placeholders to PostgreSQL '$1', '$2', ...
function toPgSql(sql) {
  let paramIndex = 1;
  let inString = false;
  let quoteChar = '';
  let result = '';

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    if (inString) {
      result += char;
      if (char === quoteChar && sql[i - 1] !== '\\') {
        inString = false;
      }
    } else {
      if (char === "'" || char === '"') {
        inString = true;
        quoteChar = char;
        result += char;
      } else if (char === '?') {
        result += `$${paramIndex++}`;
      } else {
        result += char;
      }
    }
  }
  return result;
}

function normalizeParams(args) {
  if (args.length === 1 && Array.isArray(args[0])) {
    return args[0];
  }
  return args;
}

// Universal database client supporting both PostgreSQL and SQLite
const db = {
  prepare(sql) {
    if (isPostgres) {
      return {
        async get(...args) {
          const params = normalizeParams(args);
          if (/SELECT\s+last_insert_rowid\(\)\s+as\s+id/i.test(sql)) {
            return { id: lastInsertedId };
          }
          const pgSql = toPgSql(sql);
          const res = await pool.query(pgSql, params);
          const row = res.rows[0];
          if (row && row.count !== undefined) {
            row.count = Number(row.count);
          }
          if (row && row.sum !== undefined) {
            row.sum = row.sum !== null ? Number(row.sum) : 0;
          }
          return row;
        },
        async all(...args) {
          const params = normalizeParams(args);
          const pgSql = toPgSql(sql);
          const res = await pool.query(pgSql, params);
          return res.rows.map(row => {
            if (row.count !== undefined) row.count = Number(row.count);
            if (row.sum !== undefined) row.sum = row.sum !== null ? Number(row.sum) : 0;
            return row;
          });
        },
        async run(...args) {
          const params = normalizeParams(args);
          if (/BEGIN\s+TRANSACTION/i.test(sql)) {
            await pool.query('BEGIN');
            return { changes: 0 };
          }
          if (/COMMIT/i.test(sql)) {
            await pool.query('COMMIT');
            return { changes: 0 };
          }
          if (/ROLLBACK/i.test(sql)) {
            await pool.query('ROLLBACK');
            return { changes: 0 };
          }
          if (/SELECT\s+last_insert_rowid\(\)\s+as\s+id/i.test(sql)) {
            return { changes: 0, lastInsertRowid: lastInsertedId };
          }

          let pgSql = toPgSql(sql);
          const isInsert = /^\s*INSERT\s+INTO/i.test(pgSql);
          if (isInsert && !/RETURNING/i.test(pgSql)) {
            pgSql += ' RETURNING id';
          }

          const res = await pool.query(pgSql, params);
          if (isInsert && res.rows && res.rows[0]?.id) {
            lastInsertedId = res.rows[0].id;
          }
          return {
            changes: res.rowCount,
            lastInsertRowid: lastInsertedId
          };
        }
      };
    } else {
      const stmt = sqliteDb.prepare(sql);
      return {
        async get(...args) {
          const params = normalizeParams(args);
          return stmt.get(...params);
        },
        async all(...args) {
          const params = normalizeParams(args);
          return stmt.all(...params);
        },
        async run(...args) {
          const params = normalizeParams(args);
          const res = stmt.run(...params);
          if (res && res.lastInsertRowid !== undefined) {
            lastInsertedId = res.lastInsertRowid;
          }
          return res;
        }
      };
    }
  },
  async exec(sql) {
    if (isPostgres) {
      return pool.query(sql);
    } else {
      return sqliteDb.exec(sql);
    }
  }
};

export async function testConnection() {
  try {
    if (isPostgres) {
      const versionRow = await pool.query('SELECT version()');
      const tables = await pool.query(
        "SELECT table_name as name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
      );
      return {
        connected: true,
        database: 'PostgreSQL',
        version: versionRow.rows[0].version,
        path: databaseUrl.replace(/:[^:@]+@/, ':***@'),
        tables: tables.rows.map(t => t.name)
      };
    } else {
      const versionRow = sqliteDb.prepare('SELECT sqlite_version() as version').get();
      const tables = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
      return {
        connected: true,
        database: 'SQLite',
        version: versionRow.version,
        path: process.env.DB_PATH || 'services.db',
        tables: tables.map(t => t.name)
      };
    }
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
}

// Cryptography helpers
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === verifyHash;
}

// Function to initialize tables
export async function initDatabase() {
  console.log(`[Database] Initializing database tables (${isPostgres ? 'PostgreSQL' : 'SQLite'})...`);

  if (isPostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('customer', 'provider', 'admin')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS providers (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        bio TEXT,
        hourly_rate NUMERIC NOT NULL,
        rating NUMERIC DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        availability TEXT DEFAULT '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}',
        status TEXT DEFAULT 'approved' CHECK(status IN ('pending_approval', 'approved', 'suspended'))
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        icon TEXT NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS login_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        ip_address TEXT DEFAULT '127.0.0.1',
        login_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id),
        provider_id INTEGER NOT NULL REFERENCES users(id),
        category TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        booking_time TEXT NOT NULL,
        duration_hours INTEGER DEFAULT 1,
        address TEXT NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
        total_price NUMERIC NOT NULL,
        admin_approved INTEGER DEFAULT 0,
        payment_status TEXT DEFAULT 'unpaid',
        payout_status TEXT DEFAULT 'pending',
        admin_margin NUMERIC DEFAULT 0,
        provider_payout NUMERIC DEFAULT 0,
        provider_completed INTEGER DEFAULT 0,
        admin_completion_confirmed INTEGER DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(id),
        customer_id INTEGER NOT NULL REFERENCES users(id),
        provider_id INTEGER NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        receiver_id INTEGER NOT NULL REFERENCES users(id),
        booking_id INTEGER NOT NULL REFERENCES bookings(id),
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        is_read INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(id),
        customer_id INTEGER NOT NULL REFERENCES users(id),
        provider_id INTEGER NOT NULL REFERENCES users(id),
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT DEFAULT 'Medium',
        status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Investigating', 'Resolved', 'Dismissed')),
        resolution_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else {
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('customer', 'provider', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS providers (
        user_id INTEGER PRIMARY KEY,
        category TEXT NOT NULL,
        bio TEXT,
        hourly_rate REAL NOT NULL,
        rating REAL DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        availability TEXT DEFAULT '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}',
        status TEXT DEFAULT 'approved' CHECK(status IN ('pending_approval', 'approved', 'suspended')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        icon TEXT NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS login_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        ip_address TEXT DEFAULT '127.0.0.1',
        login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        booking_time TEXT NOT NULL,
        duration_hours INTEGER DEFAULT 1,
        address TEXT NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
        total_price REAL NOT NULL,
        admin_approved INTEGER DEFAULT 0,
        payment_status TEXT DEFAULT 'unpaid',
        payout_status TEXT DEFAULT 'pending',
        admin_margin REAL DEFAULT 0,
        provider_payout REAL DEFAULT 0,
        provider_completed INTEGER DEFAULT 0,
        admin_completion_confirmed INTEGER DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES users(id),
        FOREIGN KEY(provider_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER UNIQUE NOT NULL,
        customer_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(booking_id) REFERENCES bookings(id),
        FOREIGN KEY(customer_id) REFERENCES users(id),
        FOREIGN KEY(provider_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        booking_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read INTEGER DEFAULT 0,
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id),
        FOREIGN KEY(booking_id) REFERENCES bookings(id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS complaints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT DEFAULT 'Medium',
        status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Investigating', 'Resolved', 'Dismissed')),
        resolution_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(booking_id) REFERENCES bookings(id),
        FOREIGN KEY(customer_id) REFERENCES users(id),
        FOREIGN KEY(provider_id) REFERENCES users(id)
      );
    `);
  }

  console.log('[Database] Tables initialized. Seeding initial data if needed...');
  await seedData();
}

// Function to seed categories and default users
async function seedData() {
  const catRow = await db.prepare('SELECT COUNT(*) as count FROM categories').get();
  const categoriesCount = Number(catRow?.count || 0);

  if (categoriesCount === 0) {
    const defaultCategories = [
      { name: 'Cleaning', icon: 'cleaning', description: 'Professional home, kitchen, and deep office cleaning services.' },
      { name: 'Plumbing', icon: 'plumbing', description: 'Leak detection, pipe repairs, tap fittings, and drainage clearing.' },
      { name: 'Electrical', icon: 'electrical', description: 'Safe residential wiring, lighting installation, and panel upgrades.' },
      { name: 'Appliance Repair', icon: 'appliances', description: 'AC servicing, refrigerator repair, washing machines, and microwave fixing.' },
      { name: 'Beauty & Wellness', icon: 'beauty', description: 'Salon at home, hair styling, facials, pedicures, and wellness massage.' },
      { name: 'Pest Control', icon: 'pest', description: 'Safe and effective treatment for termites, bed bugs, and general pests.' }
    ];

    for (const cat of defaultCategories) {
      await db.prepare('INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)')
        .run(cat.name, cat.icon, cat.description);
    }
    console.log('[Database] Seeded categories.');
  }

  const userRow = await db.prepare('SELECT COUNT(*) as count FROM users').get();
  const usersCount = Number(userRow?.count || 0);

  if (usersCount === 0) {
    // 1. Admin
    const adminCreds = hashPassword('admin123');
    await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('System Admin', 'admin@services.com', adminCreds.hash, adminCreds.salt, 'admin');

    // 2. Customers
    const aliceCreds = hashPassword('alice123');
    await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Alice Johnson', 'alice@example.com', aliceCreds.hash, aliceCreds.salt, 'customer');

    const bobCreds = hashPassword('bob123');
    await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Bob Smith', 'bob@example.com', bobCreds.hash, bobCreds.salt, 'customer');

    // 3. Providers
    // John - Plumber
    const johnCreds = hashPassword('john123');
    const johnInsert = await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('John Doe', 'john@plumbing.com', johnCreds.hash, johnCreds.salt, 'provider');
    const johnId = johnInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE email = ?').get('john@plumbing.com')).id;

    await db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)')
      .run(
        johnId,
        'Plumbing',
        'Professional plumber with 10 years of experience in leak repairs, pipe installations, and bathroom fittings. Reliable and quick.',
        750.00,
        4.8,
        1
      );

    // Sarah - Cleaner
    const sarahCreds = hashPassword('sarah123');
    const sarahInsert = await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Sarah Connor', 'sarah@cleaning.com', sarahCreds.hash, sarahCreds.salt, 'provider');
    const sarahId = sarahInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE email = ?').get('sarah@cleaning.com')).id;

    await db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)')
      .run(
        sarahId,
        'Cleaning',
        'Expert home cleaning specialist. Detail-oriented, pet-friendly, and dedicated to making your home shine. Available on weekends.',
        600.00,
        4.9,
        1
      );

    // Mike - Electrician
    const mikeCreds = hashPassword('mike123');
    const mikeInsert = await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Mike Sparks', 'mike@electrical.com', mikeCreds.hash, mikeCreds.salt, 'provider');
    const mikeId = mikeInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE email = ?').get('mike@electrical.com')).id;

    await db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)')
      .run(
        mikeId,
        'Electrical',
        'Licensed electrician. Specialized in home wiring, smart lighting installations, panel upgrades, and electrical safety audits.',
        900.00,
        4.7,
        1
      );

    // Elena - Beautician
    const elenaCreds = hashPassword('elena123');
    const elenaInsert = await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Elena Rostova', 'elena@beauty.com', elenaCreds.hash, elenaCreds.salt, 'provider');
    const elenaId = elenaInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE email = ?').get('elena@beauty.com')).id;

    await db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)')
      .run(
        elenaId,
        'Beauty & Wellness',
        'Professional hair stylist and beautician. Bringing salon-grade hair care, makeup, bridal service, and facial treatments to your doorstep.',
        800.00,
        5.0,
        1
      );

    // Priya - Appliance Repair Specialist
    const priyaCreds = hashPassword('priya123');
    const priyaInsert = await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Priya Nair', 'priya@appliancerepair.com', priyaCreds.hash, priyaCreds.salt, 'provider');
    const priyaId = priyaInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE email = ?').get('priya@appliancerepair.com')).id;

    await db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)')
      .run(
        priyaId,
        'Appliance Repair',
        'Certified appliance technician for air conditioners, refrigerators, washing machines, microwaves, TVs, and geysers.',
        850.00,
        4.9,
        1
      );

    // Arjun - Pest Control Specialist
    const arjunCreds = hashPassword('arjun123');
    const arjunInsert = await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Arjun Mehta', 'arjun@pestcontrol.com', arjunCreds.hash, arjunCreds.salt, 'provider');
    const arjunId = arjunInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE email = ?').get('arjun@pestcontrol.com')).id;

    await db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)')
      .run(
        arjunId,
        'Pest Control',
        'Licensed pest control professional providing safe termite, cockroach, mosquito, bed bug, rodent, and general pest treatments.',
        700.00,
        4.8,
        1
      );

    console.log('[Database] Seeded users and providers.');

    const customerUser = await db.prepare('SELECT id FROM users WHERE email = ?').get('alice@example.com');
    const customerId = customerUser.id;

    // Test Completed Booking for John (Plumbing)
    const bookingInsert = await db.prepare(`
      INSERT INTO bookings (customer_id, provider_id, category, booking_date, booking_time, duration_hours, address, status, total_price, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      customerId,
      johnId,
      'Plumbing',
      '2026-06-28',
      '10:00',
      2,
      'Apartment 4B, Pine Street, Cityville',
      'completed',
      1500.00,
      'Fix kitchen sink leak and check bathroom pressure.'
    );
    const bookingId = bookingInsert.lastInsertRowid || (await db.prepare('SELECT id FROM bookings WHERE customer_id = ?').get(customerId)).id;

    // Test Review for John (Plumbing)
    await db.prepare('INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment) VALUES (?, ?, ?, ?, ?)')
      .run(bookingId, customerId, johnId, 5, 'John was very efficient and fixed the kitchen leak in no time. Highly recommended!');

    console.log('[Database] Seeded initial booking and review.');
  }
}

export default db;

// Run database init directly when file is executed
const isDirectRun = process.argv[1] && (
  process.argv[1] === fileURLToPath(import.meta.url) ||
  process.argv[1].endsWith('database.js')
);
if (isDirectRun) {
  initDatabase().catch(console.error);
}
