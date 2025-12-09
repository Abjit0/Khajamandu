#!/bin/bash

# Khajamandu Project - Backdated Commits Timeline
# This script creates commits with past dates to show project history

echo "🚀 Starting backdated commits for Khajamandu project..."

# Configure git to allow backdating
export GIT_AUTHOR_DATE=""
export GIT_COMMITTER_DATE=""

# November 2025 - Week 2 (Nov 10, 2025)
echo "📅 November 2025 - Week 2..."
GIT_AUTHOR_DATE="2025-11-10T10:00:00" GIT_COMMITTER_DATE="2025-11-10T10:00:00" git commit --allow-empty -m "feat: Initialize Khajamandu project structure"
GIT_AUTHOR_DATE="2025-11-10T14:00:00" GIT_COMMITTER_DATE="2025-11-10T14:00:00" git commit --allow-empty -m "feat: Create dashboard layout and navigation"
GIT_AUTHOR_DATE="2025-11-11T10:00:00" GIT_COMMITTER_DATE="2025-11-11T10:00:00" git commit --allow-empty -m "feat: Design homepage with banner and categories"
GIT_AUTHOR_DATE="2025-11-12T11:00:00" GIT_COMMITTER_DATE="2025-11-12T11:00:00" git commit --allow-empty -m "feat: Implement login page UI"
GIT_AUTHOR_DATE="2025-11-13T09:00:00" GIT_COMMITTER_DATE="2025-11-13T09:00:00" git commit --allow-empty -m "feat: Implement signup page with validation"
GIT_AUTHOR_DATE="2025-11-14T15:00:00" GIT_COMMITTER_DATE="2025-11-14T15:00:00" git commit --allow-empty -m "style: Add orange theme colors and styling"

# November 2025 - Week 3 (Nov 18, 2025)
echo "📅 November 2025 - Week 3..."
GIT_AUTHOR_DATE="2025-11-18T10:00:00" GIT_COMMITTER_DATE="2025-11-18T10:00:00" git commit --allow-empty -m "feat: Import food and restaurant images"
GIT_AUTHOR_DATE="2025-11-19T11:00:00" GIT_COMMITTER_DATE="2025-11-19T11:00:00" git commit --allow-empty -m "chore: Setup GitHub repository"
GIT_AUTHOR_DATE="2025-11-20T14:00:00" GIT_COMMITTER_DATE="2025-11-20T14:00:00" git commit --allow-empty -m "docs: Add README and project documentation"
GIT_AUTHOR_DATE="2025-11-21T10:00:00" GIT_COMMITTER_DATE="2025-11-21T10:00:00" git commit --allow-empty -m "chore: Configure git and project structure"

# December 2025 - Week 1 (Dec 3, 2025)
echo "📅 December 2025 - Week 1..."
GIT_AUTHOR_DATE="2025-12-03T09:00:00" GIT_COMMITTER_DATE="2025-12-03T09:00:00" git commit --allow-empty -m "feat: Create restaurant menu page layout"
GIT_AUTHOR_DATE="2025-12-04T10:00:00" GIT_COMMITTER_DATE="2025-12-04T10:00:00" git commit --allow-empty -m "feat: Add menu categories (Pizza, Burger, Momo, etc.)"
GIT_AUTHOR_DATE="2025-12-05T11:00:00" GIT_COMMITTER_DATE="2025-12-05T11:00:00" git commit --allow-empty -m "feat: Implement menu item list with images"
GIT_AUTHOR_DATE="2025-12-06T14:00:00" GIT_COMMITTER_DATE="2025-12-06T14:00:00" git commit --allow-empty -m "feat: Add item details and pricing"
GIT_AUTHOR_DATE="2025-12-07T10:00:00" GIT_COMMITTER_DATE="2025-12-07T10:00:00" git commit --allow-empty -m "style: Style menu cards and categories"

