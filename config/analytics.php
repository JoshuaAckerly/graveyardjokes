<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Analytics — excluded IPs
    |--------------------------------------------------------------------------
    |
    | Visits from these IPs are filtered out of the "human" analytics scope
    | (e.g. your own IP). Comma-separated in ANALYTICS_EXCLUDED_IPS.
    |
    */

    'excluded_ips' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('ANALYTICS_EXCLUDED_IPS', ''))
    ))),

];
