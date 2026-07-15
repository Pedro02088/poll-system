<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PollController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// --- Públicas ---
Route::get('/polls', [PollController::class, 'index']);
Route::get('/polls/{poll}', [PollController::class, 'show']);
Route::get('/polls/{poll}/stream', [PollController::class, 'stream']);

// Voto fica fora do 'auth': enquete anônima aceita visitante. O controller
// devolve 401 quando a enquete não é anônima e não há sessão.
Route::post('/polls/{poll}/vote', [PollController::class, 'vote'])
    ->middleware('throttle:10,1');

// --- Exigem autenticação ---
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn (Illuminate\Http\Request $request) => $request->user());
    Route::get('/my-votes', [PollController::class, 'myVotes']);
    Route::post('/polls', [PollController::class, 'store']);
    Route::put('/polls/{poll}', [PollController::class, 'update']);
    Route::delete('/polls/{poll}', [PollController::class, 'destroy']);
});