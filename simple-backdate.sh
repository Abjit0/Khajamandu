#!/bin/bash

# Simple approach: Amend each commit with new dates

echo "Backing up current branch..."
git branch -D timeline-backup 2>/dev/null
git branch timeline-backup

echo "Setting git identity..."
git config user.name "Abjit Maharjan"
git config user.email "abjit@khajamandu.com"

# Get list of commits in reverse order (oldest first)
commits=($(git log --reverse --pretty=format:"%H"))

# Define dates for each commit based on timeline
dates=(
    "2025-11-10T10:00:00"  # first commit / Initial backup
    "2025-11-10T12:00:00"  # Fix nested frontend
    "2025-11-18T10:00:00"  # Updated all images
    "2025-12-03T10:00:00"  # Fix basket persistence
    "2025-12-11T10:00:00"  # Fixed every menus
    "2026-01-04T10:00:00"  # Added more restaurants
    "2026-02-18T10:00:00"  # Added Favourites
    "2026-03-19T10:00:00"  # added location to home
    "2026-03-26T10:00:00"  # added maps for rider
    "2026-03-26T14:00:00"  # added real current location
)

echo "Total commits: ${#commits[@]}"
echo "Rewriting history with new dates..."

# Use git filter-branch to rewrite dates
git filter-branch -f --env-filter '
n=0
for commit in '"${commits[@]}"'; do
    if [ "$GIT_COMMIT" = "$commit" ]; then
        export GIT_AUTHOR_DATE="'"${dates[$n]}"'"
        export GIT_COMMITTER_DATE="'"${dates[$n]}"'"
        break
    fi
    n=$((n+1))
done
' -- --all

echo ""
echo "✓ Commits have been backdated!"
echo ""
echo "View the new timeline:"
echo "  git log --pretty=format:'%h %ad %s' --date=short"
echo ""
echo "To push to GitHub (WARNING: This will overwrite remote history!):"
echo "  git push -f origin main"
echo ""
echo "If something went wrong, restore with:"
echo "  git reset --hard timeline-backup"
