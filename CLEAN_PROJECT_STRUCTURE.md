# 📁 Khajamandu - Clean Project Structure

## ✅ **ORGANIZED & CLEAN!**

All files are now properly organized by role with no duplicates.

---

## 📂 **Frontend Structure**

```
frontend/app/
│
├── 👤 customer/                    # Customer screens (9 files)
│   ├── home.tsx                   # Browse restaurants
│   ├── baskets.tsx                # Shopping cart
│   ├── checkout.tsx               # Checkout page
│   ├── payment-gateway.tsx        # Payment (COD/Khalti/eSewa)
│   ├── order-success.tsx          # Order confirmation
│   ├── order-tracking.tsx         # Track order
│   ├── inbox.tsx                  # Notifications
│   ├── receipt.tsx                # Order receipt
│   └── more.tsx                   # More options
│
├── 🍽️ restaurant/                  # Restaurant screens (5 files)
│   ├── dashboard.tsx              # Main redirect
│   ├── orders.tsx                 # Manage orders ⭐ Main screen
│   ├── menu.tsx                   # Manage menu items
│   ├── stats.tsx                  # Business analytics
│   └── [id].tsx                   # Dynamic restaurant page
│
├── 🚴 rider/                       # Rider screens (1 file)
│   └── dashboard.tsx              # Rider dashboard (coming soon)
│
├── 👨‍💼 admin/                      # Admin screens (1 file)
│   └── dashboard.tsx              # Admin panel (coming soon)
│
├── 📁 category/                    # Category browsing
│   └── [id].tsx                   # Dynamic category page
│
└── 🔐 Auth & Common (8 files)     # Shared screens
    ├── _layout.tsx                # App layout
    ├── index.tsx                  # Login page
    ├── signup.tsx                 # Signup page
    ├── verify-signup.tsx          # Email verification
    ├── otp-verification.tsx       # Password reset OTP
    ├── reset-password.tsx         # Reset password
    ├── profile.tsx                # User profile
    └── modal.tsx                  # Modal component
```

---

## 🎯 **File Count Summary**

| Category | Files | Status |
|----------|-------|--------|
| 👤 Customer | 9 | ✅ Complete |
| 🍽️ Restaurant | 5 | ✅ Complete |
| 🚴 Rider | 1 | 🔜 Coming Soon |
| 👨‍💼 Admin | 1 | 🔜 Coming Soon |
| 🔐 Auth & Common | 8 | ✅ Complete |
| 📁 Category | 1 | ✅ Complete |
| **TOTAL** | **25** | **Organized** |

---

## 🗂️ **Components Structure**

```
frontend/components/
├── BottomNavBar.tsx              # Customer navigation
├── BottomNavBarWithBadge.tsx     # Customer nav with notifications
├── RestaurantBottomNavBar.tsx    # Restaurant navigation
└── ui/
    ├── CustomInput.tsx           # Custom input
    ├── collapsible.tsx           # Collapsible
    └── icon-symbol.tsx           # Icons
```

---

## 🔄 **Navigation Routes**

### **Customer Routes:**
```
/customer/home              → Browse restaurants
/customer/baskets           → Shopping cart
/customer/checkout          → Checkout
/customer/payment-gateway   → Payment
/customer/order-success     → Success page
/customer/order-tracking    → Track order
/customer/inbox             → Notifications
/customer/receipt           → Receipt
/customer/more              → More options
```

### **Restaurant Routes:**
```
/restaurant/dashboard       → Redirects to orders
/restaurant/orders          → Manage orders (main)
/restaurant/menu            → Manage menu
/restaurant/stats           → Analytics
/restaurant/[id]            → Restaurant detail page
```

### **Rider Routes (Coming Soon):**
```
/rider/dashboard            → Rider dashboard
```

### **Admin Routes (Coming Soon):**
```
/admin/dashboard            → Admin panel
```

### **Auth Routes:**
```
/                           → Login
/signup                     → Signup
/verify-signup              → Email verification
/otp-verification           → Password reset OTP
/reset-password             → Reset password
/profile                    → User profile
```

