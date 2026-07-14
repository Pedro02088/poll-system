<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePollRequest;
use App\Models\Poll;
use App\Models\Vote;
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

    public function update(StorePollRequest $request, Poll $poll)
    {
        $this->authorize('update', $poll);

        $poll->update($request->only('title', 'description', 'expires_at'));

        return response()->json($poll->load('options'));
    }

    public function destroy(Poll $poll)
    {
        $this->authorize('delete', $poll);

        $poll->delete();

        return response()->json(['message' => 'Enquete excluída']);
    }

    public function vote(Request $request, Poll $poll)
    {
        $request->validate(['option_id' => ['required', 'exists:options,id']]);

        $ja_votou = Vote::where('user_id', $request->user()->id)
            ->where('poll_id', $poll->id)
            ->exists();

        if ($ja_votou) {
            return response()->json(['message' => 'Você já votou nesta enquete'], 422);
        }

        Vote::create([
            'user_id' => $request->user()->id,
            'poll_id' => $poll->id,
            'option_id' => $request->option_id,
        ]);

        $poll->load('user');

        $request->user()->notify(new \App\Notifications\VoteConfirmation($poll->title));
        $poll->user->notify((new \App\Notifications\NewVoteReceived($poll->title))->delay(now()->addSeconds(3)));

        return response()->json(['message' => 'Voto registrado']);
    }

    public function myVotes(Request $request)
    {
        return Vote::where('user_id', $request->user()->id)
            ->with('poll:id,title')
            ->latest()
            ->get()
            ->map(fn ($v) => [
                'poll_id' => $v->poll_id,
                'poll_title' => $v->poll?->title,
                'voted_at' => $v->created_at,
            ]);
    }

    public function stream(Poll $poll)
    {
        return response()->stream(function () use ($poll) {
            $resultados = $poll->options()
                ->withCount('votes')
                ->get(['id', 'text'])
                ->map(fn ($o) => [
                    'id' => $o->id,
                    'text' => $o->text,
                    'votes' => $o->votes_count,
                ]);

            echo 'retry: 1000' . "\n";
            echo 'data: ' . json_encode($resultados) . "\n\n";

            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}