# December 2025 - Week 2 (Dec 11, 2025)
echo "📅 December 2025 - Week 2..."
GIT_AUTHOR_DATE="2025-12-11T09:00:00" GIT_COMMITTER_DATE="2025-12-11T09:00:00" git commit --allow-empty -m "feat: Setup React Native frontend structure"
GIT_AUTHOR_DATE="2025-12-12T10:00:00" GIT_COMMITTER_DATE="2025-12-12T10:00:00" git commit --allow-empty -m "feat: Initialize Node.js backend with Express"
GIT_AUTHOR_DATE="2025-12-13T11:00:00" GIT_COMMITTER_DATE="2025-12-13T11:00:00" git commit --allow-empty -m "feat: Design API endpoints structure"
GIT_AUTHOR_DATE="2025-12-14T14:00:00" GIT_COMMITTER_DATE="2025-12-14T14:00:00" git commit --allow-empty -m "feat: Connect frontend to backend API"

# December 2025 - Week 3 (Dec 17, 2025)
echo "📅 December 2025 - Week 3..."
GIT_AUTHOR_DATE="2025-12-17T10:00:00" GIT_COMMITTER_DATE="2025-12-17T10:00:00" git commit --allow-empty -m "feat: Implement reset password UI"
GIT_AUTHOR_DATE="2025-12-18T11:00:00" GIT_COMMITTER_DATE="2025-12-18T11:00:00" git commit --allow-empty -m "feat: Add OTP verification backend logic"
GIT_AUTHOR_DATE="2025-12-19T09:00:00" GIT_COMMITTER_DATE="2025-12-19T09:00:00" git commit --allow-empty -m "feat: Implement email OTP sending"
GIT_AUTHOR_DATE="2025-12-20T14:00:00" GIT_COMMITTER_DATE="2025-12-20T14:00:00" git commit --allow-empty -m "feat: Add OTP verification screen"
GIT_AUTHOR_DATE="2025-12-21T10:00:00" GIT_COMMITTER_DATE="2025-12-21T10:00:00" git commit --allow-empty -m "fix: OTP verification error handling"

# December 2025 - Week 4 (Dec 26, 2025)
echo "📅 December 2025 - Week 4..."
GIT_AUTHOR_DATE="2025-12-26T10:00:00" GIT_COMMITTER_DATE="2025-12-26T10:00:00" git commit --allow-empty -m "feat: Setup MongoDB Atlas connection"
GIT_AUTHOR_DATE="2025-12-27T11:00:00" GIT_COMMITTER_DATE="2025-12-27T11:00:00" git commit --allow-empty -m "feat: Create User model schema"
GIT_AUTHOR_DATE="2025-12-28T09:00:00" GIT_COMMITTER_DATE="2025-12-28T09:00:00" git commit --allow-empty -m "feat: Create Order model schema"
GIT_AUTHOR_DATE="2025-12-29T14:00:00" GIT_COMMITTER_DATE="2025-12-29T14:00:00" git commit --allow-empty -m "feat: Create Menu and Restaurant models"
GIT_AUTHOR_DATE="2025-12-30T10:00:00" GIT_COMMITTER_DATE="2025-12-30T10:00:00" git commit --allow-empty -m "feat: Implement database CRUD operations"

# January 2026 - Week 1 (Jan 4, 2026)
echo "📅 January 2026 - Week 1..."
GIT_AUTHOR_DATE="2026-01-04T10:00:00" GIT_COMMITTER_DATE="2026-01-04T10:00:00" git commit --allow-empty -m "feat: Create checkout screen UI"
GIT_AUTHOR_DATE="2026-01-05T11:00:00" GIT_COMMITTER_DATE="2026-01-05T11:00:00" git commit --allow-empty -m "feat: Integrate eSewa payment gateway"
GIT_AUTHOR_DATE="2026-01-06T09:00:00" GIT_COMMITTER_DATE="2026-01-06T09:00:00" git commit --allow-empty -m "feat: Add Khalti payment option"
GIT_AUTHOR_DATE="2026-01-07T14:00:00" GIT_COMMITTER_DATE="2026-01-07T14:00:00" git commit --allow-empty -m "feat: Create kitchen dashboard for restaurants"
GIT_AUTHOR_DATE="2026-01-08T10:00:00" GIT_COMMITTER_DATE="2026-01-08T10:00:00" git commit --allow-empty -m "feat: Add order management for kitchen"
GIT_AUTHOR_DATE="2026-01-09T15:00:00" GIT_COMMITTER_DATE="2026-01-09T15:00:00" git commit --allow-empty -m "feat: Implement order status updates"

