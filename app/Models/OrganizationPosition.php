<?php

namespace App\Models;

use App\Enums\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrganizationPosition extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_unit_id',
        'scope',
        'title',
        'slug',
        'hierarchy_level',
        'is_unique_holder',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'scope' => OrganizationScope::class,
            'hierarchy_level' => 'integer',
            'is_unique_holder' => 'boolean',
        ];
    }

    public function organizationUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationUnit::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(OrganizationAssignment::class);
    }
}
