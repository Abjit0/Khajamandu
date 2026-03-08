# Kitchen Dashboard Refresh Fix

## Problem
When a restaurant accepts an order in the kitchen dashboard, the order status changes to "CONFIRMED". However, when the page is refreshed, the order appears again as "PLACED" (pending), requiring the restaurant to accept it again.

## Root Cause
The `/api/orders/all` endpoint was missing the `authenticateToken` middleware. This meant:
1. The backend couldn't identify which restaurant was making the request
2. All orders from all restaurants were being returned
3. Orders weren't properly filtered by restaurant ID
4. The frontend would show orders that don't belong to the logged-in restaurant

## Solution
Added `authenticateToken` middleware to the `/api/orders/all` route in `backend/index.js`:

```javascript
// Before (WRONG):
app.get('/api/orders/all', orderController.getAllOrders);

// After (CORRECT):
app.get('/api/orders/all', authenticateToken, orderController.getAllOrders);
```

## How It Works Now
1. Restaurant logs in and receives a JWT token
2. Frontend stores the token in AsyncStorage
3. When fetching orders, the token is automatically included in the request header
4. Backend authenticates the token and extracts the restaurant ID
5. Only orders belonging to that specific restaurant are returned
6. Order status updates persist correctly after refresh

## Test Results
✅ Order status updates persist after refresh
✅ Each restaurant only sees their own orders
✅ Order isolation working correctly between different restaurants
✅ Authentication properly enforced on all order operations

## Files Modified
- `backend/index.js` - Added authenticateToken middleware to /orders/all route
- `backend/routes/otpRoutes.js` - Added signup route for testing

## Testing
Run the test script to verify the fix:
```bash
node test-kitchen-refresh-fix.cjs
```

Expected output:
- ✅ Order status persisted correctly after refresh
- ✅ Orders properly filtered by restaurant ID
- ✅ Order isolation working between restaurants