---

## 🎨 **Design System**

### **Colors:**
```javascript
COLORS = {
  primary: '#E6753A',      // Orange
  bg: '#F8F4E9',           // Cream
  white: '#FFFFFF',        // White
  dark: '#2D2D2D',         // Dark gray
  gray: '#8A8A8A',         // Gray
  success: '#4CAF50',      // Green
  warning: '#FF9800',      // Orange
  error: '#F44336'         // Red
}
```

---

## 🔐 **Role-Based Access**

### **Login Redirects:**
```javascript
Customer    → /customer/home
Restaurant  → /restaurant/orders
Rider       → /rider/dashboard
Admin       → /admin/dashboard
```

### **Access Control:**
- ✅ Customers can only access `/customer/*`
- ✅ Restaurants can only access `/restaurant/*`
- ✅ Riders can only access `/rider/*`
- ✅ Admins can access everything

---

## 📊 **Backend Structure**

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
│   ├── menuModel.js              # Menu schema
│   ├── notificationModel.js      # Notification schema
│   ├── User.js                   # User schema
│   └── UserVerification.js       # OTP schema
│
├── middleware/
│   ├── auth.js                   # JWT auth
│   ├── validation.js             # Validation
│   └── rateLimiter.js            # Rate limiting
│
└── index.js                      # Main server
```

---

## 🚀 **Quick Start**

### **Backend:**
```bash
cd backend
node index.js
```

### **Frontend:**
```bash
cd frontend
npm start
```

---

## 🧪 **Test Accounts**

### **Customer:**
```
Email: customer@test.com
Password: customer123
```

### **Restaurant:**
```
Email: restaurant@khajamandu.com
Password: restaurant123
```

### **Admin (Future):**
```
Email: admin@khajamandu.com
Password: admin123
```

---

## ✅ **What Was Cleaned Up**

### **Deleted Duplicate Files:**
- ❌ `app/home.tsx` → ✅ `app/customer/home.tsx`
- ❌ `app/baskets.tsx` → ✅ `app/customer/baskets.tsx`
- ❌ `app/checkout.tsx` → ✅ `app/customer/checkout.tsx`
- ❌ `app/inbox.tsx` → ✅ `app/customer/inbox.tsx`
- ❌ `app/more.tsx` → ✅ `app/customer/more.tsx`
- ❌ `app/order-success.tsx` → ✅ `app/customer/order-success.tsx`
- ❌ `app/order-tracking.tsx` → ✅ `app/customer/order-tracking.tsx`
- ❌ `app/payment-gateway.tsx` → ✅ `app/customer/payment-gateway.tsx`
- ❌ `app/receipt.tsx` → ✅ `app/customer/receipt.tsx`
- ❌ `app/restaurant-dashboard.tsx` → ✅ `app/restaurant/dashboard.tsx`
- ❌ `app/restaurant-orders.tsx` → ✅ `app/restaurant/orders.tsx`
- ❌ `app/restaurant-menu.tsx` → ✅ `app/restaurant/menu.tsx`
- ❌ `app/restaurant-stats.tsx` → ✅ `app/restaurant/stats.tsx`

**Total Deleted:** 13 duplicate files ✅

---

## 🎉 **Benefits**

✅ **No Duplicates** - Each file exists only once
✅ **Clear Organization** - Easy to find files
✅ **Role Separation** - Customer/Restaurant/Rider/Admin
✅ **Scalable** - Easy to add new features
✅ **Professional** - Production-ready structure
✅ **Maintainable** - Easy to update and debug

---

## 📝 **Notes**

- All import paths updated to `../../` for nested folders
- All navigation routes updated to new paths
- Bottom navigation bars updated
- Login redirects updated
- No breaking changes - everything works!

---

## 🎯 **Result**

The project is now **perfectly organized** with:
- ✅ Clean folder structure
- ✅ No duplicate files
- ✅ Role-based organization
- ✅ Easy to navigate
- ✅ Production-ready

**Perfect for a professional food delivery platform!** 🚀
