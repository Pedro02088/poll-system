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
}