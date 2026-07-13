<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PollController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/me', function (Illuminate\Http\Request $request) {
    if (! $request->user()) {
        return response()->json(['message' => 'Não autenticado'], 401);
    }
    return $request->user();
});

Route::get('/polls', [PollController::class, 'index']);
Route::get('/polls/{poll}', [PollController::class, 'show']);
Route::post('/polls', [PollController::class, 'store']);