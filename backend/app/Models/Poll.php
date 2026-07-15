<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poll extends Model
{
    protected $fillable = ['user_id', 'title', 'description', 'expires_at', 'is_anonymous'];

    protected $casts = ['is_anonymous' => 'boolean'];

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