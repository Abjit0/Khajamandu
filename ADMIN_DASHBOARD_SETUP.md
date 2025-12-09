# 👨‍💼 Admin Dashboard Setup Guide

## 🎯 Overview

A complete web-based admin dashboard for managing Khajamandu platform.

---

## 🚀 Quick Start

### **Step 1: Create Admin Account**

```bash
cd backend
node create-admin.cjs
```

**Output:**
```
✅ Admin account created successfully!

📋 Admin Credentials:
   Email: admin@khajamandu.com
   Password: admin123

🌐 Login at: http://localhost:5173/admin
```

---

### **Step 2: Start Backend Server**

```bash
cd backend
node index.js
```

---

### **Step 3: Start Web Admin Dashboard**

```bash
# In project root
npm run dev
```

**Or:**
```bash
npm start
```

---

### **Step 4: Access Admin Dashboard**

Open browser and go to:
```
http://localhost:5173/admin
```

**Login with:**
- Email: `admin@khajamandu.com`
- Password: `admin123`

---

## 📊 **Features**

### **1. Dashboard Overview**
- Total Users
- Total Restaurants (approved)
- Total Riders (approved)
- Total Customers
- Pending Approvals (with count)
- Total Orders
- Total Revenue
- Today's Orders
- Recent Orders List

### **2. Pending Approvals**
- View all pending restaurants
- View all pending riders
- See complete details:
  - Name, Email, Phone
  - Restaurant name, cuisine, address
  - Rider vehicle type, license number
  - Registration date
- **One-click Approve** ✅
- **One-click Reject** ❌

### **3. All Users**
- View all users in the system
- Filter by role
- See approval status
- Registration dates

---

## 🎨 **Screenshots**

### **Login Page:**
```
┌─────────────────────────────┐
│   🍽️ Khajamandu Admin       │
│   Admin Dashboard Login     │
│                             │
│   [Email Input]             │
│   [Password Input]          │
│   [Login Button]            │
└─────────────────────────────┘
```

### **Dashboard:**
```
┌──────────┬────────────────────────────────┐
│          │  Dashboard Overview            │
│ 📊 Dash  │  ┌────┬────┬────┬────┐        │
│ ⏳ Pend  │  │Users│Rest│Ride│Cust│        │
│ 👥 Users │  └────┴────┴────┴────┘        │
│ 🚪 Logout│  Recent Orders Table           │
│          │  [Order list...]               │
└──────────┴────────────────────────────────┘
```

### **Pending Approvals:**
```
┌────────────────────────────────────┐
│ Pending Approvals (3)              │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Pokhara Pizza                │  │
│ │ Restaurant                   │  │
│ │ Email: restaurant@test.com   │  │
│ │ Cuisine: Italian             │  │
│ │ [✅ Approve] [❌ Reject]     │  │
│ └──────────────────────────────┘  │
└────────────────────────────────────┘
```

---

## 🔐 **API Endpoints**

All admin endpoints require authentication:

```javascript
Headers: {
  Authorization: 'Bearer <admin_token>'
}
```

### **Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/pending` | Pending approvals |
| POST | `/api/admin/approve/:userId` | Approve user |
| DELETE | `/api/admin/reject/:userId` | Reject user |
| GET | `/api/admin/orders` | Recent orders |

---

## 📝 **Usage Flow**

### **Approve Restaurant:**

1. Login to admin dashboard
2. Click "⏳ Pending Approvals"
3. See list of pending restaurants
4. Review restaurant details
5. Click "✅ Approve"
6. Restaurant can now login and use the app!

### **Approve Rider:**

1. Same as restaurant
2. Review rider details (vehicle, license)
3. Click "✅ Approve"
4. Rider can now accept deliveries!

### **Reject User:**

1. Click "❌ Reject"
2. Confirm deletion
3. User account is permanently deleted

---

## 🎯 **Benefits**

✅ **No Command Line** - Everything in GUI
✅ **One-Click Actions** - Approve/Reject instantly
✅ **Real-Time Stats** - See platform metrics
✅ **User Details** - All info in one place
✅ **Desktop Optimized** - Perfect for web browsers
✅ **Secure** - Admin-only access with JWT

---

## 🔧 **Configuration**

### **Change Admin Credentials:**

Edit `backend/create-admin.cjs`:
```javascript
const adminEmail = 'your-email@example.com';
const adminPassword = 'your-secure-password';
```

Then run:
```bash
cd backend
node create-admin.cjs
```

---

## 🐛 **Troubleshooting**

### **Can't Login:**
- Make sure you created admin account: `cd backend && node create-admin.cjs`
- Check backend is running: `cd backend && node index.js`
- Verify credentials: `admin@khajamandu.com` / `admin123`

### **Pending Approvals Not Showing:**
- Check if there are any pending users in database
- Test by creating a restaurant account from mobile app

### **API Errors:**
- Check backend console for errors
- Verify JWT token is valid
- Make sure admin role is set correctly

---

## 📱 **Mobile App Integration**

### **Restaurant Signup Flow:**
```
1. User signs up as restaurant on mobile
2. Account created with isApproved: false
3. Admin sees in "Pending Approvals"
4. Admin clicks "Approve"
5. Restaurant logs out and logs in again
6. Can now access all features!
```

---

## 🎨 **Customization**

### **Colors:**
Edit `AdminDashboard.css`:
```css
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.sidebar {
  background: #2D2D2D;
}

.stat-card {
  border-left-color: #E6753A;
}
```

### **Logo:**
Edit `AdminDashboard.jsx`:
```javascript
<h2>🍽️ Your Brand Name</h2>
```

---

## 🚀 **Production Deployment**

### **Build for Production:**
```bash
npm run build
```

### **Deploy:**
- Upload `dist/` folder to web server
- Configure backend API URL
- Set up HTTPS
- Use environment variables for secrets

---

## 📊 **Future Enhancements**

- [ ] Email notifications when user is approved/rejected
- [ ] Bulk approve/reject
- [ ] Advanced filtering and search
- [ ] Export data to CSV
- [ ] Analytics charts
- [ ] User activity logs
- [ ] Restaurant performance metrics
- [ ] Rider tracking

---

## ✅ **Summary**

You now have a complete admin dashboard that:
- Runs in web browser (desktop)
- Shows all platform statistics
- Manages user approvals with one click
- Provides real-time data
- Secure admin-only access

**Perfect for managing your food delivery platform!** 🎉
