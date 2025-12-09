#!/bin/bash

# Simple script to create backdated commits
# This will reset to a clean state and create new commits with proper dates

echo "Setting up git identity..."
git config user.name "Abjit Maharjan"
git config user.email "abjit@khajamandu.com"

echo "Creating backup..."
git branch -D backup-old 2>/dev/null
git branch backup-old

echo "Resetting to create fresh history..."
# We'll use git rebase to rewrite history with new dates

# First, let's get the first commit hash
FIRST_COMMIT=$(git rev-list --max-parents=0 HEAD)

echo "First commit: $FIRST_COMMIT"

# Create a temporary script for git filter-branch
cat > /tmp/git-date-script.sh << 'DATESCRIPT'
#!/bin/bash

# Map commit messages to dates
case "$GIT_COMMIT" in
    *"first commit"* | *"Initial backup"* | *"Fix nested"*)
        export GIT_AUTHOR_DATE="2025-11-10T10:00:00"
        export GIT_COMMITTER_DATE="2025-11-10T10:00:00"
        ;;
    *"Updated all images"*)
        export GIT_AUTHOR_DATE="2025-11-18T10:00:00"
        export GIT_COMMITTER_DATE="2025-11-18T10:00:00"
        ;;
    *"basket persistence"*)
        export GIT_AUTHOR_DATE="2025-12-03T10:00:00"
        export GIT_COMMITTER_DATE="2025-12-03T10:00:00"
        ;;
    *"Fixed every menus"*)
        export GIT_AUTHOR_DATE="2025-12-11T10:00:00"
        export GIT_COMMITTER_DATE="2025-12-11T10:00:00"
        ;;
    *"Added more restaurants"*)
        export GIT_AUTHOR_DATE="2026-01-04T10:00:00"
        export GIT_COMMITTER_DATE="2026-01-04T10:00:00"
        ;;
    *"Favourites"*)
        export GIT_AUTHOR_DATE="2026-02-18T10:00:00"
        export GIT_COMMITTER_DATE="2026-02-18T10:00:00"
        ;;
    *"location to home"*)
        export GIT_AUTHOR_DATE="2026-03-19T10:00:00"
        export GIT_COMMITTER_DATE="2026-03-19T10:00:00"
        ;;
    *"maps for rider"*)
        export GIT_AUTHOR_DATE="2026-03-26T10:00:00"
        export GIT_COMMITTER_DATE="2026-03-26T10:00:00"
        ;;
    *"real current location"*)
        export GIT_AUTHOR_DATE="2026-03-26T14:00:00"
        export GIT_COMMITTER_DATE="2026-03-26T14:00:00"
        ;;
esac
DATESCRIPT

chmod +x /tmp/git-date-script.sh

echo "Rewriting commit dates..."
git filter-branch -f --env-filter 'source /tmp/git-date-script.sh' -- --all

echo ""
echo "Done! Check the new dates with: git log --pretty=format:'%h %ad %s' --date=short"
echo ""
echo "To push to GitHub (this will overwrite remote history):"
echo "  git push -f origin main"
