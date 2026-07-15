<?php

namespace App\Policies;

use App\Models\Poll;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PollPolicy
{
    /**
     * Só o criador edita a enquete.
     *
     * Retorna Response em vez de bool para que a mensagem do 403 seja a nossa,
     * em português — o padrão do Laravel responderia "This action is unauthorized.".
     */
    public function update(User $user, Poll $poll): Response
    {
        return $user->id === $poll->user_id
            ? Response::allow()
            : Response::deny('Apenas quem criou a enquete pode editá-la.');
    }

    /** Só o criador exclui a enquete. */
    public function delete(User $user, Poll $poll): Response
    {
        return $user->id === $poll->user_id
            ? Response::allow()
            : Response::deny('Apenas quem criou a enquete pode excluí-la.');
    }
}
