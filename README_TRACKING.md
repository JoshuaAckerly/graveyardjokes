Visitor tracking notification deduplication
=========================================

This project sends an email notification when a new visitor is tracked by the
site. To avoid receiving repeated emails for the same visitor, the application
now caches a notification key (based on IP + User-Agent) and will only send
another email after a configured time-to-live (TTL).

Configuration
-------------

- Environment variable: TRACK_VISITOR_EMAIL_TTL
  - Description: Number of seconds to wait before re-notifying the same visitor
    (defaults to 86400 seconds = 24 hours).
  - Example: TRACK_VISITOR_EMAIL_TTL=3600  # 1 hour

Where it's implemented
----------------------

The logic is implemented in `app/Http/Controllers/VisitorController.php` and uses
Laravel's cache to store a key named `visitor_notification_sent_{hash}`.

Notes
-----
- The cache driver configured for your environment determines persistence. For
  long-running production deployments, use a persistent cache like Redis or
  Memcached instead of the file or array drivers.
