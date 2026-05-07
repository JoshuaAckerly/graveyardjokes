<?php

return [

    'discord' => [
        'webhook_url' => env('DISCORD_WEBHOOK_URL'),
    ],

    'twitter' => [
        'api_key' => env('TWITTER_API_KEY'),
        'api_secret' => env('TWITTER_API_SECRET'),
        'access_token' => env('TWITTER_ACCESS_TOKEN'),
        'access_secret' => env('TWITTER_ACCESS_SECRET'),
    ],

    'facebook' => [
        'page_id' => env('FACEBOOK_PAGE_ID'),
        'access_token' => env('FACEBOOK_PAGE_ACCESS_TOKEN'),
    ],

    'instagram' => [
        'user_id' => env('INSTAGRAM_USER_ID'),
        'access_token' => env('INSTAGRAM_ACCESS_TOKEN'),
    ],

];
