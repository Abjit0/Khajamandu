# 📋 Signup Flow Documentation

## Complete flow for Restaurant and Rider signup

---

## 🍽️ **RESTAURANT SIGNUP FLOW**

### **Step 1: Fill Signup Form**
```
User fills:
- Full Name: "John Doe"
- Email: "restaurant@test.com"
- Phone: "9841234567"
- Password: "restaurant123"
- Role: "Restaurant" ✅
- Restaurant Name: "Pokhara Pizza"
- Restaurant Address: "Lakeside, Pokhara"
- Restaurant Phone: "061-123456"
- Cuisine: "Italian"
```

### **Step 2: Submit Signup**
**Backend Process:**
```javascript
1. Check if email exists → ❌ Reject if exists
2. Hash password with bcrypt
3. Set isApproved = false (Restaurant needs approval) ⚠️
4. Create user in database:
   {
     email: "restaurant@test.com",
     password: "hashed...",
     role: "restaurant",
     isApproved: false, ← IMPORTANT!
     profile: {
       name: "John Doe",
       restaurantName: "Pokhara Pizza",
       ...
     }
   }
5. Generate 4-digit OTP (e.g., "1234")
6. Save OTP in UserVerification collection
7. Send email with OTP
8. Return success
```

**Frontend Response:**
```
✅ Account created!
→ Redirects to /verify-signup
→ Passes: email, role, password
```

---

### **Step 3: Email Verification**
**User sees:**
```
📧 Verify Your Email
We've sent a 4-digit code to
restaurant@test.com

[Enter 4-digit code]
[Verify & Continue]
```

**User enters OTP → Backend verifies:**
```javascript
1. Find OTP record in database
2. Compare OTP
3. If valid:
   - Delete OTP record
   - Return success
4. If invalid:
   - Return error
```

---

### **Step 4: Auto-Login Attempt**
**After OTP verification:**
```javascript
1. Try to login automatically
2. POST /otp/login with email + password
3. Backend checks:
   - Email exists? ✅
   - Password correct? ✅
   - Generate JWT token
   - Return user data with isApproved: false
4. Store token in AsyncStorage
5. Check role → "restaurant"
6. Redirect to /restaurant/dashboard
```

---

### **Step 5: Restaurant Dashboard Access**
**What happens:**
```javascript
1. User lands on /restaurant/dashboard
2. Dashboard redirects to /restaurant/orders
3. Restaurant tries to view orders
4. Backend middleware checks:
   - Is authenticated? ✅
   - Role is restaurant? ✅
   - Is approved? ❌ FALSE!
5. Backend returns 403 error:
   {
     status: "FAILED",
     message: "Account pending approval. Please contact admin."
   }
```

**User sees:**
```
❌ Account pending approval
Your restaurant account is under review.
Please contact admin for approval.
```

---

### **Step 6: Admin Approval (Required)**
**Admin must run:**
```bash
node backend/approve-restaurant.cjs restaurant@test.com
```

**This updates:**
```javascript
User.updateOne(
  { email: "restaurant@test.com" },
  { isApproved: true }
)
```

---

### **Step 7: After Approval**
**Restaurant must:**
```
1. Logout from app
2. Login again
3. New JWT token generated with isApproved: true
4. Can now access all restaurant features! ✅
```

---

## 🚴 **RIDER SIGNUP FLOW**

### **Step 1: Fill Signup Form**
```
User fills:
- Full Name: "Ram Gurung"
- Email: "rider@test.com"
- Phone: "9851234567"
- Password: "rider123"
- Role: "Delivery Rider" ✅
- Vehicle Type: "Motorcycle"
- License Number: "BA-12-PA-1234"
```

### **Step 2-7: Same as Restaurant**
```
✅ Account created
✅ OTP sent
✅ Email verified
✅ Auto-login successful
⚠️  isApproved: false
❌ Cannot access rider features
⏳ Needs admin approval
```

**After admin approval:**
```bash
node backend/approve-rider.cjs rider@test.com
```

**Then:**
```
✅ Logout and login again
✅ Can access /rider/dashboard
✅ Can view deliveries
```

---

## 👤 **CUSTOMER SIGNUP FLOW (Different!)**

