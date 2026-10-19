import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import db, { hashPassword, verifyPassword, initDatabase, testConnection } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

await initDatabase();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Health & Status Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  if (dbStatus.connected) {
    return res.json({ status: 'ok', database: dbStatus });
  } else {
    return res.status(500).json({ status: 'error', database: dbStatus });
  }
});

// Authentication Middleware
const authenticateSession = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  try {
    const session = await db.prepare(`
      SELECT sessions.token, sessions.user_id, sessions.expires_at, users.name, users.email, users.role 
      FROM sessions 
      JOIN users ON sessions.user_id = users.id 
      WHERE sessions.token = ?
    `).get(token);

    if (!session) {
      return res.status(401).json({ error: 'Invalid session token.' });
    }

    // Check expiration
    if (new Date(session.expires_at) < new Date()) {
      // Clean up expired session
      await db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
      return res.status(401).json({ error: 'Session expired.' });
    }

    // Attach user to request
    req.user = {
      id: session.user_id,
      name: session.name,
      email: session.email,
      role: session.role,
      token: session.token
    };
    next();
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// ----------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

// Register a customer or service provider account.
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, category, bio, hourly_rate } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  if (!['customer', 'provider', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be customer, provider, or admin.' });
  }

  if (role === 'provider' && (!category || !hourly_rate)) {
    return res.status(400).json({ error: 'Provider category and hourly rate are required.' });
  }

  try {
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const { hash, salt } = hashPassword(password);

    await db.prepare('BEGIN TRANSACTION').run();

    try {
      await db.prepare('INSERT INTO users (name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
        .run(name, email, hash, salt, role);

      const newUserId = (await db.prepare('SELECT last_insert_rowid() as id').get()).id;

      if (role === 'provider') {
        const rate = parseFloat(hourly_rate);
        if (!Number.isFinite(rate) || rate <= 0) {
          await db.prepare('ROLLBACK').run();
          return res.status(400).json({ error: 'Hourly rate must be a valid positive number.' });
        }

        await db.prepare('INSERT INTO providers (user_id, category, bio, hourly_rate, status) VALUES (?, ?, ?, ?, ?)')
          .run(newUserId, category, bio || '', rate, 'approved');
      }

      await db.prepare('COMMIT').run();

      // Automatically issue session token so user is logged in
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(sessionToken, newUserId, expiresAt);

      try {
        const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        await db.prepare(`
          INSERT INTO login_history (user_id, user_name, email, role, ip_address)
          VALUES (?, ?, ?, ?, ?)
        `).run(newUserId, name, email, role, clientIp);
      } catch (e) {
        console.error('Failed to record register login audit:', e);
      }

      return res.status(201).json({
        message: 'Registration successful.',
        token: sessionToken,
        user: { id: newUserId, name, email, role }
      });
    } catch (err) {
      await db.prepare('ROLLBACK').run();
      throw err;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: `Failed to register user: ${error.message || 'server error'}` });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = verifyPassword(password, user.password_hash, user.password_salt);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(sessionToken, user.id, expiresAt);

    // Record login event in audit table
    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      await db.prepare(`
        INSERT INTO login_history (user_id, user_name, email, role, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `).run(user.id, user.name, user.email, user.role, clientIp);
    } catch (err) {
      console.error('Failed to log login audit history:', err);
    }

    return res.json({
      message: 'Login successful.',
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: `Login failed: ${error.message || 'server error'}` });
  }
});

// ----------------------------------------------------
// GOOGLE OAUTH ENDPOINTS
// ----------------------------------------------------
app.get('/api/auth/google/client-id', (req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID || '' });
});

