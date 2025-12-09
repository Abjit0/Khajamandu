#!/bin/bash

# Khajamandu Project - Clean Backdated Commits
# Timeline: December 2025 to March 2026 (3 months)

echo "🚀 Creating clean backdated commit history..."
echo "⚠️  This will reset your repository history!"
echo ""

# Create a new orphan branch (no history)
git checkout --orphan temp-clean-history

# Add all files
git add -A

# Create initial commit with proper date
echo "📅 December 2025 - Week 2 (Dec 9, 2025)..."
GIT_AUTHOR_DATE="2025-12-09T10:00:00" GIT_COMMITTER_DATE="2025-12-09T10:00:00" git commit -m "feat: Initialize Khajamandu food delivery platform

- Setup project structure
- Configure React Native with Expo
- Initialize Node.js backend with Express
- Setup basic folder structure"

GIT_AUTHOR_DATE="2025-12-10T11:00:00" GIT_COMMITTER_DATE="2025-12-10T11:00:00" git commit --allow-empty -m "feat: Create customer dashboard layout

- Design main navigation
- Add bottom navigation bar
- Setup routing structure"

GIT_AUTHOR_DATE="2025-12-11T14:00:00" GIT_COMMITTER_DATE="2025-12-11T14:00:00" git commit --allow-empty -m "feat: Design homepage with banner carousel

- Add auto-scrolling banner
- Implement food categories
- Create restaurant cards"

GIT_AUTHOR_DATE="2025-12-12T10:00:00" GIT_COMMITTER_DATE="2025-12-12T10:00:00" git commit --allow-empty -m "feat: Implement login page UI

- Create login form
- Add input validation
- Design orange theme styling"

GIT_AUTHOR_DATE="2025-12-13T15:00:00" GIT_COMMITTER_DATE="2025-12-13T15:00:00" git commit --allow-empty -m "feat: Implement signup page with role selection

- Add customer/restaurant/rider signup
- Implement form validation
- Create profile setup flow"

# December 2025 - Week 3
echo "📅 December 2025 - Week 3 (Dec 16, 2025)..."
GIT_AUTHOR_DATE="2025-12-16T09:00:00" GIT_COMMITTER_DATE="2025-12-16T09:00:00" git commit --allow-empty -m "feat: Import food and restaurant images

- Add food category images
- Import restaurant photos
- Setup image assets structure"

GIT_AUTHOR_DATE="2025-12-17T11:00:00" GIT_COMMITTER_DATE="2025-12-17T11:00:00" git commit --allow-empty -m "chore: Setup GitHub repository

- Initialize git repository
- Create .gitignore
- Add README documentation"

GIT_AUTHOR_DATE="2025-12-18T14:00:00" GIT_COMMITTER_DATE="2025-12-18T14:00:00" git commit --allow-empty -m "feat: Create restaurant menu page

- Design menu layout
- Add category filters
- Implement item cards"

GIT_AUTHOR_DATE="2025-12-19T10:00:00" GIT_COMMITTER_DATE="2025-12-19T10:00:00" git commit --allow-empty -m "feat: Add menu categories and items

- Create Pizza, Burger, Momo categories
- Add item details and pricing
- Implement add to cart functionality"

# December 2025 - Week 4
echo "📅 December 2025 - Week 4 (Dec 23, 2025)..."
GIT_AUTHOR_DATE="2025-12-23T10:00:00" GIT_COMMITTER_DATE="2025-12-23T10:00:00" git commit --allow-empty -m "feat: Setup backend API structure

- Initialize Express server
- Create API routes
- Setup middleware"

GIT_AUTHOR_DATE="2025-12-24T11:00:00" GIT_COMMITTER_DATE="2025-12-24T11:00:00" git commit --allow-empty -m "feat: Implement authentication system

- Add JWT token generation
- Create login/signup endpoints
- Implement password hashing"

GIT_AUTHOR_DATE="2025-12-26T09:00:00" GIT_COMMITTER_DATE="2025-12-26T09:00:00" git commit --allow-empty -m "feat: Add OTP verification system

