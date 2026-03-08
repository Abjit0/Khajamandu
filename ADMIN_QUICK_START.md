# 🚀 Admin Dashboard - Quick Start

## ✅ Fixed: Module Not Found Error

The `create-admin.cjs` script has been moved to the `backend` folder where all dependencies exist.

---

## 📝 How to Create Admin Account

### **Step 1: Navigate to backend folder**
```bash
cd backend
```

### **Step 2: Run the script**
```bash
node create-admin.cjs
```

### **Expected Output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

✅ Admin account created successfully!

📋 Admin Credentials:
   Email: admin@khajamandu.com
   Password: admin123

🌐 Login at: http://localhost:5173/admin
   (Make sure the web app is running with: npm run dev)

🔌 Database connection closed
```

---

## 🌐 How to Access Admin Dashboard

### **Step 1: Start Backend Server**
```bash
cd backend
node index.js
```

### **Step 2: Start Web App (in new terminal)**
```bash
# From project root
npm run dev
```

### **Step 3: Open Browser**
Go to: `http://localhost:5173/admin`

### **Step 4: Login**
- Email: `admin@khajamandu.com`
- Password: `admin123`

---

## 🎯 What You Can Do

✅ View dashboard statistics (users, restaurants, riders, orders)
✅ Approve pending restaurants with one click
✅ Approve pending riders with one click
✅ Reject users with one click
✅ View all users in the system
✅ See recent orders

---

## 📱 Testing the Flow

### **Test Restaurant Approval:**

1. **On Mobile App:** Sign up as restaurant
2. **On Admin Dashboard:** 
   - Click "⏳ Pending Approvals"
   - See the new restaurant
   - Click "✅ Approve"
3. **On Mobile App:** 
   - Logout and login again
   - Restaurant can now access all features!

---

## 🐛 Troubleshooting

**If script fails:**
- Make sure you're in the `backend` folder
- Check that backend dependencies are installed: `npm install`
- Verify MongoDB is running and `.env` file exists

**If admin already exists:**
- Script will show: "⚠️ Admin account already exists!"
- You can login with existing credentials

**If can't login to dashboard:**
- Make sure backend server is running
- Make sure web app is running (`npm run dev`)
- Check browser console for errors

---

## 📂 File Locations

- **Admin Script:** `backend/create-admin.cjs`
- **Admin Dashboard:** `src/AdminPannel/AdminDashboard.jsx`
- **Admin Routes:** `src/App.jsx` (route: `/admin`)
- **Backend API:** `backend/controllers/adminController.js`

---

## ✨ Summary

The admin dashboard is now ready to use! Just run the script from the backend folder, start your servers, and access it at `http://localhost:5173/admin`.

For detailed documentation, see: `ADMIN_DASHBOARD_SETUP.md`
