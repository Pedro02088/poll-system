<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePollRequest;
use App\Models\Poll;
use Illuminate\Http\Request;

class PollController extends Controller
{
    public function index()
    {
        return Poll::withCount('votes')->with('user:id,name')->latest()->get();
    }

    public function store(StorePollRequest $request)
    {
        $poll = Poll::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'expires_at' => $request->expires_at,
        ]);

        foreach ($request->options as $text) {
            $poll->options()->create(['text' => $text]);
        }

        return response()->json($poll->load('options'), 201);
    }

    public function show(Poll $poll)
    {
        return $poll->load('options', 'user:id,name')->loadCount('votes');
    }
}