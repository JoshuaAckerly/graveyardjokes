<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Media / CDN configuration (merged from the studio app)
    |--------------------------------------------------------------------------
    |
    | S3 key prefixes and CloudFront settings used by the studio media features
    | (video logs, illustrations, gallery thumbnails).
    |
    */

    'cloudfront_domain' => env('CLOUDFRONT_DOMAIN'),

    'video_prefix' => env('VIDEO_LOGS_PREFIX', 'video-logs'),
    'image_prefix' => env('VIDEO_IMAGES_PREFIX', 'images/vlogs'),
    'illustrations_prefix' => env('ILLUSTRATIONS_PREFIX', 'images/illustrations'),

    'url_expires_minutes' => (int) env('VIDEO_URL_EXPIRES', 60),
    'url_expiry_tolerance_seconds' => (int) env('MEDIA_URL_EXPIRY_TOLERANCE', 300),

];
