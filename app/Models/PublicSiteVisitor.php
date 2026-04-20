<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicSiteVisitor extends Model
{
    protected $fillable = [
        'visitor_token_hash',
        'first_seen_at',
        'last_seen_at',
        'last_path',
        'last_route_name',
        'ip_address',
        'user_agent',
        'page_views',
    ];

    protected function casts(): array
    {
        return [
            'first_seen_at' => 'datetime',
            'last_seen_at' => 'datetime',
            'page_views' => 'integer',
        ];
    }
}
