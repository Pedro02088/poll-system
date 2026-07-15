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
            'is_anonymous' => $request->boolean('is_anonymous'),
        ]);

        foreach ($request->options as $text) {
            $poll->options()->create(['text' => $text]);
        }

        return response()->json($poll->load('options'), 201);
    }

    public function show(Request $request, Poll $poll)
    {
        $poll->load('options', 'user:id,name')->loadCount('votes');

        $userVote = null;
        if ($request->user()) {
            $userVote = Vote::where('user_id', $request->user()->id)
                ->where('poll_id', $poll->id)
                ->first();
        } elseif ($poll->is_anonymous && $request->query('voter_token')) {
            $userVote = Vote::where('voter_token', $request->query('voter_token'))
                ->where('poll_id', $poll->id)
                ->first();
        }

        $data = $poll->toArray();
        $data['has_voted'] = $userVote !== null;
        $data['user_vote_option_id'] = $userVote?->option_id;

        return response()->json($data);
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
        $request->validate([
            'option_id' => ['required', 'exists:options,id'],
            'voter_token' => ['nullable', 'string', 'max:64'],
        ]);

        $usuario = $request->user();

        // Enquete não-anônima exige login. Anônima aceita visitante identificado por token.
        if (! $usuario && ! $poll->is_anonymous) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        if ($usuario) {
            $ja_votou = Vote::where('user_id', $usuario->id)
                ->where('poll_id', $poll->id)
                ->exists();
        } else {
            if (! $request->voter_token) {
                return response()->json(['message' => 'Identificação do votante ausente'], 422);
            }

            $ja_votou = Vote::where('voter_token', $request->voter_token)
                ->where('poll_id', $poll->id)
                ->exists();
        }

        if ($ja_votou) {
            return response()->json(['message' => 'Você já votou nesta enquete'], 422);
        }

        Vote::create([
            'user_id' => $usuario?->id,
            'voter_token' => $usuario ? null : $request->voter_token,
            'poll_id' => $poll->id,
            'option_id' => $request->option_id,
        ]);

        $poll->load('user');

        // Votante anônimo não tem e-mail: só o dono da enquete é notificado.
        if ($usuario) {
            $usuario->notify(new \App\Notifications\VoteConfirmation($poll->title));
        }
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