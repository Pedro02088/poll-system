<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/me', function (Illuminate\Http\Request $request) {
    if (! $request->user()) {
        return response()->json(['message' => 'Não autenticado'], 401);
    }
    return $request->user();
});