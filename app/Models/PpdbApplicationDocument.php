<?php

namespace App\Models;

use App\Enums\PpdbDocumentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpdbApplicationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'ppdb_application_id',
        'verified_by_user_id',
        'document_type',
        'original_name',
        'disk',
        'path',
        'mime_type',
        'size_bytes',
        'status',
        'verified_at',
        'rejection_reason',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
            'status' => PpdbDocumentStatus::class,
            'verified_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(PpdbApplication::class, 'ppdb_application_id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }
}
