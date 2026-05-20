-- ============================================================
-- Fix: Remove duplicate social_scheduled_posts rows
-- Run once in production to clear the triple-post bug.
--
-- What this does:
--   1. Shows you every duplicate group before deleting (verify first)
--   2. Keeps the lowest id (earliest inserted) for each unique
--      (platform, content, scheduled_at) combination
--   3. Deletes the higher-id duplicates
-- ============================================================

-- STEP 1: Preview duplicates (run this first, confirm before Step 2)
SELECT
    platform,
    LEFT(content, 80) AS content_preview,
    scheduled_at,
    COUNT(*) AS duplicate_count,
    MIN(id) AS keep_id,
    GROUP_CONCAT(id ORDER BY id) AS all_ids
FROM social_scheduled_posts
WHERE status = 'pending'
GROUP BY platform, content, scheduled_at
HAVING COUNT(*) > 1;

-- ============================================================
-- STEP 2: Delete duplicates — keeps the lowest id per group.
-- Only run after confirming Step 1 shows the expected rows.
-- ============================================================
DELETE ssp
FROM social_scheduled_posts ssp
INNER JOIN (
    SELECT MIN(id) AS keep_id, platform, content, scheduled_at
    FROM social_scheduled_posts
    WHERE status = 'pending'
    GROUP BY platform, content, scheduled_at
    HAVING COUNT(*) > 1
) AS dupes
    ON ssp.platform  = dupes.platform
   AND ssp.content   = dupes.content
   AND ssp.scheduled_at = dupes.scheduled_at
   AND ssp.id != dupes.keep_id
   AND ssp.status = 'pending';

-- STEP 3: Verify — should return 0 rows
SELECT platform, LEFT(content, 80), scheduled_at, COUNT(*)
FROM social_scheduled_posts
WHERE status = 'pending'
GROUP BY platform, content, scheduled_at
HAVING COUNT(*) > 1;
