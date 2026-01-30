<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Hello World',
        'app' => 'Users API',
        'version' => '1.0.0'
    ]);
});
