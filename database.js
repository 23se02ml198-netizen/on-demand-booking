import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const dbPath = process.env.DB_PATH
  ? path.resolve(__dirname, process.env.DB_PATH)
  : path.join(__dirname, 'services.db');

let db;
try {
  db = new DatabaseSync(dbPath);
  console.log(`[Database] SQLite Database connected successfully: ${dbPath}`);
} catch (err) {
  console.error(`[Database] Connection Error (${dbPath}):`, err);
  throw err;
}

export function testConnection() {
  try {
    const versionRow = db.prepare('SELECT sqlite_version() as version').get();
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    return {
      connected: true,
      database: 'SQLite',
      version: versionRow.version,
      path: dbPath,
      tables: tables.map(t => t.name)
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
}

// Helper functions for cryptography
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
export function initDatabase() {
  console.log('Initializing database tables...');

  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('customer', 'provider', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Providers Table
  db.exec(`
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
  `);

  // 3. Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      icon TEXT NOT NULL,
      description TEXT
    );
  `);

  // Login History Audit Table
  db.exec(`
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
  `);

  // 4. Bookings Table
  db.exec(`
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
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES users(id),
      FOREIGN KEY(provider_id) REFERENCES users(id)
    );
  `);

  // Ensure new columns exist for existing tables
  try {
    const bookingCols = db.prepare("PRAGMA table_info(bookings)").all().map(c => c.name);
    if (!bookingCols.includes('admin_approved')) db.exec("ALTER TABLE bookings ADD COLUMN admin_approved INTEGER DEFAULT 0");
    if (!bookingCols.includes('payment_status')) db.exec("ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'unpaid'");
    if (!bookingCols.includes('payout_status')) db.exec("ALTER TABLE bookings ADD COLUMN payout_status TEXT DEFAULT 'pending'");
    if (!bookingCols.includes('admin_margin')) db.exec("ALTER TABLE bookings ADD COLUMN admin_margin REAL DEFAULT 0");
    if (!bookingCols.includes('provider_payout')) db.exec("ALTER TABLE bookings ADD COLUMN provider_payout REAL DEFAULT 0");
    if (!bookingCols.includes('provider_completed')) db.exec("ALTER TABLE bookings ADD COLUMN provider_completed INTEGER DEFAULT 0");
    if (!bookingCols.includes('admin_completion_confirmed')) db.exec("ALTER TABLE bookings ADD COLUMN admin_completion_confirmed INTEGER DEFAULT 0");
  } catch (e) { console.error('Column migration error:', e); }

  // 5. Reviews Table
  db.exec(`
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
  `);

  // 6. Messages Table
  db.exec(`
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
  `);

  // 7. Sessions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 8. Complaints & Escalations Table
  db.exec(`
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

  console.log('Tables initialized. Seeding initial data...');
  seedData();
}

// Function to seed categories and default users
function seedData() {
  // Check if categories already exist
  const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (categoriesCount === 0) {
    const insertCat = db.prepare('INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)');

    const defaultCategories = [
      {
        name: 'Cleaning',
        icon: 'cleaning',
        description: 'Professional home, kitchen, and deep office cleaning services.'
      },
      {
        name: 'Plumbing',
        icon: 'plumbing',
        description: 'Leak detection, pipe repairs, tap fittings, and drainage clearing.'
      },
      {
        name: 'Electrical',
        icon: 'electrical',
        description: 'Safe residential wiring, lighting installation, and panel upgrades.'
      },
      {
        name: 'Appliance Repair',
        icon: 'appliances',
        description: 'AC servicing, refrigerator repair, washing machines, and microwave fixing.'
      },
      {
        name: 'Beauty & Wellness',
        icon: 'beauty',
        description: 'Salon at home, hair styling, facials, pedicures, and wellness massage.'
      },
      {
        name: 'Pest Control',
        icon: 'pest',
        description: 'Safe and effective treatment for termites, bed bugs, and general pests.'
      }
    ];

    for (const cat of defaultCategories) {
      insertCat.run(cat.name, cat.icon, cat.description);
    }
    console.log('Seeded categories.');
  }

  // Check if users already exist
  const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (usersCount === 0) {
    const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)');
    const insertProvider = db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)');

    // 1. Admin
    const adminCreds = hashPassword('admin123');
    insertUser.run('System Admin', 'admin@services.com', adminCreds.hash, adminCreds.salt, 'admin');

    // 2. Customers
    const aliceCreds = hashPassword('alice123');
    insertUser.run('Alice Johnson', 'alice@example.com', aliceCreds.hash, aliceCreds.salt, 'customer');

    const bobCreds = hashPassword('bob123');
    insertUser.run('Bob Smith', 'bob@example.com', bobCreds.hash, bobCreds.salt, 'customer');

    // 3. Providers
    // John - Plumber
    const johnCreds = hashPassword('john123');
    insertUser.run('John Doe', 'john@plumbing.com', johnCreds.hash, johnCreds.salt, 'provider');
    const johnId = db.prepare('SELECT id FROM users WHERE email = ?').get('john@plumbing.com').id;
    insertProvider.run(
      johnId,
      'Plumbing',
      'Professional plumber with 10 years of experience in leak repairs, pipe installations, and bathroom fittings. Reliable and quick.',
      750.00,
      4.8,
      1
    );

    // Sarah - Cleaner
    const sarahCreds = hashPassword('sarah123');
    insertUser.run('Sarah Connor', 'sarah@cleaning.com', sarahCreds.hash, sarahCreds.salt, 'provider');
    const sarahId = db.prepare('SELECT id FROM users WHERE email = ?').get('sarah@cleaning.com').id;
    insertProvider.run(
      sarahId,
      'Cleaning',
      'Expert home cleaning specialist. Detail-oriented, pet-friendly, and dedicated to making your home shine. Available on weekends.',
      600.00,
      4.9,
      1
    );

    // Mike - Electrician
    const mikeCreds = hashPassword('mike123');
    insertUser.run('Mike Sparks', 'mike@electrical.com', mikeCreds.hash, mikeCreds.salt, 'provider');
    const mikeId = db.prepare('SELECT id FROM users WHERE email = ?').get('mike@electrical.com').id;
    insertProvider.run(
      mikeId,
      'Electrical',
      'Licensed electrician. Specialized in home wiring, smart lighting installations, panel upgrades, and electrical safety audits.',
      900.00,
      4.7,
      1
    );

    // Elena - Beautician
    const elenaCreds = hashPassword('elena123');
    insertUser.run('Elena Rostova', 'elena@beauty.com', elenaCreds.hash, elenaCreds.salt, 'provider');
    const elenaId = db.prepare('SELECT id FROM users WHERE email = ?').get('elena@beauty.com').id;
    insertProvider.run(
      elenaId,
      'Beauty & Wellness',
      'Professional hair stylist and beautician. Bringing salon-grade hair care, makeup, bridal service, and facial treatments to your doorstep.',
      800.00,
      5.0,
      1
    );

    // Priya - Appliance Repair Specialist
    const priyaCreds = hashPassword('priya123');
    insertUser.run('Priya Nair', 'priya@appliancerepair.com', priyaCreds.hash, priyaCreds.salt, 'provider');
    const priyaId = db.prepare('SELECT id FROM users WHERE email = ?').get('priya@appliancerepair.com').id;
    insertProvider.run(
      priyaId,
      'Appliance Repair',
      'Certified appliance technician for air conditioners, refrigerators, washing machines, microwaves, TVs, and geysers.',
      850.00,
      4.9,
      1
    );

    // Arjun - Pest Control Specialist
    const arjunCreds = hashPassword('arjun123');
    insertUser.run('Arjun Mehta', 'arjun@pestcontrol.com', arjunCreds.hash, arjunCreds.salt, 'provider');
    const arjunId = db.prepare('SELECT id FROM users WHERE email = ?').get('arjun@pestcontrol.com').id;
    insertProvider.run(
      arjunId,
      'Pest Control',
      'Licensed pest control professional providing safe termite, cockroach, mosquito, bed bug, rodent, and general pest treatments.',
      700.00,
      4.8,
      1
    );

    console.log('Seeded users and providers.');

    // Let's seed a test booking and a review so the dashboard isn't completely empty
    const customerId = db.prepare('SELECT id FROM users WHERE email = ?').get('alice@example.com').id;

    // Test Completed Booking for John (Plumbing)
    const insertBooking = db.prepare(`
      INSERT INTO bookings (customer_id, provider_id, category, booking_date, booking_time, duration_hours, address, status, total_price, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBooking.run(
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
    const bookingId = db.prepare('SELECT last_insert_rowid() as id').get().id;

    // Test Review for John (Plumbing)
    db.prepare('INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment) VALUES (?, ?, ?, ?, ?)')
      .run(bookingId, customerId, johnId, 5, 'John was very efficient and fixed the kitchen leak in no time. Highly recommended!');

    console.log('Seeded initial booking and review.');
  }

  seedAdditionalProviders();
}

function seedAdditionalProviders() {
  const providers = [
    {
      name: 'Priya Nair',
      email: 'priya@appliancerepair.com',
      password: 'priya123',
      category: 'Appliance Repair',
      bio: 'Certified appliance technician for air conditioners, refrigerators, washing machines, microwaves, TVs, and geysers.',
      hourlyRate: 850,
      rating: 4.9
    },
    {
      name: 'Arjun Mehta',
      email: 'arjun@pestcontrol.com',
      password: 'arjun123',
      category: 'Pest Control',
      bio: 'Licensed pest control professional providing safe termite, cockroach, mosquito, bed bug, rodent, and general pest treatments.',
      hourlyRate: 700,
      rating: 4.8
    }
  ];

  for (const provider of providers) {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(provider.email);
    if (existingUser) {
      continue;
    }

    const credentials = hashPassword(provider.password);
    db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .run(provider.name, provider.email, credentials.hash, credentials.salt, 'provider');
    const userId = db.prepare('SELECT id FROM users WHERE email = ?').get(provider.email).id;
    db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)')
      .run(userId, provider.category, provider.bio, provider.hourlyRate, provider.rating, 1);
  }
}

// Export the database instance for use in other files
export default db;

// Run database init directly when file is executed
const isDirectRun = process.argv[1] && (
  process.argv[1] === fileURLToPath(import.meta.url) ||
  process.argv[1].endsWith('database.js')
);
if (isDirectRun) {
  initDatabase();
}
