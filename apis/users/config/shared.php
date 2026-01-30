<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Shared Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration loaded from the shared package config.json
    | This is cached by Laravel for optimal performance.
    |
    */

    'fields' => function () {
        $configPath = base_path('../../packages/shared/config.json');

        if (!file_exists($configPath)) {
            throw new \RuntimeException("Shared config file not found at: {$configPath}");
        }

        $config = json_decode(file_get_contents($configPath), true);

        return $config['FIELDS'] ?? [];
    },
];