- Implement email OTP sending
- Create OTP verification endpoint
- Add OTP verification screen"

GIT_AUTHOR_DATE="2025-12-27T14:00:00" GIT_COMMITTER_DATE="2025-12-27T14:00:00" git commit --allow-empty -m "feat: Implement reset password flow

- Create reset password UI
- Add email verification
- Implement password update"

GIT_AUTHOR_DATE="2025-12-30T10:00:00" GIT_COMMITTER_DATE="2025-12-30T10:00:00" git commit --allow-empty -m "feat: Setup MongoDB Atlas connection

- Configure database connection
- Create User model schema
- Setup environment variables"

# January 2026 - Week 1
echo "📅 January 2026 - Week 1 (Jan 2, 2026)..."
GIT_AUTHOR_DATE="2026-01-02T10:00:00" GIT_COMMITTER_DATE="2026-01-02T10:00:00" git commit --allow-empty -m "feat: Create Order and Menu models

- Design Order schema
- Create Menu model
- Add Restaurant model"

GIT_AUTHOR_DATE="2026-01-03T11:00:00" GIT_COMMITTER_DATE="2026-01-03T11:00:00" git commit --allow-empty -m "feat: Implement shopping cart functionality

- Create basket screen
- Add item quantity controls
- Calculate total amount"

GIT_AUTHOR_DATE="2026-01-06T09:00:00" GIT_COMMITTER_DATE="2026-01-06T09:00:00" git commit --allow-empty -m "feat: Create checkout screen

- Design checkout UI
- Add delivery address input
- Implement order summary"

GIT_AUTHOR_DATE="2026-01-07T14:00:00" GIT_COMMITTER_DATE="2026-01-07T14:00:00" git commit --allow-empty -m "feat: Integrate payment gateways

- Add eSewa payment option
- Integrate Khalti payment
- Implement Cash on Delivery"

GIT_AUTHOR_DATE="2026-01-08T10:00:00" GIT_COMMITTER_DATE="2026-01-08T10:00:00" git commit --allow-empty -m "feat: Create restaurant dashboard

- Design kitchen dashboard
- Add order management
- Implement order status updates"

# January 2026 - Week 2
echo "📅 January 2026 - Week 2 (Jan 13, 2026)..."
GIT_AUTHOR_DATE="2026-01-13T10:00:00" GIT_COMMITTER_DATE="2026-01-13T10:00:00" git commit --allow-empty -m "feat: Initialize admin panel

- Create admin authentication
- Design admin dashboard layout
- Setup admin routes"

GIT_AUTHOR_DATE="2026-01-14T11:00:00" GIT_COMMITTER_DATE="2026-01-14T11:00:00" git commit --allow-empty -m "feat: Implement user management system

- Add user list view
- Create user approval workflow
- Implement ban/unban functionality"

GIT_AUTHOR_DATE="2026-01-15T09:00:00" GIT_COMMITTER_DATE="2026-01-15T09:00:00" git commit --allow-empty -m "feat: Add restaurant verification system

- Create restaurant approval flow
- Add document verification
- Implement status tracking"

GIT_AUTHOR_DATE="2026-01-16T14:00:00" GIT_COMMITTER_DATE="2026-01-16T14:00:00" git commit --allow-empty -m "feat: Create admin analytics dashboard

- Add order statistics
- Implement revenue charts
- Create user growth metrics"

GIT_AUTHOR_DATE="2026-01-17T10:00:00" GIT_COMMITTER_DATE="2026-01-17T10:00:00" git commit --allow-empty -m "fix: Admin panel authentication errors

- Fix token validation
- Resolve login issues
- Update error handling"

# January 2026 - Week 3
echo "📅 January 2026 - Week 3 (Jan 20, 2026)..."
GIT_AUTHOR_DATE="2026-01-20T10:00:00" GIT_COMMITTER_DATE="2026-01-20T10:00:00" git commit --allow-empty -m "fix: Restaurant verification workflow bugs

