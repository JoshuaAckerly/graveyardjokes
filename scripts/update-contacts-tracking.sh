#!/bin/bash

# Contact Tracking Update Script
# Refreshes the CONTACTS_TRACKING.md file with current database data

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
TRACKING_FILE="$PROJECT_ROOT/../CONTACTS_TRACKING.md"

echo "🔄 Updating contact tracking..."
echo "   Project: $PROJECT_ROOT"
echo "   Tracking file: $TRACKING_FILE"

cd "$PROJECT_ROOT"

# Run the artisan command
php artisan contacts:export-tracking

echo "✅ Contact tracking updated successfully!"
echo "   File: $TRACKING_FILE"
echo ""
echo "📊 Latest stats:"
head -5 "$TRACKING_FILE" | tail -3
