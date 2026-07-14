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

Route::get('/my-votes', [PollController::class, 'myVotes']);
Route::get('/polls', [PollController::class, 'index']);
Route::get('/polls/{poll}', [PollController::class, 'show']);
Route::post('/polls', [PollController::class, 'store']);
Route::put('/polls/{poll}', [PollController::class, 'update']);
Route::delete('/polls/{poll}', [PollController::class, 'destroy']);
Route::post('/polls/{poll}/vote', [PollController::class, 'vote'])
    ->middleware('throttle:10,1');
Route::get('/polls/{poll}/stream', [PollController::class, 'stream']);