app.post('/api/auth/google', async (req, res) => {
  const { credential, role, category, hourly_rate, bio } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Google credential token is required.' });
  }

  // Desired role from user selection (default: customer)
  const targetRole = ['customer', 'provider', 'admin'].includes(role) ? role : 'customer';

  try {
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!verifyRes.ok) {
      return res.status(401).json({ error: 'Invalid or expired Google token.' });
    }

    const payload = await verifyRes.json();

    // Security: ensure the token was issued for THIS app
    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ error: 'Google token audience mismatch.' });
    }

    const { email, name, sub } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Google account does not contain a verified email.' });
    }

    let user = await db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);

    if (!user) {
      const randomSecret = crypto.randomBytes(24).toString('hex');
      const { hash, salt } = hashPassword(randomSecret);
      const displayName = name || email.split('@')[0];
      const regInsert = await db.prepare(`
        INSERT INTO users (name, email, password_hash, password_salt, role)
        VALUES (?, ?, ?, ?, ?)
      `).run(displayName, email, hash, salt, targetRole);

      const newUserId = regInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email)).id;
      user = { id: newUserId, name: displayName, email, role: targetRole };

      // If registered as provider, initialize provider profile
      if (targetRole === 'provider') {
        const rate = parseFloat(hourly_rate) > 0 ? parseFloat(hourly_rate) : 600.00;
        const provCategory = category || 'Cleaning';
        await db.prepare(`
          INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count, status)
          VALUES (?, ?, ?, ?, 5.0, 0, 'approved')
        `).run(newUserId, provCategory, bio || 'Verified Google Service Professional', rate);
      }
    } else {
      // User exists. If targetRole was explicitly requested and differs, update role
      if (role && ['customer', 'provider', 'admin'].includes(role) && user.role !== targetRole) {
        await db.prepare('UPDATE users SET role = ? WHERE id = ?').run(targetRole, user.id);
        user.role = targetRole;
      }

      // If provider, ensure provider entry exists
      if (user.role === 'provider') {
        const prov = await db.prepare('SELECT user_id FROM providers WHERE user_id = ?').get(user.id);
        if (!prov) {
          const rate = parseFloat(hourly_rate) > 0 ? parseFloat(hourly_rate) : 600.00;
          const provCategory = category || 'Cleaning';
          await db.prepare(`
            INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count, status)
            VALUES (?, ?, ?, ?, 5.0, 0, 'approved')
          `).run(user.id, provCategory, bio || 'Verified Google Service Professional', rate);
        }
      }
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(sessionToken, user.id, expiresAt);

    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      await db.prepare(`
        INSERT INTO login_history (user_id, user_name, email, role, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `).run(user.id, user.name, user.email, user.role, clientIp);
    } catch (e) {
      console.error('Failed to record Google login audit:', e);
    }

    return res.json({
      message: 'Google login successful.',
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ error: `Google login failed: ${error.message || 'server error'}` });
  }
});