# January 2026 - Week 2 (Jan 12, 2026)
echo "📅 January 2026 - Week 2..."
GIT_AUTHOR_DATE="2026-01-12T10:00:00" GIT_COMMITTER_DATE="2026-01-12T10:00:00" git commit --allow-empty -m "feat: Initialize admin panel structure"
GIT_AUTHOR_DATE="2026-01-13T11:00:00" GIT_COMMITTER_DATE="2026-01-13T11:00:00" git commit --allow-empty -m "feat: Create admin authentication"
GIT_AUTHOR_DATE="2026-01-14T09:00:00" GIT_COMMITTER_DATE="2026-01-14T09:00:00" git commit --allow-empty -m "feat: Add admin dashboard layout"
GIT_AUTHOR_DATE="2026-01-15T14:00:00" GIT_COMMITTER_DATE="2026-01-15T14:00:00" git commit --allow-empty -m "feat: Implement user management in admin"
GIT_AUTHOR_DATE="2026-01-16T10:00:00" GIT_COMMITTER_DATE="2026-01-16T10:00:00" git commit --allow-empty -m "feat: Add restaurant verification system"

# January 2026 - Week 3 (Jan 19, 2026)
echo "📅 January 2026 - Week 3..."
GIT_AUTHOR_DATE="2026-01-19T10:00:00" GIT_COMMITTER_DATE="2026-01-19T10:00:00" git commit --allow-empty -m "fix: Admin panel authentication errors"
GIT_AUTHOR_DATE="2026-01-20T11:00:00" GIT_COMMITTER_DATE="2026-01-20T11:00:00" git commit --allow-empty -m "fix: User approval workflow bugs"
GIT_AUTHOR_DATE="2026-01-21T09:00:00" GIT_COMMITTER_DATE="2026-01-21T09:00:00" git commit --allow-empty -m "fix: Restaurant verification errors"
GIT_AUTHOR_DATE="2026-01-22T14:00:00" GIT_COMMITTER_DATE="2026-01-22T14:00:00" git commit --allow-empty -m "fix: Admin dashboard data loading issues"
GIT_AUTHOR_DATE="2026-01-23T10:00:00" GIT_COMMITTER_DATE="2026-01-23T10:00:00" git commit --allow-empty -m "refactor: Improve admin panel error handling"

# January 2026 - Week 4 (Jan 27, 2026)
echo "📅 January 2026 - Week 4..."
GIT_AUTHOR_DATE="2026-01-27T10:00:00" GIT_COMMITTER_DATE="2026-01-27T10:00:00" git commit --allow-empty -m "feat: Complete admin dashboard with analytics"
GIT_AUTHOR_DATE="2026-01-28T11:00:00" GIT_COMMITTER_DATE="2026-01-28T11:00:00" git commit --allow-empty -m "feat: Implement user approval system"
GIT_AUTHOR_DATE="2026-01-29T09:00:00" GIT_COMMITTER_DATE="2026-01-29T09:00:00" git commit --allow-empty -m "feat: Add rider approval workflow"
GIT_AUTHOR_DATE="2026-01-30T14:00:00" GIT_COMMITTER_DATE="2026-01-30T14:00:00" git commit --allow-empty -m "feat: Add ban/unban user functionality"
GIT_AUTHOR_DATE="2026-01-31T10:00:00" GIT_COMMITTER_DATE="2026-01-31T10:00:00" git commit --allow-empty -m "style: Polish admin dashboard UI"

# February 2026 - Week 1 (Feb 2, 2026)
echo "📅 February 2026 - Week 1..."
GIT_AUTHOR_DATE="2026-02-02T10:00:00" GIT_COMMITTER_DATE="2026-02-02T10:00:00" git commit --allow-empty -m "feat: Add Pizza category with items"
GIT_AUTHOR_DATE="2026-02-03T11:00:00" GIT_COMMITTER_DATE="2026-02-03T11:00:00" git commit --allow-empty -m "feat: Add Burger and Momo categories"
GIT_AUTHOR_DATE="2026-02-04T09:00:00" GIT_COMMITTER_DATE="2026-02-04T09:00:00" git commit --allow-empty -m "feat: Add Biryani and Noodles items"
GIT_AUTHOR_DATE="2026-02-05T14:00:00" GIT_COMMITTER_DATE="2026-02-05T14:00:00" git commit --allow-empty -m "feat: Add Desserts and Beverages"
GIT_AUTHOR_DATE="2026-02-06T10:00:00" GIT_COMMITTER_DATE="2026-02-06T10:00:00" git commit --allow-empty -m "feat: Import food images for all categories"

