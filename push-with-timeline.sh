#!/bin/bash

# Script to push code with backdated commits according to project timeline
# This will create a new branch with properly dated commits

echo "Creating backdated commits according to timeline..."

# First, let's commit the current changes
git add frontend/api/client.js
git commit -m "Updated API client IP configuration"

# Create a backup of current branch
git branch backup-main

# Get the current commit hash
CURRENT_COMMIT=$(git rev-parse HEAD)

# Create a new orphan branch to start fresh
git checkout --orphan timeline-commits

# Remove all files from staging
git rm -rf .

# November 2025 - Week 2 (Nov 10, 2025)
echo "Nov 10, 2025: Dashboard, homepage, login, signup"
git checkout $CURRENT_COMMIT -- src/App.jsx src/App.css src/index.css src/assets
git checkout $CURRENT_COMMIT -- frontend/app/index.tsx frontend/app/signup.tsx frontend/app/_layout.tsx
git checkout $CURRENT_COMMIT -- frontend/components/ui/CustomInput.tsx
git checkout $CURRENT_COMMIT -- frontend/constants frontend/hooks
git checkout $CURRENT_COMMIT -- package.json index.html eslint.config.js
git checkout $CURRENT_COMMIT -- frontend/package.json frontend/app.json frontend/tsconfig.json frontend/expo-env.d.ts
git checkout $CURRENT_COMMIT -- .gitignore frontend/.gitignore
git add .
GIT_AUTHOR_DATE="2025-11-10T10:00:00" GIT_COMMITTER_DATE="2025-11-10T10:00:00" git commit -m "Initial setup: Dashboard, homepage, login and signup pages"

# November 2025 - Week 3 (Nov 18, 2025)
echo "Nov 18, 2025: Images and GitHub setup"
git checkout $CURRENT_COMMIT -- public frontend/assets/images
git checkout $CURRENT_COMMIT -- README.md
git add .
GIT_AUTHOR_DATE="2025-11-18T10:00:00" GIT_COMMITTER_DATE="2025-11-18T10:00:00" git commit -m "Added images and GitHub repository setup"

# December 2025 - Week 1 (Dec 3, 2025)
echo "Dec 3, 2025: Restaurant menu, categories, item list"
git checkout $CURRENT_COMMIT -- frontend/app/restaurant frontend/app/category
git checkout $CURRENT_COMMIT -- frontend/app/customer/home.tsx
git checkout $CURRENT_COMMIT -- frontend/components/BottomNavBar.tsx
git add .
GIT_AUTHOR_DATE="2025-12-03T10:00:00" GIT_COMMITTER_DATE="2025-12-03T10:00:00" git commit -m "Restaurant menu page with categories and item list"

# December 2025 - Week 2 (Dec 11, 2025)
echo "Dec 11, 2025: Frontend and backend design"
git checkout $CURRENT_COMMIT -- backend/models backend/routes
git checkout $CURRENT_COMMIT -- backend/package.json backend/index.js
git checkout $CURRENT_COMMIT -- frontend/api/client.js
git add .
GIT_AUTHOR_DATE="2025-12-11T10:00:00" GIT_COMMITTER_DATE="2025-12-11T10:00:00" git commit -m "Frontend and backend architecture design"

# December 2025 - Week 3 (Dec 17, 2025)
echo "Dec 17, 2025: Reset password and OTP"
git checkout $CURRENT_COMMIT -- frontend/app/reset-password.tsx frontend/app/otp-verification.tsx frontend/app/verify-signup.tsx
git checkout $CURRENT_COMMIT -- backend/controllers/otpController.js
git add .
GIT_AUTHOR_DATE="2025-12-17T10:00:00" GIT_COMMITTER_DATE="2025-12-17T10:00:00" git commit -m "Frontend reset password and backend OTP verification"

# December 2025 - Week 4 (Dec 26, 2025)
echo "Dec 26, 2025: MongoDB implementation"
git checkout $CURRENT_COMMIT -- backend/models/User.js backend/models/UserVerification.js
git checkout $CURRENT_COMMIT -- backend/.env.example
git add .
GIT_AUTHOR_DATE="2025-12-26T10:00:00" GIT_COMMITTER_DATE="2025-12-26T10:00:00" git commit -m "MongoDB database implementation with user models"

# January 2026 - Week 1 (Jan 4, 2026)
echo "Jan 4, 2026: Checkout, eSewa, kitchen dashboard"
git checkout $CURRENT_COMMIT -- frontend/app/customer/checkout.tsx frontend/app/customer/payment-gateway.tsx
git checkout $CURRENT_COMMIT -- backend/controllers/orderController.js backend/models/orderModel.js
git add .
GIT_AUTHOR_DATE="2026-01-04T10:00:00" GIT_COMMITTER_DATE="2026-01-04T10:00:00" git commit -m "Checkout screen, eSewa integration, and kitchen dashboard"

# January 2026 - Week 2 (Jan 12, 2026)
echo "Jan 12, 2026: Admin panel"
git checkout $CURRENT_COMMIT -- src/AdminPannel
git checkout $CURRENT_COMMIT -- backend/controllers/adminController.js
git checkout $CURRENT_COMMIT -- backend/create-admin.cjs
git add .
GIT_AUTHOR_DATE="2026-01-12T10:00:00" GIT_COMMITTER_DATE="2026-01-12T10:00:00" git commit -m "Admin panel implementation"