// Google Simulated / Fallback Authentication Endpoint
app.post('/api/auth/google-simulated', async (req, res) => {
  const { email, name, role, category, hourly_rate, bio } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const targetRole = ['customer', 'provider', 'admin'].includes(role) ? role : 'customer';
  const cleanEmail = email.trim().toLowerCase();
  const displayName = name || cleanEmail.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

  try {
    let user = await db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(cleanEmail);

    if (!user) {
      const randomSecret = crypto.randomBytes(24).toString('hex');
      const { hash, salt } = hashPassword(randomSecret);
      const regInsert = await db.prepare(`
        INSERT INTO users (name, email, password_hash, password_salt, role)
        VALUES (?, ?, ?, ?, ?)
      `).run(displayName, cleanEmail, hash, salt, targetRole);

      const newUserId = regInsert.lastInsertRowid || (await db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(cleanEmail)).id;
      user = { id: newUserId, name: displayName, email: cleanEmail, role: targetRole };

      if (targetRole === 'provider') {
        const rate = parseFloat(hourly_rate) > 0 ? parseFloat(hourly_rate) : 600.00;
        const provCategory = category || 'Cleaning';
        await db.prepare(`
          INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count, status)
          VALUES (?, ?, ?, ?, 5.0, 0, 'approved')
        `).run(newUserId, provCategory, bio || 'Verified Google Service Professional', rate);
      }
    } else {
      // If user exists and targetRole is specified and differs, update role
      if (role && ['customer', 'provider', 'admin'].includes(role) && user.role !== targetRole) {
        await db.prepare('UPDATE users SET role = ? WHERE id = ?').run(targetRole, user.id);
        user.role = targetRole;
      }

      if (user.role === 'provider') {
        const prov = await db.prepare('SELECT user_id FROM providers WHERE user_id = ?').get(user.id);
        if (!prov) {
          const rate = parseFloat(hourly_rate) > 0 ? parseFloat(hourly_rate) : 600.00;
          const provCategory = category || 'Cleaning';
          await db.prepare(`
            INSERT INTO providers (user_id, category, bio, hourly_rate, rating, review_count, status)
            VALUES (?, ?, ?, ?, 5.0, 0, 'approved')
          `).run(user.id, provCategory, bio || 'Verified Google Service Professional', rate);
        }
      }
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(sessionToken, user.id, expiresAt);

    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      await db.prepare(`
        INSERT INTO login_history (user_id, user_name, email, role, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `).run(user.id, user.name, user.email, user.role, clientIp);
    } catch (e) {
      console.error('Failed to record Google simulated login audit:', e);
    }

    return res.json({
      message: 'Google login successful.',
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google simulated auth error:', error);
    return res.status(500).json({ error: `Google login failed: ${error.message || 'server error'}` });
  }
});

// Logout
app.post('/api/auth/logout', authenticateSession, async (req, res) => {
  try {
    await db.prepare('DELETE FROM sessions WHERE token = ?').run(req.user.token);
    return res.json({ message: 'Logout successful.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Failed to logout.' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateSession, async (req, res) => {
  try {
    const userData = { ...req.user };

    if (userData.role === 'provider') {
      const providerInfo = await db.prepare(`
        SELECT category, bio, hourly_rate, rating, review_count, availability, status 
        FROM providers 
        WHERE user_id = ?
      `).get(userData.id);

      if (providerInfo) {
        userData.providerDetails = {
          ...providerInfo,
          availability: JSON.parse(providerInfo.availability || '{}')
        };
      }
    }

    return res.json({ user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});


// ----------------------------------------------------
// SERVICE CATEGORIES ENDPOINTS
// ----------------------------------------------------

const categoryServices = {
  Cleaning: ['Home cleaning', 'Deep cleaning', 'Kitchen cleaning', 'Bathroom cleaning', 'Water tank cleaning', 'Sofa and carpet cleaning'],
  Plumbing: ['Tap and faucet repair', 'Pipe leakage repair', 'Drain cleaning', 'Bathroom fitting', 'Water heater repair', 'Tank and pump service'],
  Electrical: ['Switch and socket repair', 'Fan installation', 'Light installation', 'Wiring repair', 'Inverter service', 'CCTV installation'],
  'Appliance Repair': ['AC service', 'Refrigerator repair', 'Washing machine repair', 'Microwave repair', 'TV repair', 'Geyser service'],
  'Beauty & Wellness': ['Haircut at home', 'Bridal makeup', 'Facial and cleanup', 'Manicure and pedicure', 'Massage therapy', 'Mehendi service'],
  'Pest Control': ['Termite control', 'Cockroach control', 'Mosquito treatment', 'Bed bug treatment', 'Rodent control', 'General pest inspection']
};

// Get All Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = (await db.prepare('SELECT * FROM categories').all()).map(category => ({
      ...category,
      services: categoryServices[category.name] || []
    }));
    return res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});


// ----------------------------------------------------
// PROVIDERS ENDPOINTS
// ----------------------------------------------------

// Get Active Providers (with filters)
app.get('/api/providers', async (req, res) => {
  const { category, search } = req.query;

  try {
    let query = `
      SELECT users.id, users.name, users.email, providers.category, providers.bio, 
             providers.hourly_rate, providers.rating, providers.review_count, providers.status
      FROM providers
      JOIN users ON providers.user_id = users.id
      WHERE providers.status = 'approved'
    `;
    const params = [];

    if (category) {
      query += ` AND providers.category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (users.name LIKE ? OR providers.bio LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const providers = await db.prepare(query).all(...params);
    return res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    return res.status(500).json({ error: 'Failed to fetch service providers.' });
  }
});

// Get Specific Provider Profile & Reviews
app.get('/api/providers/:id', async (req, res) => {
  const providerId = req.params.id;

  try {
    const provider = await db.prepare(`
      SELECT users.id, users.name, users.email, providers.category, providers.bio, 
             providers.hourly_rate, providers.rating, providers.review_count, providers.availability, providers.status
      FROM providers
      JOIN users ON providers.user_id = users.id
      WHERE users.id = ?
    `).get(providerId);

    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found.' });
    }

    // Parse availability
    provider.availability = JSON.parse(provider.availability || '{}');

    // Fetch reviews
    const reviews = await db.prepare(`
      SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at, users.name as customer_name
      FROM reviews
      JOIN users ON reviews.customer_id = users.id
      WHERE reviews.provider_id = ?
      ORDER BY reviews.created_at DESC
    `).all(providerId);

    return res.json({ provider, reviews });
  } catch (error) {
    console.error('Get provider details error:', error);
    return res.status(500).json({ error: 'Failed to retrieve provider profile.' });
  }
});

// Update Provider Profile (Bio, Rate, Availability, Category)
app.put('/api/providers/profile', authenticateSession, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Only service providers can perform this action.' });
  }

  const { bio, hourly_rate, availability, category } = req.body;

  if (hourly_rate === undefined) {
    return res.status(400).json({ error: 'Hourly rate is required.' });
  }

  try {
    const availabilityString = availability ? JSON.stringify(availability) : '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}';

    await db.prepare(`
      UPDATE providers 
      SET bio = ?, hourly_rate = ?, availability = ?, category = COALESCE(?, category) 
      WHERE user_id = ?
    `).run(bio || '', parseFloat(hourly_rate), availabilityString, category || null, req.user.id);

    return res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Update provider profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});


// ----------------------------------------------------
// BOOKINGS ENDPOINTS
// ----------------------------------------------------

// Create a Booking
app.post('/api/bookings', authenticateSession, async (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Only customers can book services.' });
  }

  const { provider_id, category, booking_date, booking_time, duration_hours, address, notes } = req.body;

  if (!provider_id || !category || !booking_date || !booking_time || !address) {
    return res.status(400).json({ error: 'Required fields: provider_id, category, booking_date, booking_time, address.' });
  }

  try {
    // Verify provider offers this category and get hourly rate
    const provider = await db.prepare(`
      SELECT hourly_rate, status FROM providers WHERE user_id = ? AND category = ?
    `).get(provider_id, category);

    if (!provider) {
      return res.status(400).json({ error: 'Selected provider does not offer this service.' });
    }

    if (provider.status !== 'approved') {
      return res.status(400).json({ error: 'Selected provider is not available for bookings.' });
    }

    const duration = parseInt(duration_hours || 1);
    const totalPrice = provider.hourly_rate * duration;

    await db.prepare(`
      INSERT INTO bookings (customer_id, provider_id, category, booking_date, booking_time, duration_hours, address, total_price, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(req.user.id, provider_id, category, booking_date, booking_time, duration, address, totalPrice, notes || '');

    const newBookingId = (await db.prepare('SELECT last_insert_rowid() as id').get()).id;

    return res.status(201).json({
      message: 'Booking created successfully.',
      bookingId: newBookingId,
      total_price: totalPrice
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// Get Bookings (with optional date range filtering)
app.get('/api/bookings', authenticateSession, async (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    let query = '';
    const params = [];

    if (req.user.role === 'customer') {
      query = `
         SELECT bookings.*, users.name as provider_name, users.email as provider_email,
           reviews.rating as review_rating, reviews.comment as review_comment
        FROM bookings
        LEFT JOIN users ON bookings.provider_id = users.id
        LEFT JOIN reviews ON reviews.booking_id = bookings.id
        WHERE bookings.customer_id = ?
      `;
      params.push(req.user.id);

      if (from_date) {
        query += ` AND bookings.booking_date >= ?`;
        params.push(from_date);
      }
      if (to_date) {
        query += ` AND bookings.booking_date <= ?`;
        params.push(to_date);
      }

      query += ` ORDER BY bookings.created_at DESC`;
    } else if (req.user.role === 'provider') {
      query = `
        SELECT bookings.*, users.name as customer_name, users.email as customer_email,
          reviews.rating as review_rating, reviews.comment as review_comment
        FROM bookings
        LEFT JOIN users ON bookings.customer_id = users.id
        LEFT JOIN reviews ON reviews.booking_id = bookings.id
        WHERE bookings.provider_id = ? OR (bookings.category = (SELECT category FROM providers WHERE user_id = ?) AND bookings.status != 'cancelled')
      `;
      params.push(req.user.id, req.user.id);

      if (from_date) {
        query += ` AND bookings.booking_date >= ?`;
        params.push(from_date);
      }
      if (to_date) {
        query += ` AND bookings.booking_date <= ?`;
        params.push(to_date);
      }

      query += ` ORDER BY bookings.created_at DESC`;
    } else if (req.user.role === 'admin') {
      query = `
        SELECT bookings.*, c.name as customer_name, p.name as provider_name
        FROM bookings
        LEFT JOIN users c ON bookings.customer_id = c.id
        LEFT JOIN users p ON bookings.provider_id = p.id
        WHERE 1=1
      `;

      if (from_date) {
        query += ` AND bookings.booking_date >= ?`;
        params.push(from_date);
      }
      if (to_date) {
        query += ` AND bookings.booking_date <= ?`;
        params.push(to_date);
      }

      query += ` ORDER BY bookings.created_at DESC`;
    }

    const bookings = await db.prepare(query).all(...params);
    return res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Dedicated Customer Expenditure Route by Date Range
app.get('/api/customer/expenditure', authenticateSession, async (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Only customers can access expenditure reports.' });
  }

  const { from_date, to_date } = req.query;

  try {
    let query = `
      SELECT bookings.*, users.name as provider_name, users.email as provider_email
      FROM bookings
      JOIN users ON bookings.provider_id = users.id
      WHERE bookings.customer_id = ?
        AND (bookings.status = 'completed' OR bookings.payment_status = 'paid_to_admin' OR bookings.status IN ('accepted', 'in_progress'))
    `;
    const params = [req.user.id];

    if (from_date) {
      query += ` AND bookings.booking_date >= ?`;
      params.push(from_date);
    }
    if (to_date) {
      query += ` AND bookings.booking_date <= ?`;
      params.push(to_date);
    }

    query += ` ORDER BY bookings.booking_date DESC`;

    const paidBookings = await db.prepare(query).all(...params);

    const totalSpent = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const count = paidBookings.length;
    const avgSpent = count > 0 ? totalSpent / count : 0;

    const categoryBreakdown = {};
    paidBookings.forEach(b => {
      const cat = b.category || 'Other';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { total: 0, count: 0 };
      }
      categoryBreakdown[cat].total += (b.total_price || 0);
      categoryBreakdown[cat].count += 1;
    });

    return res.json({
      from_date: from_date || null,
      to_date: to_date || null,
      totalSpent,
      totalBills: count,
      avgSpent,
      categoryBreakdown,
      bookings: paidBookings
    });
  } catch (error) {
    console.error('Fetch customer expenditure error:', error);
    return res.status(500).json({ error: 'Failed to retrieve expenditure statement.' });
  }
});

// Update Booking Status (Accept, Start, Complete, Cancel)
app.put('/api/bookings/:id/status', authenticateSession, async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  if (!status || !['pending', 'accepted', 'in_progress', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Valid status required.' });
  }

  try {
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Role validation
    if (req.user.role === 'customer') {
      // Customers can only cancel pending or accepted bookings
      if (booking.customer_id !== req.user.id) {
        return res.status(403).json({ error: 'You are not authorized for this booking.' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ error: 'Customers can only cancel bookings.' });
      }
      if (booking.status === 'in_progress' || booking.status === 'completed') {
        return res.status(400).json({ error: 'Cannot cancel a booking that has already started or completed.' });
      }
    } else if (req.user.role === 'provider') {
      // Providers can accept, start, complete, or reject (cancel)
      if (booking.provider_id !== req.user.id) {
        return res.status(403).json({ error: 'You are not assigned to this booking.' });
      }

      // Accept transitions
      if (status === 'accepted' && booking.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending bookings can be accepted.' });
      }
      // Start transitions
      if (status === 'in_progress' && booking.status !== 'accepted') {
        return res.status(400).json({ error: 'Only accepted bookings can be started.' });
      }
      // Complete transitions (allowed from accepted or in_progress)
      if (status === 'completed' && !['accepted', 'in_progress', 'pending'].includes(booking.status)) {
        return res.status(400).json({ error: 'Cannot complete this booking.' });
      }
      // Cancel (reject) transitions
      if (status === 'cancelled' && (booking.status === 'completed' || booking.status === 'cancelled')) {
        return res.status(400).json({ error: 'Cannot cancel a completed or already cancelled booking.' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    // Update status and provider_completed flag
    if (status === 'completed') {
      if (req.user.role === 'provider') {
        // Provider finished their work; mark provider_completed = 1 for Admin verification
        await db.prepare('UPDATE bookings SET provider_completed = 1, status = \'in_progress\' WHERE id = ?').run(bookingId);
        return res.json({ message: 'Work marked completed successfully! Sent to Admin for verification and confirmation.' });
      } else {
        await db.prepare('UPDATE bookings SET status = ?, provider_completed = 1 WHERE id = ?').run(status, bookingId);
        return res.json({ message: `Booking status updated to ${status}.` });
      }
    } else {
      await db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, bookingId);
      return res.json({ message: `Booking status updated to ${status}.` });
    }
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({ error: 'Failed to update booking status.' });
  }
});


// ----------------------------------------------------
// REVIEWS ENDPOINTS
// ----------------------------------------------------

// Submit a Review
app.post('/api/bookings/:id/review', authenticateSession, async (req, res) => {
  const bookingId = req.params.id;
  const { rating, comment } = req.body;

  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Only customers can review services.' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  try {
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to review this booking.' });
    }

    if (booking.admin_completion_confirmed !== 1) {
      return res.status(400).json({ error: 'Customer rating is locked until Admin verifies and confirms provider work completion.' });
    }

    // Check if review already exists
    const existing = await db.prepare('SELECT id FROM reviews WHERE booking_id = ?').get(bookingId);
    if (existing) {
      return res.status(400).json({ error: 'This booking has already been reviewed.' });
    }

    // Insert Review and Update Provider aggregate stats atomically
    await db.prepare('BEGIN TRANSACTION').run();
    try {
      await db.prepare(`
        INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)
      `).run(bookingId, req.user.id, booking.provider_id, rating, comment || '');

      await db.prepare(`
        UPDATE bookings SET status = 'completed' WHERE id = ?
      `).run(bookingId);

      // Fetch all reviews for this provider to recalculate average rating
      const reviewStats = await db.prepare(`
        SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE provider_id = ?
      `).get(booking.provider_id);

      const avg = Number(reviewStats?.avg_rating || rating);
      const count = Number(reviewStats?.count || 1);

      await db.prepare(`
        UPDATE providers 
        SET rating = ?, review_count = ? 
        WHERE user_id = ?
      `).run(parseFloat(avg.toFixed(1)), count, booking.provider_id);

      await db.prepare('COMMIT').run();

      return res.status(201).json({ message: 'Review submitted successfully.' });
    } catch (err) {
      await db.prepare('ROLLBACK').run();
      throw err;
    }
  } catch (error) {
    console.error('Review submit error:', error);
    return res.status(500).json({ error: `Failed to submit review: ${error.message || 'server error'}` });
  }
});

// ----------------------------------------------------
// COMPLAINTS & ESCALATIONS ENDPOINTS
// ----------------------------------------------------

// Submit a Customer Complaint
app.post('/api/complaints', authenticateSession, async (req, res) => {
  const { booking_id, subject, description, priority } = req.body;

  if (!booking_id || !subject || !description) {
    return res.status(400).json({ error: 'Booking ID, subject, and description are required.' });
  }

  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Only customers can raise complaints.' });
  }

  try {
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to raise complaint for this booking.' });
    }

    await db.prepare(`
      INSERT INTO complaints (booking_id, customer_id, provider_id, subject, description, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `).run(booking_id, req.user.id, booking.provider_id, subject, description, priority || 'Medium');

    return res.status(201).json({ message: 'Complaint registered successfully. Admin will review your escalation.' });
  } catch (error) {
    console.error('Submit complaint error:', error);
    return res.status(500).json({ error: 'Failed to submit complaint.' });
  }
});

// Get Complaints List
app.get('/api/complaints', authenticateSession, async (req, res) => {
  try {
    let complaints = [];
    if (req.user.role === 'customer') {
      complaints = await db.prepare(`
        SELECT complaints.*, p.name as provider_name, bookings.category, bookings.booking_date
        FROM complaints
        JOIN users p ON complaints.provider_id = p.id
        JOIN bookings ON complaints.booking_id = bookings.id
        WHERE complaints.customer_id = ?
        ORDER BY complaints.created_at DESC
      `).all(req.user.id);
    } else if (req.user.role === 'admin') {
      complaints = await db.prepare(`
        SELECT complaints.*, c.name as customer_name, p.name as provider_name, bookings.category, bookings.booking_date
        FROM complaints
        JOIN users c ON complaints.customer_id = c.id
        JOIN users p ON complaints.provider_id = p.id
        JOIN bookings ON complaints.booking_id = bookings.id
        ORDER BY complaints.created_at DESC
      `).all();
    } else if (req.user.role === 'provider') {
      complaints = await db.prepare(`
        SELECT complaints.*, c.name as customer_name, bookings.category, bookings.booking_date
        FROM complaints
        JOIN users c ON complaints.customer_id = c.id
        JOIN bookings ON complaints.booking_id = bookings.id
        WHERE complaints.provider_id = ?
        ORDER BY complaints.created_at DESC
      `).all(req.user.id);
    }

    return res.json(complaints);
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return res.status(500).json({ error: 'Failed to retrieve complaints.' });
  }
});

// Admin Resolve / Update Complaint Status
app.put('/api/admin/complaints/:id/resolve', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const complaintId = req.params.id;
  const { status, resolution_notes } = req.body;

  if (!status || !['Pending', 'Investigating', 'Resolved', 'Dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Valid complaint status required.' });
  }

  try {
    await db.prepare(`
      UPDATE complaints 
      SET status = ?, resolution_notes = ? 
      WHERE id = ?
    `).run(status, resolution_notes || '', complaintId);

    return res.json({ message: `Complaint status updated to ${status}.` });
  } catch (error) {
    console.error('Resolve complaint error:', error);
    return res.status(500).json({ error: 'Failed to update complaint.' });
  }
});


// ----------------------------------------------------
// CHAT MESSAGES ENDPOINTS
// ----------------------------------------------------

// Send Chat Message
app.post('/api/messages', authenticateSession, async (req, res) => {
  const { booking_id, message } = req.body;

  if (!booking_id || !message) {
    return res.status(400).json({ error: 'Booking ID and message text are required.' });
  }

  try {
    // Validate booking and fetch participants
    const booking = await db.prepare('SELECT customer_id, provider_id FROM bookings WHERE id = ?').get(booking_id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Verify sender is customer or provider in this booking
    let receiverId = null;
    if (req.user.id === booking.customer_id) {
      receiverId = booking.provider_id;
    } else if (req.user.id === booking.provider_id) {
      receiverId = booking.customer_id;
    } else {
      return res.status(403).json({ error: 'You are not authorized to participate in this chat.' });
    }

    const msgInsert = await db.prepare(`
      INSERT INTO messages (sender_id, receiver_id, booking_id, message)
      VALUES (?, ?, ?, ?)
    `).run(req.user.id, receiverId, booking_id, message);

    const newMessage = await db.prepare(`
      SELECT messages.*, users.name as sender_name 
      FROM messages
      JOIN users ON messages.sender_id = users.id
      WHERE messages.id = ?
    `).get(msgInsert.lastInsertRowid);

    // Setup a simulated response for demonstration purposes
    setTimeout(async () => {
      try {
        let senderIdSimulated = receiverId;
        let receiverIdSimulated = req.user.id;

        let replies = [];
        if (req.user.role === 'customer') {
          replies = [
            `Hi! I received your message. I am preparing the tools and will be there on time.`,
            `Hello! Yes, that works for me. Let me know if you need any other details.`,
            `Sounds great! I'll see you at the scheduled time.`,
            `Got your message. I'm looking forward to helping you out!`
          ];
        } else {
          replies = [
            `Perfect! Thank you for the update.`,
            `Sounds good, see you soon!`,
            `Great, I'll make sure someone is home.`,
            `Thanks for letting me know!`
          ];
        }

        const randomMsg = replies[Math.floor(Math.random() * replies.length)];

        await db.prepare(`
          INSERT INTO messages (sender_id, receiver_id, booking_id, message)
          VALUES (?, ?, ?, ?)
        `).run(senderIdSimulated, receiverIdSimulated, booking_id, randomMsg);
      } catch (simErr) {
        console.error('Simulation message insert failed:', simErr);
      }
    }, 2000);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
});

// Retrieve Chat History for Booking
app.get('/api/messages/:bookingId', authenticateSession, async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    const booking = await db.prepare('SELECT customer_id, provider_id FROM bookings WHERE id = ?').get(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Verify requester is part of booking
    if (req.user.id !== booking.customer_id && req.user.id !== booking.provider_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Mark messages sent to current user as read
    await db.prepare('UPDATE messages SET is_read = 1 WHERE booking_id = ? AND receiver_id = ?').run(bookingId, req.user.id);

    // Retrieve chat log
    const chatLog = await db.prepare(`
      SELECT messages.*, users.name as sender_name
      FROM messages
      JOIN users ON messages.sender_id = users.id
      WHERE messages.booking_id = ?
      ORDER BY messages.created_at ASC
    `).all(bookingId);

    return res.json(chatLog);
  } catch (error) {
    console.error('Get chat error:', error);
    return res.status(500).json({ error: 'Failed to retrieve chat messages.' });
  }
});


// ----------------------------------------------------
// ADMIN DASHBOARD ENDPOINTS
// ----------------------------------------------------

// Admin Approve & Allocate Provider to Customer Request
app.put('/api/admin/bookings/:id/allocate', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const { provider_id } = req.body;
  const bookingId = req.params.id;

  if (!provider_id) {
    return res.status(400).json({ error: 'Provider selection is required for allocation.' });
  }

  try {
    const provider = await db.prepare(`
      SELECT user_id, category, hourly_rate FROM providers WHERE user_id = ?
    `).get(provider_id);

    if (!provider) {
      return res.status(404).json({ error: 'Selected provider not found.' });
    }

    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking request not found.' });
    }

    // Calculate pricing & platform profit split
    const totalPrice = provider.hourly_rate * (booking.duration_hours || 1);
    const adminMargin = totalPrice * 0.20; // 20% Admin Platform Revenue
    const providerPayout = totalPrice * 0.80; // 80% Net Provider Payout

    await db.prepare(`
      UPDATE bookings 
      SET provider_id = ?, admin_approved = 1, status = 'accepted', total_price = ?, admin_margin = ?, provider_payout = ?
      WHERE id = ?
    `).run(provider_id, totalPrice, adminMargin, providerPayout, bookingId);

    return res.json({ 
      message: 'Customer service request approved and provider allocated successfully!',
      allocated_provider_id: provider_id,
      total_price: totalPrice
    });
  } catch (error) {
    console.error('Allocate error:', error);
    return res.status(500).json({ error: 'Failed to allocate provider.' });
  }
});

// Customer Pay to Admin Escrow
app.post('/api/bookings/:id/pay-admin', authenticateSession, async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    const totalPrice = booking.total_price || 100;
    const adminMargin = totalPrice * 0.20;
    const providerPayout = totalPrice * 0.80;

    await db.prepare(`
      UPDATE bookings 
      SET payment_status = 'paid_to_admin', admin_margin = ?, provider_payout = ?
      WHERE id = ?
    `).run(adminMargin, providerPayout, bookingId);

    return res.json({ 
      message: 'Payment received by Admin Escrow successfully.',
      totalReceived: totalPrice,
      adminMargin,
      providerPayout
    });
  } catch (error) {
    console.error('Pay admin error:', error);
    return res.status(500).json({ error: 'Failed to record payment.' });
  }
});

// Admin Disburse Payment to Provider
app.put('/api/admin/bookings/:id/disburse', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const bookingId = req.params.id;

  try {
    await db.prepare(`
      UPDATE bookings SET payout_status = 'disbursed' WHERE id = ?
    `).run(bookingId);

    return res.json({ message: 'Payment disbursed to provider successfully.' });
  } catch (error) {
    console.error('Disburse error:', error);
    return res.status(500).json({ error: 'Failed to disburse payment.' });
  }
});

// Admin Confirm Provider Work Completion & Authorize Customer Rating
app.put('/api/admin/bookings/:id/confirm-completion', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const bookingId = req.params.id;

  try {
    await db.prepare(`
      UPDATE bookings 
      SET admin_completion_confirmed = 1, status = 'completed' 
      WHERE id = ?
    `).run(bookingId);

    return res.json({ message: 'Service completion confirmed by Admin. Customer rating unlocked successfully!' });
  } catch (error) {
    console.error('Confirm completion error:', error);
    return res.status(500).json({ error: 'Failed to confirm completion.' });
  }
});

// Admin Dashboard stats & Financial Ledger
app.get('/api/admin/stats', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const totalUsers = (await db.prepare("SELECT COUNT(*) as count FROM users WHERE role != 'admin'").get()).count;
    const totalProviders = (await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'provider'").get()).count;
    const totalBookings = (await db.prepare('SELECT COUNT(*) as count FROM bookings').get()).count;

    const earningsRes = await db.prepare("SELECT SUM(total_price) as sum FROM bookings WHERE status = 'completed' OR payment_status = 'paid_to_admin'").get();
    const totalEarnings = earningsRes.sum || 0;

    const profitRes = await db.prepare("SELECT SUM(admin_margin) as sum FROM bookings WHERE payment_status = 'paid_to_admin' OR status = 'completed'").get();
    const totalAdminProfit = profitRes.sum || (totalEarnings * 0.20);

    const disbursedRes = await db.prepare("SELECT SUM(provider_payout) as sum FROM bookings WHERE payout_status = 'disbursed'").get();
    const totalDisbursedToProviders = disbursedRes.sum || 0;

    const bookingsByStatus = await db.prepare(`
      SELECT status, COUNT(*) as count FROM bookings GROUP BY status
    `).all();

    const categoryPopularity = await db.prepare(`
      SELECT category, COUNT(*) as count FROM bookings GROUP BY category ORDER BY count DESC
    `).all();

    const allBookings = await db.prepare(`
      SELECT bookings.*, c.name as customer_name, p.name as provider_name
      FROM bookings
      LEFT JOIN users c ON bookings.customer_id = c.id
      LEFT JOIN users p ON bookings.provider_id = p.id
      ORDER BY bookings.created_at DESC
    `).all();

    const approvedProviders = await db.prepare(`
      SELECT users.id, users.name, providers.category, providers.hourly_rate
      FROM users
      JOIN providers ON users.id = providers.user_id
      WHERE providers.status = 'approved'
    `).all();

    const loginHistory = await db.prepare(`
      SELECT * FROM login_history ORDER BY id DESC LIMIT 50
    `).all();

    const allReviews = await db.prepare(`
      SELECT reviews.*, c.name as customer_name, p.name as provider_name, bookings.category, bookings.booking_date
      FROM reviews
      JOIN users c ON reviews.customer_id = c.id
      JOIN users p ON reviews.provider_id = p.id
      JOIN bookings ON reviews.booking_id = bookings.id
      ORDER BY reviews.created_at DESC
    `).all();

    const allComplaints = await db.prepare(`
      SELECT complaints.*, c.name as customer_name, p.name as provider_name, bookings.category, bookings.booking_date
      FROM complaints
      JOIN users c ON complaints.customer_id = c.id
      JOIN users p ON complaints.provider_id = p.id
      JOIN bookings ON complaints.booking_id = bookings.id
      ORDER BY complaints.created_at DESC
    `).all();

    return res.json({
      stats: {
        totalUsers,
        totalProviders,
        totalBookings,
        totalEarnings,
        totalAdminProfit,
        totalDisbursedToProviders
      },
      bookingsByStatus,
      categoryPopularity,
      allBookings,
      approvedProviders,
      loginHistory,
      allReviews,
      allComplaints
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ error: 'Failed to load stats.' });
  }
});

// Admin Users List
app.get('/api/admin/users', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  try {
    const users = await db.prepare(`
      SELECT users.id, users.name, users.email, users.role, users.created_at,
             providers.category, providers.hourly_rate, providers.status as provider_status
      FROM users
      LEFT JOIN providers ON users.id = providers.user_id
      WHERE users.role != 'admin'
      ORDER BY users.id DESC
    `).all();

    return res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({ error: 'Failed to fetch users list.' });
  }
});

// Admin Toggle User/Provider Block status
app.put('/api/admin/users/:id/status', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const userId = req.params.id;
  const { status } = req.body; // 'approved' or 'suspended'

  if (!status || !['approved', 'suspended', 'pending_approval'].includes(status)) {
    return res.status(400).json({ error: 'Valid status required.' });
  }

  try {
    const provider = await db.prepare('SELECT * FROM providers WHERE user_id = ?').get(userId);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found.' });
    }

    await db.prepare('UPDATE providers SET status = ? WHERE user_id = ?').run(status, userId);
    return res.json({ message: 'Provider status updated successfully.' });
  } catch (error) {
    console.error('Admin toggle status error:', error);
    return res.status(500).json({ error: 'Failed to update user status.' });
  }
});

// Admin Manage Categories (Create, Update, Delete)
app.post('/api/admin/categories', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const { name, icon, description } = req.body;
  if (!name || !icon) {
    return res.status(400).json({ error: 'Category name and icon key are required.' });
  }

  try {
    await db.prepare('INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)')
      .run(name, icon, description || '');
    return res.status(201).json({ message: 'Category created successfully.' });
  } catch (error) {
    console.error('Admin create category error:', error);
    return res.status(500).json({ error: 'Failed to create category (name may already exist).' });
  }
});

app.delete('/api/admin/categories/:id', authenticateSession, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const categoryId = req.params.id;

  try {
    await db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);
    return res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Admin delete category error:', error);
    return res.status(500).json({ error: 'Failed to delete category.' });
  }
});


// ----------------------------------------------------
// SINGLE PAGE APPLICATION SPA ROUTING FALLBACK
// ----------------------------------------------------
app.get('*', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});