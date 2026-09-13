<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'track-visit'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://graveyardjokes.test',
        'https://graveyardjokes.com',
        'http://graveyardjokes.test',
        'http://graveyardjokes.test:8000',
        'http://10.0.1.20:8000',
    ],

    'allowed_origins_patterns' => [
        '/^https?:\/\/.*\.graveyardjokes\.(com|test|local)(?::\d+)?$/',
        '/^http:\/\/10\.0\.1\.20(?::\d+)?$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
