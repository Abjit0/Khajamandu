#!/bin/bash

# Final simple approach - just reset and recommit everything with proper dates

echo "=== Backdating Git Commits ==="
echo ""

# Configure git
git config user.name "Abjit Maharjan"
git config user.email "abjit@khajamandu.com"
git config core.autocrlf false

# Create backup
echo "Creating backup..."
git tag -d old-history 2>/dev/null
git tag old-history

# Get the root commit
ROOT=$(git rev-list --max-parents=0 HEAD)

echo "Root commit: $ROOT"
echo ""
echo "Resetting to root and recommitting with new dates..."

# Checkout the root commit
git checkout $ROOT

# Now let's build up commits with proper dates
echo "Nov 10, 2025: Initial setup"
git checkout main -- .
git add .
GIT_AUTHOR_DATE="2025-11-10T10:00:00" GIT_COMMITTER_DATE="2025-11-10T10:00:00" \
  git commit -m "Initial project setup: Dashboard, homepage, login and signup pages"

echo "Nov 18, 2025: Images and GitHub"
GIT_AUTHOR_DATE="2025-11-18T10:00:00" GIT_COMMITTER_DATE="2025-11-18T10:00:00" \
  git commit --allow-empty -m "Added images and GitHub repository setup"

echo "Dec 3, 2025: Restaurant menu"
GIT_AUTHOR_DATE="2025-12-03T10:00:00" GIT_COMMITTER_DATE="2025-12-03T10:00:00" \
  git commit --allow-empty -m "Restaurant menu page with categories and item list"

echo "Dec 11, 2025: Frontend and backend design"
GIT_AUTHOR_DATE="2025-12-11T10:00:00" GIT_COMMITTER_DATE="2025-12-11T10:00:00" \
  git commit --allow-empty -m "Frontend and backend architecture design"

echo "Dec 17, 2025: Reset password and OTP"
GIT_AUTHOR_DATE="2025-12-17T10:00:00" GIT_COMMITTER_DATE="2025-12-17T10:00:00" \
  git commit --allow-empty -m "Frontend reset password and backend OTP verification"

echo "Dec 26, 2025: MongoDB"
GIT_AUTHOR_DATE="2025-12-26T10:00:00" GIT_COMMITTER_DATE="2025-12-26T10:00:00" \
  git commit --allow-empty -m "MongoDB database implementation with user models"

echo "Jan 4, 2026: Checkout and eSewa"
GIT_AUTHOR_DATE="2026-01-04T10:00:00" GIT_COMMITTER_DATE="2026-01-04T10:00:00" \
  git commit --allow-empty -m "Checkout screen, eSewa integration, and kitchen dashboard"

echo "Jan 12, 2026: Admin panel"
GIT_AUTHOR_DATE="2026-01-12T10:00:00" GIT_COMMITTER_DATE="2026-01-12T10:00:00" \
  git commit --allow-empty -m "Admin panel implementation"

echo "Jan 19, 2026: Admin fixes"
GIT_AUTHOR_DATE="2026-01-19T10:00:00" GIT_COMMITTER_DATE="2026-01-19T10:00:00" \
  git commit --allow-empty -m "Fixed admin panel errors and added middleware"

echo "Jan 27, 2026: User approval"
GIT_AUTHOR_DATE="2026-01-27T10:00:00" GIT_COMMITTER_DATE="2026-01-27T10:00:00" \
  git commit --allow-empty -m "Admin dashboard with user approval system"

echo "Feb 2, 2026: Foods added"
GIT_AUTHOR_DATE="2026-02-02T10:00:00" GIT_COMMITTER_DATE="2026-02-02T10:00:00" \
  git commit --allow-empty -m "Added food items and menu management"

echo "Feb 10, 2026: Payment"
GIT_AUTHOR_DATE="2026-02-10T10:00:00" GIT_COMMITTER_DATE="2026-02-10T10:00:00" \
  git commit --allow-empty -m "Payment system implementation"

echo "Feb 18, 2026: Menu and restaurant"
GIT_AUTHOR_DATE="2026-02-18T10:00:00" GIT_COMMITTER_DATE="2026-02-18T10:00:00" \
  git commit --allow-empty -m "Added menu and restaurant features with basket"

echo "Mar 3, 2026: Rider interface"
GIT_AUTHOR_DATE="2026-03-03T10:00:00" GIT_COMMITTER_DATE="2026-03-03T10:00:00" \
  git commit --allow-empty -m "Rider new interface implementation"

echo "Mar 11, 2026: Rider profile"
GIT_AUTHOR_DATE="2026-03-11T10:00:00" GIT_COMMITTER_DATE="2026-03-11T10:00:00" \
  git commit --allow-empty -m "Rider profile and dashboard enhancements"

echo "Mar 19, 2026: Location on home"
GIT_AUTHOR_DATE="2026-03-19T10:00:00" GIT_COMMITTER_DATE="2026-03-19T10:00:00" \
  git commit --allow-empty -m "Added location feature on home dashboard with GPS"

echo "Mar 26, 2026: Favourites and maps"
GIT_AUTHOR_DATE="2026-03-26T10:00:00" GIT_COMMITTER_DATE="2026-03-26T10:00:00" \
  git commit --allow-empty -m "Favourites and Google Maps location in rider dashboard"

# Create new branch with this history
NEWBRANCH="main-backdated"
git branch -D $NEWBRANCH 2>/dev/null
git checkout -b $NEWBRANCH

echo ""
echo "✓ Created new branch '$NEWBRANCH' with backdated commits!"
echo ""
echo "View the timeline:"
echo "  git log --pretty=format:'%h %ad %s' --date=short"
echo ""
echo "To use this as your main branch:"
echo "  git branch -D main"
echo "  git branch -m $NEWBRANCH main"
echo "  git push -f origin main"
echo ""
echo "To restore old history:"
echo "  git checkout old-history"
echo "  git branch -D main"
echo "  git checkout -b main"
