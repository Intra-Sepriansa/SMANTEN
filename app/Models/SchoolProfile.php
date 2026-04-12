<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'official_name',
        'npsn',
        'accreditation',
        'establishment_decree_number',
        'established_at',
        'curriculum_name',
        'study_schedule_type',
        'bank_name',
        'bank_branch',
        'bank_account_name',
        'bank_account_number',
        'email',
        'phone',
        'website_url',
        'street_address',
        'rt',
        'rw',
        'hamlet',
        'village',
        'district',
        'city',
        'province',
        'postal_code',
        'latitude',
        'longitude',
        'land_area_square_meters',
        'principal_name',
        'operator_name',
        'timezone',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'established_at' => 'date',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'land_area_square_meters' => 'decimal:2',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function valueStatements(): HasMany
    {
        return $this->hasMany(SchoolValueStatement::class);
    }
}
