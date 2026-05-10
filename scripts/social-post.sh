#!/usr/bin/env bash
# social-post.sh — Schedule a social media post to the production server.
#
# Usage:
#   ./scripts/social-post.sh --platform=facebook --content="Hello!" --at="tomorrow 9am"
#   ./scripts/social-post.sh --platform=discord  --content="Update!" --at="now"
#   ./scripts/social-post.sh --platform=instagram --content="Photo!" --at="2026-05-12 10:00" --media-url="https://..."
#   ./scripts/social-post.sh --list
#
# Reads SOCIAL_SCHEDULE_SECRET and SOCIAL_API_URL from .env in the project root.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

# Load .env
if [[ ! -f "$ENV_FILE" ]]; then
    echo "Error: .env not found at $ENV_FILE" >&2
    exit 1
fi

SECRET=$(grep -E '^SOCIAL_SCHEDULE_SECRET=' "$ENV_FILE" | cut -d= -f2- | tr -d '[:space:]')
API_URL=$(grep -E '^SOCIAL_API_URL=' "$ENV_FILE" | cut -d= -f2- | tr -d '[:space:]')
API_URL="${API_URL:-https://graveyardjokes.com}"

if [[ -z "$SECRET" ]]; then
    echo "Error: SOCIAL_SCHEDULE_SECRET not set in .env" >&2
    exit 1
fi

# Parse flags
PLATFORM=""
CONTENT=""
SCHEDULED_AT=""
MEDIA_URL=""
LIST=false

for arg in "$@"; do
    case "$arg" in
        --platform=*)  PLATFORM="${arg#--platform=}"   ;;
        --content=*)   CONTENT="${arg#--content=}"     ;;
        --at=*)        SCHEDULED_AT="${arg#--at=}"     ;;
        --media-url=*) MEDIA_URL="${arg#--media-url=}" ;;
        --list)        LIST=true                        ;;
        --help|-h)
            grep '^#' "$0" | head -12 | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "Unknown option: $arg" >&2
            exit 1
            ;;
    esac
done

ENDPOINT="${API_URL}/api/social/schedule"

# List mode
if [[ "$LIST" == true ]]; then
    curl -sf -H "Authorization: Bearer $SECRET" "$ENDPOINT" | \
        python3 -c "
import json, sys
data = json.load(sys.stdin)
posts = data.get('data', [])
if not posts:
    print('No scheduled posts.')
    sys.exit(0)
print(f\"{'ID':<5} {'Platform':<12} {'Status':<10} {'Scheduled At':<22} Content\")
print('-' * 90)
for p in posts:
    print(f\"{p['id']:<5} {p['platform']:<12} {p['status']:<10} {p['scheduled_at']:<22} {p['content'][:50]}\")
"
    exit 0
fi

# Validate required args
if [[ -z "$PLATFORM" || -z "$CONTENT" || -z "$SCHEDULED_AT" ]]; then
    echo "Error: --platform, --content, and --at are required." >&2
    echo "Run with --help for usage." >&2
    exit 1
fi

# Build JSON payload
PAYLOAD=$(python3 -c "
import json, sys
p = {
    'platform':     sys.argv[1],
    'content':      sys.argv[2],
    'scheduled_at': sys.argv[3],
}
if sys.argv[4]:
    p['media_url'] = sys.argv[4]
print(json.dumps(p))
" "$PLATFORM" "$CONTENT" "$SCHEDULED_AT" "$MEDIA_URL")

# POST to API
RESPONSE=$(curl -sf -w '\n%{http_code}' \
    -H "Authorization: Bearer $SECRET" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$ENDPOINT")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [[ "$HTTP_CODE" == "201" ]]; then
    ID=$(echo "$BODY" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['id'])")
    AT=$(echo "$BODY" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['scheduled_at'])")
    echo "✅ Scheduled post #$ID on $PLATFORM for $AT"
else
    echo "Error ($HTTP_CODE): $BODY" >&2
    exit 1
fi
