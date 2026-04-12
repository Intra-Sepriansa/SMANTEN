<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolValueStatement extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_profile_id',
        'key',
        'label',
        'value_text',
        'description',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function schoolProfile(): BelongsTo
    {
        return $this->belongsTo(SchoolProfile::class);
    }
}
