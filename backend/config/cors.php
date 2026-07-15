<?php

return [

    'paths' => ['api/*', 'login', 'logout'],

    'allowed_methods' => ['*'],

    // Origens vêm do ambiente (FRONTEND_URL). Aceita várias separadas por vírgula,
    // ex.: "https://enlace.vercel.app,http://localhost:5173".
    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('FRONTEND_URL', 'http://localhost:5173'))
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Necessário para o cookie de sessão viajar entre front e back.
    'supports_credentials' => true,

];
