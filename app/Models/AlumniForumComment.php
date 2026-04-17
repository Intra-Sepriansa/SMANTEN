<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniForumComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumni_forum_post_id',
        'author_name',
        'contact_email',
        'body',
        'moderation_status',
        'spam_score',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'spam_score' => 'integer',
            'metadata' => 'array',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(AlumniForumPost::class, 'alumni_forum_post_id');
    }
}