### **Key Difference:**
```javascript
// In signup controller:
const isApproved = role === 'customer'; // Auto-approve! ✅
```

**Customer Flow:**
```
1. Fill signup form
2. Submit → Account created
3. Verify OTP
4. Auto-login
5. Redirect to /customer/home
6. ✅ Can use app immediately! (No approval needed)
```

---

## 📊 **COMPARISON TABLE**

| Step | Customer | Restaurant | Rider |
|------|----------|------------|-------|
| Signup | ✅ | ✅ | ✅ |
| OTP Verification | ✅ | ✅ | ✅ |
| Auto-Login | ✅ | ✅ | ✅ |
| isApproved | `true` | `false` | `false` |
| Can Use App | ✅ Immediately | ❌ After approval | ❌ After approval |
| Admin Approval | Not needed | ⚠️ Required | ⚠️ Required |
| Must Re-login | No | ✅ Yes | ✅ Yes |

---

## 🔐 **APPROVAL SYSTEM**

### **Why Approval is Needed:**
- **Restaurants:** Verify legitimate business
- **Riders:** Verify license and vehicle
- **Customers:** No verification needed (just email)

### **Approval Scripts:**
```bash
# Approve restaurant
node backend/approve-restaurant.cjs restaurant@test.com

# Approve rider
node backend/approve-rider.cjs rider@test.com

# Check status
node backend/check-restaurant-status.cjs restaurant@test.com
```

---

## ⚠️ **CURRENT ISSUES & SOLUTIONS**

### **Issue 1: Restaurant Can't Access Dashboard After Signup**
**Why:** `isApproved = false`

**Solution:**
```bash
1. Run: node backend/approve-restaurant.cjs restaurant@test.com
2. User must logout and login again
3. New token will have isApproved: true
```

### **Issue 2: Email Not Sending**
**Why:** Gmail app password or SMTP issue

**Workaround:**
```
1. Check backend console for OTP
2. Look for: 🔑 OTP for restaurant@test.com: 1234
3. Use that OTP to verify
```

### **Issue 3: Auto-Login Fails After Verification**
**Why:** Password not passed correctly

**Current:** Password is passed in URL params
**Better:** Store temporarily in secure storage

---

## 🎯 **RECOMMENDED IMPROVEMENTS**

### **1. Better Approval Flow:**
```
Instead of:
❌ "Account pending approval" (confusing)

Show:
✅ "Welcome! Your account is under review.
   You'll receive an email when approved.
   Expected time: 24-48 hours"
```

### **2. Admin Dashboard:**
```
Create /admin/dashboard with:
- List of pending restaurants
- List of pending riders
- One-click approve/reject buttons
- No need for command-line scripts
```

### **3. Email Notifications:**
```
Send email when:
- Account is approved
- Account is rejected
- User can then login
```

### **4. Status Page:**
```
Create /approval-status page:
- Shows current approval status
- Estimated wait time
- Contact admin button
```

---

## 📝 **TESTING CHECKLIST**

### **Test Restaurant Signup:**
- [ ] Fill all restaurant fields
- [ ] Submit signup
- [ ] Receive OTP email (or check console)
- [ ] Enter OTP
- [ ] Auto-login successful
- [ ] See "pending approval" message
- [ ] Run approval script
- [ ] Logout and login again
- [ ] Can access restaurant dashboard ✅

### **Test Rider Signup:**
- [ ] Fill all rider fields
- [ ] Submit signup
- [ ] Receive OTP email
- [ ] Enter OTP
- [ ] Auto-login successful
- [ ] See "pending approval" message
- [ ] Run approval script
- [ ] Logout and login again
- [ ] Can access rider dashboard ✅

### **Test Customer Signup:**
- [ ] Fill customer fields
- [ ] Submit signup
- [ ] Receive OTP email
- [ ] Enter OTP
- [ ] Auto-login successful
- [ ] Can browse restaurants immediately ✅

---

## 🎉 **SUMMARY**

**Customer:** Simple flow, works immediately ✅
**Restaurant/Rider:** Needs admin approval, must re-login after approval ⚠️

**Key Point:** The approval system is working as designed for security, but the UX could be improved with better messaging and an admin dashboard.
