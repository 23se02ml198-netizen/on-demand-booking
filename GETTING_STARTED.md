# 🚀 Getting Started with ApexServices

> **5-Minute Setup Guide**

## What is ApexServices?

ApexServices is a complete web application for booking home services like cleaning, plumbing, electrical work, and more. Think of it like Uber but for home services!

## What You'll Need

- **Computer** (Windows, Mac, or Linux)
- **Internet Connection** (to download Node.js)
- **15 Minutes** of time

---

## Step-by-Step Installation

### ✅ Step 1: Download Node.js (5 minutes)

1. Go to: https://nodejs.org/
2. Click **"Download LTS"** (Long Term Support version)
3. Run the installer and click **"Next"** through all screens
4. When asked about tools, just accept defaults and click **"Install"**
5. Restart your computer when prompted

### ✅ Step 2: Verify Installation

1. Press **Windows Key + R** (Windows) or open **Terminal** (Mac/Linux)
2. Type: `node --version`
3. You should see something like: `v22.1.0`
4. If you see an error, restart your computer

### ✅ Step 3: Open Project

1. Open **File Explorer** (Windows) or **Finder** (Mac)
2. Navigate to: `C:\Users\[YourName]\Documents\On-Demand Service Booking and Management System`
3. Right-click in empty space → **Open Terminal here** (Windows) or **New Terminal at Folder** (Mac)

### ✅ Step 4: Install Dependencies (2 minutes)

In the terminal, type:
```bash
npm install
```

Wait for it to finish (you'll see many lines of text). This downloads required libraries.

### ✅ Step 5: Initialize Database (1 minute)

In the terminal, type:
```bash
npm run seed
```

This creates the database with sample data and test accounts.

### ✅ Step 6: Start Server (< 1 minute)

In the terminal, type:
```bash
npm start
```

You should see:
```
Server running at http://localhost:3000
```

### ✅ Step 7: Open in Browser

1. Open your browser (Chrome, Firefox, Edge, Safari)
2. Go to: **http://localhost:3000**
3. You should see the ApexServices homepage!

---

## 🎯 Try It Out!

### Login as Admin
- Email: `admin@services.com`
- Password: `admin123`

### Login as Customer
- Email: `alice@example.com`
- Password: `alice123`

### Login as Service Provider
- Email: `john@plumbing.com`
- Password: `john123`

---

## 📝 Different User Experiences

### 👤 As a Customer
1. Browse available service providers
2. View provider profiles and ratings
3. Book a service with date and time
4. Chat with provider before/during service
5. Leave reviews after completion

### 🔧 As a Provider
1. Set your service category and hourly rate
2. View customer booking requests
3. Accept or reject requests
4. Track service appointments
5. Chat with customers
6. Build your ratings through reviews

### 🛡️ As Admin
1. View system statistics (total bookings, earnings, etc.)
2. Manage all user accounts
3. Approve or suspend service providers
4. Add or remove service categories
5. Monitor all platform activity

---

## ⚙️ Stopping the Server

Press **Ctrl + C** in the terminal where the server is running.

To start again, type: `npm start`

---

## 📁 Project Files Explained

```
├── server.js              ← Backend logic
├── database.js            ← Database setup
├── package.json           ← Dependencies list
├── public/
│   ├── index.html        ← Main webpage
│   ├── app.js            ← Frontend logic
│   ├── components.js     ← UI pieces
│   └── styles.css        ← Design/colors
└── services.db           ← Database (created after npm run seed)
```

---

## 🐛 Troubleshooting

### "npm: command not found"
**Solution:** Restart your computer after installing Node.js, then try again.

### "Port 3000 already in use"
**Solution:** Close any other browser tabs or terminal windows running the project, or use a different port:
```bash
set PORT=5000 && npm start    (Windows)
PORT=5000 npm start           (Mac/Linux)
```

### "services.db not found"
**Solution:** Run `npm run seed` again to create the database.

### Can't login
**Solution:** 
1. Check the email/password are exactly as shown above
2. Run `npm run seed` again
3. Close browser and reopen http://localhost:3000

### Blank page or errors
**Solution:**
1. Open browser DevTools: Press **F12**
2. Look for red error messages in the Console tab
3. Take a screenshot and share the error

---

## 🎓 What You Just Built

Congratulations! You now have a fully functional service booking platform with:

✅ User authentication
✅ Service provider profiles
✅ Booking management
✅ Real-time chat
✅ Reviews & ratings
✅ Admin dashboard
✅ Modern glassmorphism UI

---

## 📚 Learn More

- **Setup Details:** See [SETUP.md](SETUP.md)
- **API Reference:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Project Checklist:** See [CHECKLIST.md](CHECKLIST.md)
- **Full README:** See [README.md](README.md)

---

## 🎉 Next Steps

1. **Explore the app** - Try all features as different user types
2. **Customize** - Change colors, text, or add features
3. **Deploy** - Put your app online (future guide)
4. **Learn** - Study the code to understand how it works

---

## 💬 Need Help?

1. Check the browser console for error messages (F12)
2. Verify database: Run `npm run seed` again
3. Restart the server: Ctrl+C, then `npm start`
4. Reread this guide - answers are usually here!

---

**Happy booking! 🎉**

Questions? Issues? Check [SETUP.md](SETUP.md) for complete documentation.

