# 📁 Khajamandu Project Structure

## 🎯 Overview
The project is now organized into role-based folders for better maintainability and scalability.

---

## 📂 Frontend Structure

```
frontend/app/
├── 👤 customer/              # Customer-related screens
│   ├── home.tsx             # Browse restaurants
│   ├── baskets.tsx          # Shopping cart
│   ├── checkout.tsx         # Checkout page
│   ├── payment-gateway.tsx  # Payment processing
│   ├── order-success.tsx    # Order confirmation
│   ├── order-tracking.tsx   # Track order status
│   ├── inbox.tsx            # Notifications
│   ├── receipt.tsx          # Order receipt
│   └── more.tsx             # More options
│
├── 🍽️ restaurant/           # Restaurant owner screens
│   ├── dashboard.tsx        # Main redirect
│   ├── orders.tsx           # Manage orders (main screen)
│   ├── menu.tsx             # Manage menu items
│   └── stats.tsx            # Business analytics
│
├── 🚴 rider/                # Delivery rider screens
│   └── dashboard.tsx        # Rider dashboard (coming soon)
│
├── 👨‍💼 admin/               # Admin panel screens
│   └── dashboard.tsx        # Admin dashboard (coming soon)
│
├── 🔐 Auth & Common/        # Shared screens
│   ├── index.tsx            # Login page
│   ├── signup.tsx           # Signup page
│   ├── verify-signup.tsx    # Email verification
│   ├── otp-verification.tsx # Password reset OTP
│   ├── reset-password.tsx   # Reset password
│   ├── profile.tsx          # User profile
│   ├── modal.tsx            # Modal component
│   └── _layout.tsx          # App layout
│
└── category/                # Category browsing
    └── [id].tsx             # Dynamic category page
```

---

## 🔄 User Flow by Role

### **👤 CUSTOMER FLOW:**
```
Login → /customer/home
    ↓
Browse restaurants
    ↓
Add to basket → /customer/baskets
    ↓
Checkout → /customer/checkout
    ↓
Payment → /customer/payment-gateway
    ↓
Success → /customer/order-success
    ↓
Track → /customer/order-tracking
    ↓
Notifications → /customer/inbox
```

### **🍽️ RESTAURANT FLOW:**
```
Login → /restaurant/dashboard
    ↓
Auto-redirect → /restaurant/orders
    ↓
Manage orders (Accept, Prepare, Ready, Deliver)
    ↓
Switch tabs:
    - Orders: /restaurant/orders
    - Menu: /restaurant/menu
    - Stats: /restaurant/stats
    - Profile: /profile
```

### **🚴 RIDER FLOW (Coming Soon):**
```
Login → /rider/dashboard
    ↓
View available deliveries
    ↓
Accept delivery
    ↓
Navigate to customer
    ↓
Mark delivered
    ↓
View earnings
```

### **👨‍💼 ADMIN FLOW (Coming Soon):**
```
Login → /admin/dashboard
    ↓
Approve restaurants
    ↓
Approve riders
    ↓
View all orders
    ↓
Manage users
    ↓
View analytics
```

---

## 🎨 Components Structure

```
frontend/components/
├── BottomNavBar.tsx              # Customer bottom navigation
├── BottomNavBarWithBadge.tsx     # Customer nav with notifications
├── RestaurantBottomNavBar.tsx    # Restaurant bottom navigation
└── ui/
    ├── CustomInput.tsx           # Custom input component
    ├── collapsible.tsx           # Collapsible component
    └── icon-symbol.tsx           # Icon symbols
```

---

## 🔐 Authentication & Routing

### **Login Redirect Logic:**
```javascript
// frontend/app/index.tsx

if (role === 'restaurant') {
  router.replace('/restaurant/dashboard');
} else if (role === 'admin') {
  router.replace('/admin/dashboard');
} else if (role === 'rider') {
  router.replace('/rider/dashboard');
} else {
  router.replace('/customer/home');
}
```

### **Signup Verification Flow:**
```javascript
// frontend/app/verify-signup.tsx

After OTP verification:
  - Auto-login
  - Redirect based on role
  - Store auth token
```

---

## 🗄️ Backend Structure

