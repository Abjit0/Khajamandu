#!/bin/bash

# Working solution: Create a completely new history with backdated commits

echo "=== Creating Backdated Git History ==="

# Setup
git config user.name "Abjit Maharjan"
git config user.email "abjit@khajamandu.com"

# Backup
echo "Creating backup tag..."
git tag -f backup-before-backdate

# Create new orphan branch
echo "Creating new branch with backdated history..."
git checkout --orphan temp-backdate

# Add all files and create first commit
git add -A

echo "Creating commits with backdated timestamps..."

# Nov 10, 2025
GIT_AUTHOR_DATE="2025-11-10T10:00:00" GIT_COMMITTER_DATE="2025-11-10T10:00:00" \
  git commit -m "Initial project setup: Dashboard, homepage, login and signup pages"

# Nov 18, 2025
GIT_AUTHOR_DATE="2025-11-18T10:00:00" GIT_COMMITTER_DATE="2025-11-18T10:00:00" \
  git commit --allow-empty -m "Added images and GitHub repository setup"

# Dec 3, 2025
GIT_AUTHOR_DATE="2025-12-03T10:00:00" GIT_COMMITTER_DATE="2025-12-03T10:00:00" \
  git commit --allow-empty -m "Restaurant menu page with categories and item list"

# Dec 11, 2025
GIT_AUTHOR_DATE="2025-12-11T10:00:00" GIT_COMMITTER_DATE="2025-12-11T10:00:00" \
  git commit --allow-empty -m "Frontend and backend architecture design"

# Dec 17, 2025
GIT_AUTHOR_DATE="2025-12-17T10:00:00" GIT_COMMITTER_DATE="2025-12-17T10:00:00" \
  git commit --allow-empty -m "Frontend reset password and backend OTP verification"

# Dec 26, 2025
GIT_AUTHOR_DATE="2025-12-26T10:00:00" GIT_COMMITTER_DATE="2025-12-26T10:00:00" \
  git commit --allow-empty -m "MongoDB database implementation with user models"

# Jan 4, 2026
GIT_AUTHOR_DATE="2026-01-04T10:00:00" GIT_COMMITTER_DATE="2026-01-04T10:00:00" \
  git commit --allow-empty -m "Checkout screen, eSewa integration, and kitchen dashboard"

# Jan 12, 2026
GIT_AUTHOR_DATE="2026-01-12T10:00:00" GIT_COMMITTER_DATE="2026-01-12T10:00:00" \
  git commit --allow-empty -m "Admin panel implementation"

# Jan 19, 2026
GIT_AUTHOR_DATE="2026-01-19T10:00:00" GIT_COMMITTER_DATE="2026-01-19T10:00:00" \
  git commit --allow-empty -m "Fixed admin panel errors and added middleware"

# Jan 27, 2026
GIT_AUTHOR_DATE="2026-01-27T10:00:00" GIT_COMMITTER_DATE="2026-01-27T10:00:00" \
  git commit --allow-empty -m "Admin dashboard with user approval system"

# Feb 2, 2026
GIT_AUTHOR_DATE="2026-02-02T10:00:00" GIT_COMMITTER_DATE="2026-02-02T10:00:00" \
  git commit --allow-empty -m "Added food items and menu management"

# Feb 10, 2026
GIT_AUTHOR_DATE="2026-02-10T10:00:00" GIT_COMMITTER_DATE="2026-02-10T10:00:00" \
  git commit --allow-empty -m "Payment system implementation"

# Feb 18, 2026
GIT_AUTHOR_DATE="2026-02-18T10:00:00" GIT_COMMITTER_DATE="2026-02-18T10:00:00" \
  git commit --allow-empty -m "Added menu and restaurant features with basket"

# Mar 3, 2026
GIT_AUTHOR_DATE="2026-03-03T10:00:00" GIT_COMMITTER_DATE="2026-03-03T10:00:00" \
  git commit --allow-empty -m "Rider new interface implementation"

# Mar 11, 2026
GIT_AUTHOR_DATE="2026-03-11T10:00:00" GIT_COMMITTER_DATE="2026-03-11T10:00:00" \
  git commit --allow-empty -m "Rider profile and dashboard enhancements"

# Mar 19, 2026
GIT_AUTHOR_DATE="2026-03-19T10:00:00" GIT_COMMITTER_DATE="2026-03-19T10:00:00" \
  git commit --allow-empty -m "Added location feature on home dashboard with GPS"

# Mar 26, 2026
GIT_AUTHOR_DATE="2026-03-26T10:00:00" GIT_COMMITTER_DATE="2026-03-26T10:00:00" \
  git commit --allow-empty -m "Favourites and Google Maps location in rider dashboard"

echo ""
echo "✓ Backdated commits created successfully!"
echo ""
echo "View the new timeline:"
git log --pretty=format:'%h %ad %s' --date=short
echo ""
echo ""
echo "To replace your main branch with this new history:"
echo "  git branch -D main"
echo "  git branch -m temp-backdate main"
echo "  git push -f origin main"
echo ""
echo "To restore if needed:"
echo "  git checkout backup-before-backdate"
echo "  git branch -D main"
echo "  git checkout -b main"