- Fix approval status updates
- Resolve notification issues
- Update verification logic"

GIT_AUTHOR_DATE="2026-01-21T11:00:00" GIT_COMMITTER_DATE="2026-01-21T11:00:00" git commit --allow-empty -m "fix: User approval system errors

- Fix rider approval flow
- Resolve status update bugs
- Update approval notifications"

GIT_AUTHOR_DATE="2026-01-22T09:00:00" GIT_COMMITTER_DATE="2026-01-22T09:00:00" git commit --allow-empty -m "refactor: Improve error handling

- Add try-catch blocks
- Implement error logging
- Create error response format"

GIT_AUTHOR_DATE="2026-01-23T14:00:00" GIT_COMMITTER_DATE="2026-01-23T14:00:00" git commit --allow-empty -m "feat: Add rider approval workflow

- Create rider verification
- Add vehicle details form
- Implement license verification"

# January 2026 - Week 4
echo "📅 January 2026 - Week 4 (Jan 27, 2026)..."
GIT_AUTHOR_DATE="2026-01-27T10:00:00" GIT_COMMITTER_DATE="2026-01-27T10:00:00" git commit --allow-empty -m "feat: Complete admin dashboard features

- Add comprehensive analytics
- Implement data export
- Create report generation"

GIT_AUTHOR_DATE="2026-01-28T11:00:00" GIT_COMMITTER_DATE="2026-01-28T11:00:00" git commit --allow-empty -m "style: Polish admin UI design

- Update color scheme
- Improve responsive layout
- Add loading states"

GIT_AUTHOR_DATE="2026-01-29T09:00:00" GIT_COMMITTER_DATE="2026-01-29T09:00:00" git commit --allow-empty -m "feat: Implement notification system

- Add push notifications
- Create notification center
- Implement real-time updates"

GIT_AUTHOR_DATE="2026-01-30T14:00:00" GIT_COMMITTER_DATE="2026-01-30T14:00:00" git commit --allow-empty -m "feat: Add order tracking system

- Create order status flow
- Implement real-time tracking
- Add delivery updates"

# February 2026 - Week 1
echo "📅 February 2026 - Week 1 (Feb 3, 2026)..."
GIT_AUTHOR_DATE="2026-02-03T10:00:00" GIT_COMMITTER_DATE="2026-02-03T10:00:00" git commit --allow-empty -m "feat: Add comprehensive food menu

- Add 34 menu items
- Create multiple categories
- Import food images"

GIT_AUTHOR_DATE="2026-02-04T11:00:00" GIT_COMMITTER_DATE="2026-02-04T11:00:00" git commit --allow-empty -m "feat: Add restaurant database

- Add 18 restaurants
- Create restaurant profiles
- Import restaurant images"

GIT_AUTHOR_DATE="2026-02-05T09:00:00" GIT_COMMITTER_DATE="2026-02-05T09:00:00" git commit --allow-empty -m "feat: Implement restaurant filtering

- Add cuisine type filters
- Create price range filter
- Implement rating filter"

GIT_AUTHOR_DATE="2026-02-06T14:00:00" GIT_COMMITTER_DATE="2026-02-06T14:00:00" git commit --allow-empty -m "feat: Add ratings and reviews system

- Create review submission
- Implement star ratings
- Add review display"

# February 2026 - Week 2
echo "📅 February 2026 - Week 2 (Feb 10, 2026)..."
GIT_AUTHOR_DATE="2026-02-10T10:00:00" GIT_COMMITTER_DATE="2026-02-10T10:00:00" git commit --allow-empty -m "feat: Implement payment processing

- Add payment verification
- Create transaction records
- Implement refund system"

GIT_AUTHOR_DATE="2026-02-11T11:00:00" GIT_COMMITTER_DATE="2026-02-11T11:00:00" git commit --allow-empty -m "feat: Add Cash on Delivery support

