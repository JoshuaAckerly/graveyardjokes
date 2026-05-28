<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'paypal' => [
        'environment' => env('PAYPAL_ENVIRONMENT', 'sandbox'),
        'client_id' => env('PAYPAL_CLIENT_ID'),
        'sandbox_client_id' => env('PAYPAL_SANDBOX_CLIENT_ID'),
    ],

    'google_analytics' => [
        'tracking_id' => env('GOOGLE_ANALYTICS_TRACKING_ID'),
    ],

    'google_adsense' => [
        'client_id' => env('GOOGLE_ADSENSE_CLIENT_ID'),
    ],

    'visitor_tracking' => [
        'notification_ttl' => (int) env('VISITOR_NOTIFICATION_TTL', 300),
    ],

    'auth_system' => [
        'url' => env('AUTH_SYSTEM_URL', 'http://auth-system.local/api'),
    ],

    'authsystem' => [
        'track_url' => env('AUTHSYSTEM_TRACK_URL'),
        'track_token' => env('AUTHSYSTEM_TRACK_TOKEN'),
    ],

    'google_business' => [
        'client_id' => env('GOOGLE_BUSINESS_CLIENT_ID'),
        'client_secret' => env('GOOGLE_BUSINESS_CLIENT_SECRET'),
        'refresh_token' => env('GOOGLE_BUSINESS_REFRESH_TOKEN'),
        'location_name' => env('GOOGLE_BUSINESS_LOCATION_NAME'),
    ],

    'google_places' => [
        'api_key' => env('GOOGLE_PLACES_API_KEY'),
        'place_id' => env('GOOGLE_PLACES_PLACE_ID'),
    ],

    'facebook' => [
        'app_id' => env('FACEBOOK_APP_ID'),
        'app_secret' => env('FACEBOOK_APP_SECRET'),
    ],

];
