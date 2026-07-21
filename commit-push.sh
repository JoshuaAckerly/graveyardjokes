#!/bin/bash
# Commit and push changes for this project
# Usage: ./commit-push.sh [commit message]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_NAME="$(basename "$SCRIPT_DIR")"

echo "Git Commit & Push — $PROJECT_NAME"
echo "=================================="

if [ -n "$1" ]; then
    COMMIT_MESSAGE="$*"
else
    echo "Enter commit message:"
    read -r COMMIT_MESSAGE
    if [ -z "$COMMIT_MESSAGE" ]; then
        echo -e "${RED}Error: Commit message cannot be empty${NC}"
        exit 1
    fi
fi

echo ""
CURRENT_BRANCH=$(git branch --show-current)
echo "Branch: $CURRENT_BRANCH"
echo "Message: $COMMIT_MESSAGE"
echo ""

# Stage all changes, exclude .env files
git add -A
git reset HEAD .env 2>/dev/null || true
git reset HEAD .env.backup 2>/dev/null || true
git reset HEAD ".env."* 2>/dev/null || true

if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠ No changes to commit${NC}"
    exit 0
fi

echo "Changes to commit:"
git diff --staged --stat
echo ""

git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✓ Committed${NC}"

echo "Pushing to origin/$CURRENT_BRANCH..."
git push -u origin "$CURRENT_BRANCH"
echo -e "${GREEN}✓ Pushed${NC}"