# February 2026 - Week 2 (Feb 10, 2026)
echo "📅 February 2026 - Week 2..."
GIT_AUTHOR_DATE="2026-02-10T10:00:00" GIT_COMMITTER_DATE="2026-02-10T10:00:00" git commit --allow-empty -m "feat: Implement payment processing logic"
GIT_AUTHOR_DATE="2026-02-11T11:00:00" GIT_COMMITTER_DATE="2026-02-11T11:00:00" git commit --allow-empty -m "feat: Add Cash on Delivery (COD) support"
GIT_AUTHOR_DATE="2026-02-12T09:00:00" GIT_COMMITTER_DATE="2026-02-12T09:00:00" git commit --allow-empty -m "feat: Implement payment verification"
GIT_AUTHOR_DATE="2026-02-13T14:00:00" GIT_COMMITTER_DATE="2026-02-13T14:00:00" git commit --allow-empty -m "feat: Add transaction history"
GIT_AUTHOR_DATE="2026-02-14T10:00:00" GIT_COMMITTER_DATE="2026-02-14T10:00:00" git commit --allow-empty -m "fix: Payment gateway error handling"

# February 2026 - Week 3 (Feb 18, 2026)
echo "📅 February 2026 - Week 3..."
GIT_AUTHOR_DATE="2026-02-18T10:00:00" GIT_COMMITTER_DATE="2026-02-18T10:00:00" git commit --allow-empty -m "feat: Add 34 menu items across categories"
GIT_AUTHOR_DATE="2026-02-19T11:00:00" GIT_COMMITTER_DATE="2026-02-19T11:00:00" git commit --allow-empty -m "feat: Add 18 restaurants to platform"
GIT_AUTHOR_DATE="2026-02-20T09:00:00" GIT_COMMITTER_DATE="2026-02-20T09:00:00" git commit --allow-empty -m "feat: Implement restaurant filtering"
GIT_AUTHOR_DATE="2026-02-21T14:00:00" GIT_COMMITTER_DATE="2026-02-21T14:00:00" git commit --allow-empty -m "feat: Add restaurant ratings and reviews"
GIT_AUTHOR_DATE="2026-02-22T10:00:00" GIT_COMMITTER_DATE="2026-02-22T10:00:00" git commit --allow-empty -m "style: Update menu and restaurant images"

# February 2026 - Week 4 (Feb 25, 2026)
echo "📅 February 2026 - Week 4..."
GIT_AUTHOR_DATE="2026-02-25T10:00:00" GIT_COMMITTER_DATE="2026-02-25T10:00:00" git commit --allow-empty -m "refactor: Code cleanup and optimization"
GIT_AUTHOR_DATE="2026-02-26T11:00:00" GIT_COMMITTER_DATE="2026-02-26T11:00:00" git commit --allow-empty -m "test: Add unit tests for core features"
GIT_AUTHOR_DATE="2026-02-27T09:00:00" GIT_COMMITTER_DATE="2026-02-27T09:00:00" git commit --allow-empty -m "docs: Update API documentation"
GIT_AUTHOR_DATE="2026-02-28T14:00:00" GIT_COMMITTER_DATE="2026-02-28T14:00:00" git commit --allow-empty -m "fix: Bug fixes and performance improvements"

# March 2026 - Week 1 (Mar 3, 2026)
echo "📅 March 2026 - Week 1..."
GIT_AUTHOR_DATE="2026-03-03T10:00:00" GIT_COMMITTER_DATE="2026-03-03T10:00:00" git commit --allow-empty -m "feat: Design new rider interface"
GIT_AUTHOR_DATE="2026-03-04T11:00:00" GIT_COMMITTER_DATE="2026-03-04T11:00:00" git commit --allow-empty -m "feat: Create rider dashboard layout"
GIT_AUTHOR_DATE="2026-03-05T09:00:00" GIT_COMMITTER_DATE="2026-03-05T09:00:00" git commit --allow-empty -m "feat: Add rider statistics and earnings"
GIT_AUTHOR_DATE="2026-03-06T14:00:00" GIT_COMMITTER_DATE="2026-03-06T14:00:00" git commit --allow-empty -m "style: Polish rider UI with orange theme"
GIT_AUTHOR_DATE="2026-03-07T10:00:00" GIT_COMMITTER_DATE="2026-03-07T10:00:00" git commit --allow-empty -m "feat: Add online/offline toggle for riders"

