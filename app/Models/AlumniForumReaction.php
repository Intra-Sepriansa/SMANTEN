<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniForumReaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumni_forum_post_id',
        'reaction_type',
        'visitor_token_hash',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(AlumniForumPost::class, 'alumni_forum_post_id');
    }
}
