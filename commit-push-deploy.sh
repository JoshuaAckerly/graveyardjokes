#!/bin/bash
# Commit, push, and deploy to production via SSH
# Usage: ./commit-push-deploy.sh [commit message]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

DEPLOY_HOST="ubuntu@3.151.185.242"
DEPLOY_PATH="/var/www/graveyardjokes"

# Optional: set DEPLOY_SSH_KEY env var to use a specific identity file
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$DEPLOY_SSH_KEY" ]; then
    SSH_OPTS="$SSH_OPTS -i $DEPLOY_SSH_KEY"
fi

echo -e "${CYAN}Commit, Push & Deploy — graveyardjokes${NC}"
echo "========================================"

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

# Step 1: Commit and push
echo -e "${CYAN}Step 1/2 — Commit & push${NC}"
"$SCRIPT_DIR/commit-push.sh" "$COMMIT_MESSAGE"

echo ""

# Step 2: Deploy on production server via SSH
echo -e "${CYAN}Step 2/2 — Deploying to production ($DEPLOY_HOST)${NC}"
echo "--------------------------------------------"
# shellcheck disable=SC2086
ssh $SSH_OPTS "$DEPLOY_HOST" "cd $DEPLOY_PATH && bash deploy-production.sh"

echo ""
echo -e "${GREEN}✓ Deployed successfully${NC}"
