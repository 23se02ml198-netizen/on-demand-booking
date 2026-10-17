# ApexServices - On-Demand Service Booking System 🚀

A modern, full-stack web application for booking and managing on-demand home services. Built with Express.js and SQLite.

## 📸 Features

- 👥 **Multi-Role System**: Customers, Service Providers, Admins
- 📅 **Booking Management**: Create, track, and manage service bookings
- 💬 **Real-time Chat**: Communicate between customers and providers
- ⭐ **Reviews & Ratings**: Rate and review completed services
- 📊 **Admin Dashboard**: System statistics and user management
- 🔍 **Search & Filter**: Find services by category or search terms
- 🔐 **Secure Auth**: Password hashing and session-based authentication
- 🎨 **Modern UI**: Glassmorphism design with smooth animations

## ⚡ Quick Start

### Prerequisites
- Node.js v22+ (with built-in SQLite support)
- npm

### Installation (3 Steps)

```bash
# Step 1: Install dependencies
npm install

# Step 2: Initialize database with seed data
npm run seed

# Step 3: Start the server
npm start
```

Open your browser and go to: **http://localhost:3000**

## 🎯 Default Test Accounts

**Admin**
- Email: `admin@services.com`
- Password: `admin123`

**Customers**
- Email: `alice@example.com` / `bob@example.com`
- Password: `alice123` / `bob123`

**Providers**
- John (Plumber): `john@plumbing.com` / `john123`
- Sarah (Cleaner): `sarah@cleaning.com` / `sarah123`
- Mike (Electrician): `mike@electrical.com` / `mike123`
- Elena (Beautician): `elena@beauty.com` / `elena123`

## 📁 Project Structure

```
├── server.js              # Express backend & API routes
├── database.js            # SQLite setup & seeding
├── package.json           # Dependencies
├── public/
│   ├── index.html        # Main HTML
│   ├── app.js            # Frontend logic & routing
│   ├── components.js     # UI components
│   └── styles.css        # Glassmorphism styling
└── SETUP.md              # Detailed documentation
```

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/categories` | Get service categories |
| GET | `/api/providers` | List providers |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/:id/status` | Update booking status |
| POST | `/api/messages` | Send chat message |
| POST | `/api/bookings/:id/review` | Submit review |

See [SETUP.md](SETUP.md) for complete API documentation.
## 🎨 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (built-in `node:sqlite`)
- **Frontend**: Vanilla JavaScript, CSS3
- **Authentication**: Session tokens with expiry
- **Security**: Password hashing with crypto.scryptSync

## 📊 Database Schema

- **users** - User accounts (customers, providers, admins)
- **providers** - Service provider profiles
- **categories** - Service categories
- **bookings** - Service booking records
- **reviews** - Customer reviews and ratings
- **messages** - Chat messages between users
- **sessions** - Active user sessions

## 🔐 Security Features

✅ Password hashing with salt
✅ Session token authentication (7-day expiry)
✅ Role-based access control
✅ Input validation on all endpoints
✅ CORS protection

## 🛠️ Configuration

Default port: **3000**

Change port:
```bash
set PORT=5000 && npm start     # Windows
PORT=5000 npm start            # macOS/Linux
```

## 🐛 Troubleshooting

**"npm not found"**
→ Install Node.js from https://nodejs.org/

**"Port 3000 already in use"**
→ Change port using the command above

**"Database error"**
→ Run `npm run seed` to initialize

**Login fails**
→ Verify database initialized with `npm run seed`

## 📖 Documentation

- [Complete Setup Guide](SETUP.md) - Detailed configuration & workflows
- [API Reference](SETUP.md#-api-endpoints) - All endpoints documented
- [Troubleshooting](SETUP.md#-troubleshooting) - Common issues & solutions

## 👥 Role-Based Workflows

### Customer
1. Browse available service providers
2. Book a service with date/time/location
3. Chat with provider before service
4. Track booking in real-time
5. Leave reviews after completion

### Service Provider
1. Create profile with service category & hourly rate
2. Manage availability and bio
3. Accept/reject customer bookings
4. Start, track, and complete services
5. Build reputation through reviews

### Administrator
1. View system statistics & analytics
2. Manage user accounts and providers
3. Approve/suspend providers
4. Manage service categories
5. Monitor all bookings

## 📞 Support

For issues or questions:
1. Check browser console (Ctrl+Shift+J)
2. Review [SETUP.md](SETUP.md) troubleshooting section
3. Verify database initialization
4. Test with default accounts

## 📄 License

MIT License - Free for educational and commercial use

---

**Built with ❤️ for modern service booking**

