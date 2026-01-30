<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Shared configuration provider
 *
 * Loads shared configuration from the monorepo packages/shared
 * and caches it for optimal performance.
 */
class SharedConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Load shared config once at boot time
        $this->app->singleton('shared.fields', function () {
            $configPath = base_path('../../packages/shared/config.json');

            if (!file_exists($configPath)) {
                throw new \RuntimeException("Shared config file not found at: {$configPath}");
            }

            $config = json_decode(file_get_contents($configPath), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException("Invalid JSON in shared config: " . json_last_error_msg());
            }

            return $config['FIELDS'] ?? [];
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
