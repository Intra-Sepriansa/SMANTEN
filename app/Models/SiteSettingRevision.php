<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteSettingRevision extends Model
{
    protected $fillable = [
        'site_setting_id',
        'user_id',
        'version',
        'value',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'value' => 'array',
        ];
    }

    public function siteSetting(): BelongsTo
    {
        return $this->belongsTo(SiteSetting::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