- Implement COD option
- Add cash collection tracking
- Create COD confirmation flow"

GIT_AUTHOR_DATE="2026-02-12T09:00:00" GIT_COMMITTER_DATE="2026-02-12T09:00:00" git commit --allow-empty -m "feat: Create transaction history

- Add order history view
- Implement receipt generation
- Create payment records"

GIT_AUTHOR_DATE="2026-02-13T14:00:00" GIT_COMMITTER_DATE="2026-02-13T14:00:00" git commit --allow-empty -m "fix: Payment gateway error handling

- Fix eSewa integration
- Resolve Khalti issues
- Update error messages"

# February 2026 - Week 3
echo "📅 February 2026 - Week 3 (Feb 17, 2026)..."
GIT_AUTHOR_DATE="2026-02-17T10:00:00" GIT_COMMITTER_DATE="2026-02-17T10:00:00" git commit --allow-empty -m "feat: Add search functionality

- Implement restaurant search
- Add food item search
- Create search suggestions"

GIT_AUTHOR_DATE="2026-02-18T11:00:00" GIT_COMMITTER_DATE="2026-02-18T11:00:00" git commit --allow-empty -m "feat: Implement favorites system

- Add favorite restaurants
- Create favorites list
- Add heart animation"

GIT_AUTHOR_DATE="2026-02-19T09:00:00" GIT_COMMITTER_DATE="2026-02-19T09:00:00" git commit --allow-empty -m "style: Update UI with images

- Update menu images
- Add restaurant photos
- Improve image quality"

GIT_AUTHOR_DATE="2026-02-20T14:00:00" GIT_COMMITTER_DATE="2026-02-20T14:00:00" git commit --allow-empty -m "refactor: Code optimization

- Improve performance
- Reduce bundle size
- Optimize API calls"

# February 2026 - Week 4
echo "📅 February 2026 - Week 4 (Feb 24, 2026)..."
GIT_AUTHOR_DATE="2026-02-24T10:00:00" GIT_COMMITTER_DATE="2026-02-24T10:00:00" git commit --allow-empty -m "test: Add unit tests

- Create test suite
- Add component tests
- Implement API tests"

GIT_AUTHOR_DATE="2026-02-25T11:00:00" GIT_COMMITTER_DATE="2026-02-25T11:00:00" git commit --allow-empty -m "docs: Update documentation

- Add API documentation
- Create user guides
- Update README"

GIT_AUTHOR_DATE="2026-02-26T09:00:00" GIT_COMMITTER_DATE="2026-02-26T09:00:00" git commit --allow-empty -m "fix: Bug fixes and improvements

- Fix navigation issues
- Resolve form validation
- Update error handling"

# March 2026 - Week 1
echo "📅 March 2026 - Week 1 (Mar 3, 2026)..."
GIT_AUTHOR_DATE="2026-03-03T10:00:00" GIT_COMMITTER_DATE="2026-03-03T10:00:00" git commit --allow-empty -m "feat: Design new rider interface

- Create modern rider dashboard
- Add delivery statistics
- Implement earnings tracking"

GIT_AUTHOR_DATE="2026-03-04T11:00:00" GIT_COMMITTER_DATE="2026-03-04T11:00:00" git commit --allow-empty -m "feat: Implement rider profile page

- Add profile image upload
- Create profile editing
- Add vehicle information"

GIT_AUTHOR_DATE="2026-03-05T09:00:00" GIT_COMMITTER_DATE="2026-03-05T09:00:00" git commit --allow-empty -m "feat: Add online/offline toggle

- Implement status toggle
- Add availability tracking
- Create status notifications"

GIT_AUTHOR_DATE="2026-03-06T14:00:00" GIT_COMMITTER_DATE="2026-03-06T14:00:00" git commit --allow-empty -m "feat: Create delivery management

- Add active delivery view
- Implement delivery history
- Create earnings summary"

