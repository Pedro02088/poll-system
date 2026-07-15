<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePollRequest;
use App\Http\Requests\UpdatePollRequest;
use App\Http\Requests\VoteRequest;
use App\Models\Poll;
use App\Models\User;
use App\Models\Vote;
use App\Notifications\NewVoteReceived;
use App\Notifications\VoteConfirmation;
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

    public function update(UpdatePollRequest $request, Poll $poll)
    {
        $this->authorize('update', $poll);

        $poll->update([
            'title' => $request->title,
            'description' => $request->description,
            'expires_at' => $request->expires_at,
            'is_anonymous' => $request->boolean('is_anonymous'),
        ]);

        return response()->json($poll->load('options'));
    }

    public function destroy(Poll $poll)
    {
        $this->authorize('delete', $poll);

        $poll->delete();

        return response()->json(['message' => 'Enquete excluída']);
    }

    public function vote(VoteRequest $request, Poll $poll)
    {
        $usuario = $request->user();
        $token = $request->voter_token;

        if ($poll->is_expired) {
            return response()->json(['message' => 'Esta enquete já foi encerrada'], 422);
        }

        if (! $poll->aceitaVotoDe($usuario)) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        if (! $usuario && ! $token) {
            return response()->json(['message' => 'Identificação do votante ausente'], 422);
        }

        if ($poll->hasVoteFrom($usuario, $token)) {
            return response()->json(['message' => 'Você já votou nesta enquete'], 422);
        }

        $poll->registrarVoto($usuario, $token, $request->option_id);
        $this->notificarVoto($poll, $usuario);

        return response()->json(['message' => 'Voto registrado']);
    }

    /**
     * As notificações são enfileiradas (ShouldQueue) para não atrasar a resposta
     * do voto. O aviso ao dono sai com atraso porque provedores SMTP de teste
     * limitam envios por segundo e recusariam os dois e-mails em sequência.
     */
    private function notificarVoto(Poll $poll, ?User $votante): void
    {
        $poll->load('user');

        // Votante anônimo não tem e-mail: só o dono da enquete é notificado.
        if ($votante) {
            $votante->notify(new VoteConfirmation($poll->title));
        }

        $poll->user->notify(
            (new NewVoteReceived($poll->title))->delay(now()->addSeconds(3))
        );
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