```
backend/
├── controllers/
│   ├── orderController.js        # Order management
│   ├── menuController.js         # Menu CRUD
│   ├── notificationController.js # Notifications
│   └── otpController.js          # Auth & OTP
│
├── models/
│   ├── orderModel.js             # Order schema
│   ├── menuModel.js              # Menu item schema
│   ├── notificationModel.js      # Notification schema
│   ├── User.js                   # User schema
│   └── UserVerification.js       # OTP verification
│
├── middleware/
│   ├── auth.js                   # JWT authentication
│   ├── validation.js             # Input validation
│   └── rateLimiter.js            # Rate limiting
│
├── routes/
│   └── otpRoutes.js              # OTP routes
│
└── index.js                      # Main server file
```

---

## 🔒 Role-Based Access Control

### **Customer Access:**
- ✅ Browse restaurants
- ✅ Place orders
- ✅ Track orders
- ✅ View notifications
- ❌ Cannot access restaurant/rider/admin pages

### **Restaurant Access:**
- ✅ Manage menu items
- ✅ View and update orders
- ✅ View business stats
- ❌ Cannot see other restaurants' data
- ❌ Cannot access customer/rider/admin pages

### **Rider Access (Future):**
- ✅ View available deliveries
- ✅ Accept/complete deliveries
- ✅ View earnings
- ❌ Cannot access customer/restaurant/admin pages

### **Admin Access (Future):**
- ✅ Approve restaurants
- ✅ Approve riders
- ✅ View all orders
- ✅ Manage all users
- ✅ View platform analytics

---

## 🚀 Getting Started

### **Run Backend:**
```bash
cd backend
node index.js
```

### **Run Frontend:**
```bash
cd frontend
npm start
```

### **Test Accounts:**

**Customer:**
```
Email: customer@test.com
Password: customer123
```

**Restaurant:**
```
Email: restaurant@khajamandu.com
Password: restaurant123
```

**Admin (Future):**
```
Email: admin@khajamandu.com
Password: admin123
```

**Rider (Future):**
```
Email: rider@test.com
Password: rider123
```

---

## 📝 Key Features by Role

### **Customer Features:**
- ✅ Browse restaurants by category
- ✅ Add items to basket
- ✅ Multiple payment methods (COD, Khalti, eSewa)
- ✅ Real-time order tracking
- ✅ Push notifications
- ✅ Order history
- ✅ Receipt generation

### **Restaurant Features:**
- ✅ Menu management (Add/Edit/Toggle availability)
- ✅ Order management (Accept/Reject/Update status)
- ✅ Real-time order notifications
- ✅ Business analytics
- ✅ Auto-refresh orders
- ✅ Filter orders by status

### **Rider Features (Coming Soon):**
- 🔜 View available deliveries
- 🔜 Accept deliveries
- 🔜 Navigation to customer
- 🔜 Mark delivered
- 🔜 Earnings tracking

### **Admin Features (Coming Soon):**
- 🔜 Approve/reject restaurants
- 🔜 Approve/reject riders
- 🔜 View all orders
- 🔜 User management
- 🔜 Platform analytics
- 🔜 Revenue reports

---

## 🎯 Benefits of New Structure

✅ **Better Organization** - Each role has its own folder
✅ **Easier Maintenance** - Find files quickly
✅ **Scalability** - Easy to add new features
✅ **Clear Separation** - No confusion between roles
✅ **Team Collaboration** - Different developers can work on different roles
✅ **Future-Ready** - Structure supports rider and admin features

---

## 📊 File Count

- **Customer Screens:** 9 files
- **Restaurant Screens:** 4 files
- **Rider Screens:** 1 file (placeholder)
- **Admin Screens:** 1 file (placeholder)
- **Auth & Common:** 8 files
- **Components:** 7 files
- **Backend Controllers:** 4 files
- **Backend Models:** 5 files

**Total:** ~40 organized files

---

## 🔄 Migration Notes

### **Old Paths → New Paths:**

**Customer:**
- `/home` → `/customer/home`
- `/baskets` → `/customer/baskets`
- `/checkout` → `/customer/checkout`
- `/inbox` → `/customer/inbox`

**Restaurant:**
- `/restaurant-dashboard` → `/restaurant/dashboard`
- `/restaurant-orders` → `/restaurant/orders`
- `/restaurant-menu` → `/restaurant/menu`
- `/restaurant-stats` → `/restaurant/stats`

**Admin:**
- `/admin` → `/admin/dashboard`

**Rider:**
- New: `/rider/dashboard`

---

## 🎉 Result

The project is now **professionally organized** with:
- Clear role separation
- Easy navigation
- Scalable structure
- Future-ready architecture
- Better maintainability

Perfect for a production-ready food delivery platform! 🚀