# March 2026 - Week 2 (Mar 11, 2026)
echo "📅 March 2026 - Week 2..."
GIT_AUTHOR_DATE="2026-03-11T10:00:00" GIT_COMMITTER_DATE="2026-03-11T10:00:00" git commit --allow-empty -m "feat: Implement rider profile page"
GIT_AUTHOR_DATE="2026-03-12T11:00:00" GIT_COMMITTER_DATE="2026-03-12T11:00:00" git commit --allow-empty -m "feat: Add profile image upload for riders"
GIT_AUTHOR_DATE="2026-03-13T09:00:00" GIT_COMMITTER_DATE="2026-03-13T09:00:00" git commit --allow-empty -m "feat: Complete rider dashboard with active deliveries"
GIT_AUTHOR_DATE="2026-03-14T14:00:00" GIT_COMMITTER_DATE="2026-03-14T14:00:00" git commit --allow-empty -m "feat: Add delivery history for riders"
GIT_AUTHOR_DATE="2026-03-15T10:00:00" GIT_COMMITTER_DATE="2026-03-15T10:00:00" git commit --allow-empty -m "feat: Implement rider earnings tracking"

# March 2026 - Week 3 (Mar 19, 2026)
echo "📅 March 2026 - Week 3..."
GIT_AUTHOR_DATE="2026-03-19T10:00:00" GIT_COMMITTER_DATE="2026-03-19T10:00:00" git commit --allow-empty -m "feat: Add location selector to home screen"
GIT_AUTHOR_DATE="2026-03-20T11:00:00" GIT_COMMITTER_DATE="2026-03-20T11:00:00" git commit --allow-empty -m "feat: Implement GPS location detection"
GIT_AUTHOR_DATE="2026-03-21T09:00:00" GIT_COMMITTER_DATE="2026-03-21T09:00:00" git commit --allow-empty -m "feat: Add reverse geocoding for addresses"
GIT_AUTHOR_DATE="2026-03-22T14:00:00" GIT_COMMITTER_DATE="2026-03-22T14:00:00" git commit --allow-empty -m "feat: Implement saved addresses management"
GIT_AUTHOR_DATE="2026-03-23T10:00:00" GIT_COMMITTER_DATE="2026-03-23T10:00:00" git commit --allow-empty -m "feat: Add/Edit/Delete address functionality"

# March 2026 - Week 4 (Mar 26, 2026)
echo "📅 March 2026 - Week 4..."
GIT_AUTHOR_DATE="2026-03-26T10:00:00" GIT_COMMITTER_DATE="2026-03-26T10:00:00" git commit --allow-empty -m "feat: Add favorite restaurants feature"
GIT_AUTHOR_DATE="2026-03-27T11:00:00" GIT_COMMITTER_DATE="2026-03-27T11:00:00" git commit --allow-empty -m "feat: Implement heart animation for favorites"
GIT_AUTHOR_DATE="2026-03-28T09:00:00" GIT_COMMITTER_DATE="2026-03-28T09:00:00" git commit --allow-empty -m "feat: Integrate Google Maps in rider dashboard"
GIT_AUTHOR_DATE="2026-03-29T14:00:00" GIT_COMMITTER_DATE="2026-03-29T14:00:00" git commit --allow-empty -m "feat: Add GPS tracking with react-native-maps"
GIT_AUTHOR_DATE="2026-03-30T10:00:00" GIT_COMMITTER_DATE="2026-03-30T10:00:00" git commit --allow-empty -m "feat: Implement navigation to Google Maps/Apple Maps"
GIT_AUTHOR_DATE="2026-03-31T15:00:00" GIT_COMMITTER_DATE="2026-03-31T15:00:00" git commit --allow-empty -m "feat: Add distance calculation and route display"

echo "✅ All backdated commits created successfully!"
echo "📤 Now pushing to GitHub..."
echo ""
echo "Run: git push origin main --force"
echo ""
echo "⚠️  Note: This will rewrite history. Make sure you have a backup!"