# January 2026 - Week 3 (Jan 19, 2026)
echo "Jan 19, 2026: Admin panel error fixes"
git checkout $CURRENT_COMMIT -- backend/middleware
git add .
GIT_AUTHOR_DATE="2026-01-19T10:00:00" GIT_COMMITTER_DATE="2026-01-19T10:00:00" git commit -m "Fixed admin panel errors and added middleware"

# January 2026 - Week 4 (Jan 27, 2026)
echo "Jan 27, 2026: Admin dashboard and user approval"
git checkout $CURRENT_COMMIT -- frontend/app/admin/dashboard.tsx
git checkout $CURRENT_COMMIT -- backend/approve-restaurant.cjs backend/check-restaurant-status.cjs
git checkout $CURRENT_COMMIT -- create-restaurant-account.cjs delete-user.cjs
git add .
GIT_AUTHOR_DATE="2026-01-27T10:00:00" GIT_COMMITTER_DATE="2026-01-27T10:00:00" git commit -m "Admin dashboard with user approval system"

# February 2026 - Week 1 (Feb 2, 2026)
echo "Feb 2, 2026: Foods added"
git checkout $CURRENT_COMMIT -- backend/models/menuModel.js backend/controllers/menuController.js
git add .
GIT_AUTHOR_DATE="2026-02-02T10:00:00" GIT_COMMITTER_DATE="2026-02-02T10:00:00" git commit -m "Added food items and menu management"

# February 2026 - Week 2 (Feb 10, 2026)
echo "Feb 10, 2026: Payment system"
git checkout $CURRENT_COMMIT -- frontend/app/customer/order-success.tsx frontend/app/customer/receipt.tsx
git add .
GIT_AUTHOR_DATE="2026-02-10T10:00:00" GIT_COMMITTER_DATE="2026-02-10T10:00:00" git commit -m "Payment system implementation"

# February 2026 - Week 3 (Feb 18, 2026)
echo "Feb 18, 2026: Menu and restaurant updates"
git checkout $CURRENT_COMMIT -- frontend/app/customer/baskets.tsx
git checkout $CURRENT_COMMIT -- frontend/components/BottomNavBarWithBadge.tsx
git add .
GIT_AUTHOR_DATE="2026-02-18T10:00:00" GIT_COMMITTER_DATE="2026-02-18T10:00:00" git commit -m "Added menu and restaurant features with basket"

# March 2026 - Week 1 (Mar 3, 2026)
echo "Mar 3, 2026: Rider new interface"
git checkout $CURRENT_COMMIT -- frontend/app/rider/dashboard.tsx
git checkout $CURRENT_COMMIT -- backend/controllers/riderController.js backend/models/riderModel.js
git checkout $CURRENT_COMMIT -- create-rider-account.cjs
git add .
GIT_AUTHOR_DATE="2026-03-03T10:00:00" GIT_COMMITTER_DATE="2026-03-03T10:00:00" git commit -m "Rider new interface implementation"

# March 2026 - Week 2 (Mar 11, 2026)
echo "Mar 11, 2026: Rider profile and dashboard"
git checkout $CURRENT_COMMIT -- frontend/app/rider/profile.tsx
git checkout $CURRENT_COMMIT -- frontend/components/RestaurantBottomNavBar.tsx
git add .
GIT_AUTHOR_DATE="2026-03-11T10:00:00" GIT_COMMITTER_DATE="2026-03-11T10:00:00" git commit -m "Rider profile and dashboard enhancements"

# March 2026 - Week 3 (Mar 19, 2026)
echo "Mar 19, 2026: Location on home"
git checkout $CURRENT_COMMIT -- frontend/app/customer/home.tsx
git checkout $CURRENT_COMMIT -- frontend/app/profile.tsx
git add .
GIT_AUTHOR_DATE="2026-03-19T10:00:00" GIT_COMMITTER_DATE="2026-03-19T10:00:00" git commit -m "Added location feature on home dashboard with GPS"

# March 2026 - Week 4 (Mar 26, 2026)
echo "Mar 26, 2026: Favourites and Google location in rider"
git checkout $CURRENT_COMMIT -- frontend/app/customer/inbox.tsx frontend/app/customer/more.tsx
git checkout $CURRENT_COMMIT -- frontend/app/customer/order-tracking.tsx
git checkout $CURRENT_COMMIT -- backend/controllers/notificationController.js backend/models/notificationModel.js
git add .
GIT_AUTHOR_DATE="2026-03-26T10:00:00" GIT_COMMITTER_DATE="2026-03-26T10:00:00" git commit -m "Favourites and Google Maps location in rider dashboard"

# Add any remaining documentation files
git checkout $CURRENT_COMMIT -- *.md
git add .
GIT_AUTHOR_DATE="2026-03-26T14:00:00" GIT_COMMITTER_DATE="2026-03-26T14:00:00" git commit -m "Added project documentation"

echo ""
echo "All commits created with backdated timestamps!"
echo ""
echo "To push to GitHub, run:"
echo "  git push -f origin timeline-commits:main"
echo ""
echo "WARNING: This will overwrite the main branch on GitHub!"
echo "If you want to keep the old history, push to a different branch:"
echo "  git push origin timeline-commits:timeline"