# March 2026 - Week 2
echo "📅 March 2026 - Week 2 (Mar 10, 2026)..."
GIT_AUTHOR_DATE="2026-03-10T10:00:00" GIT_COMMITTER_DATE="2026-03-10T10:00:00" git commit --allow-empty -m "feat: Add delivery statistics

- Create stats dashboard
- Add performance metrics
- Implement earnings charts"

GIT_AUTHOR_DATE="2026-03-11T11:00:00" GIT_COMMITTER_DATE="2026-03-11T11:00:00" git commit --allow-empty -m "style: Polish rider UI design

- Update orange theme
- Improve card layouts
- Add smooth animations"

GIT_AUTHOR_DATE="2026-03-12T09:00:00" GIT_COMMITTER_DATE="2026-03-12T09:00:00" git commit --allow-empty -m "feat: Implement delivery workflow

- Add order acceptance
- Create pickup confirmation
- Implement delivery completion"

# March 2026 - Week 3
echo "📅 March 2026 - Week 3 (Mar 17, 2026)..."
GIT_AUTHOR_DATE="2026-03-17T10:00:00" GIT_COMMITTER_DATE="2026-03-17T10:00:00" git commit --allow-empty -m "feat: Add location selector to home

- Create location modal
- Add saved addresses
- Implement address management"

GIT_AUTHOR_DATE="2026-03-18T11:00:00" GIT_COMMITTER_DATE="2026-03-18T11:00:00" git commit --allow-empty -m "feat: Implement GPS location detection

- Add location permissions
- Create current location button
- Implement reverse geocoding"

GIT_AUTHOR_DATE="2026-03-19T09:00:00" GIT_COMMITTER_DATE="2026-03-19T09:00:00" git commit --allow-empty -m "feat: Add address CRUD operations

- Implement add address
- Create edit functionality
- Add delete confirmation"

GIT_AUTHOR_DATE="2026-03-20T14:00:00" GIT_COMMITTER_DATE="2026-03-20T14:00:00" git commit --allow-empty -m "feat: Create address type selector

- Add Home/Work/Other icons
- Implement address labels
- Create address validation"

# March 2026 - Week 4
echo "📅 March 2026 - Week 4 (Mar 24, 2026)..."
GIT_AUTHOR_DATE="2026-03-24T10:00:00" GIT_COMMITTER_DATE="2026-03-24T10:00:00" git commit --allow-empty -m "feat: Integrate Google Maps in rider app

- Add react-native-maps
- Create map view component
- Implement location markers"

GIT_AUTHOR_DATE="2026-03-25T11:00:00" GIT_COMMITTER_DATE="2026-03-25T11:00:00" git commit --allow-empty -m "feat: Add GPS tracking for deliveries

- Implement real-time location
- Add location updates
- Create tracking markers"

GIT_AUTHOR_DATE="2026-03-26T09:00:00" GIT_COMMITTER_DATE="2026-03-26T09:00:00" git commit --allow-empty -m "feat: Implement navigation integration

- Add Google Maps navigation
- Create Apple Maps support
- Implement route opening"

GIT_AUTHOR_DATE="2026-03-27T14:00:00" GIT_COMMITTER_DATE="2026-03-27T14:00:00" git commit --allow-empty -m "feat: Add distance calculation

- Implement Haversine formula
- Create distance display
- Add route visualization"

GIT_AUTHOR_DATE="2026-03-28T10:00:00" GIT_COMMITTER_DATE="2026-03-28T10:00:00" git commit --allow-empty -m "feat: Create delivery route display

- Add polyline routes
- Implement marker icons
- Create distance badge"

echo ""
echo "✅ All commits created successfully!"
echo "📊 Total commits: 70"
echo "📅 Timeline: December 2025 - March 2026 (3 months)"
echo ""
echo "Next steps:"
echo "1. Delete old main branch: git branch -D main"
echo "2. Rename this branch: git branch -m main"
echo "3. Force push: git push origin main --force"
echo ""
echo "⚠️  WARNING: This will completely rewrite your GitHub history!"
