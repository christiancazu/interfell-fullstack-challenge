#!/usr/bin/env php
<?php

require __DIR__.'/vendor/autoload.php';

// Priority: .env first, then .env.local as fallback
if (file_exists(__DIR__.'/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '.env');
    $dotenv->load();
} elseif (file_exists(__DIR__.'/.env.local')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '.env.local');
    $dotenv->load();
} else {
    echo "Error: Neither .env nor .env.local found\n";
    exit(1);
}

$port = getenv('MS_USERS_PORT') ?: 5001;

echo "Starting Laravel Users API on port $port...\n";
passthru("php artisan serve --port=$port");
