<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Load .env.local first (shared monorepo config)
if (file_exists(__DIR__.'/../.env.local')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../', '.env.local');
    $dotenv->safeLoad(); // safeLoad() won't override if .env is loaded after
}

// Then Laravel will load .env (if exists) which takes priority

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Remove web middleware from API - this is an API-only app
        $middleware->api(remove: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Force JSON responses for all exceptions (API-only app)
        $exceptions->shouldRenderJsonWhen(function () {
            return true;
        });
    })->create();
