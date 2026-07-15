<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poll extends Model
{
    protected $fillable = ['user_id', 'title', 'description', 'expires_at', 'is_anonymous'];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'expires_at' => 'datetime',
    ];

    protected $appends = ['is_expired'];

    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function options()
    {
        return $this->hasMany(Option::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Um voto por pessoa. O votante é identificado pelo usuário logado ou,
     * em enquete anônima, pelo token guardado no navegador do visitante.
     */
    public function hasVoteFrom(?User $user, ?string $voterToken): bool
    {
        return $this->votes()
            ->when($user, fn ($q) => $q->where('user_id', $user->id))
            ->when(! $user, fn ($q) => $q->where('voter_token', $voterToken))
            ->exists();
    }

    /** Enquete anônima aceita voto de visitante; as demais exigem login. */
    public function aceitaVotoDe(?User $user): bool
    {
        return $user !== null || $this->is_anonymous;
    }

    /** Registra o voto do usuário logado ou do visitante anônimo. */
    public function registrarVoto(?User $user, ?string $voterToken, int $optionId): Vote
    {
        return $this->votes()->create([
            'user_id' => $user?->id,
            'voter_token' => $user ? null : $voterToken,
            'option_id' => $optionId,
        ]);
    }
}