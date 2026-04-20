<?php

use App\Models\AlumniProfile;
use App\Models\TracerStudyResponse;

use function Pest\Laravel\postJson;

it('accepts public tracer study submissions and creates alumni workflow records', function () {
    postJson(route('api.public.tracer-study.store'), [
        'full_name' => 'Alumni Tracer',
        'graduation_year' => 2021,
        'contact_email' => 'alumni.tracer@example.test',
        'current_activity' => 'bekerja',
        'institution_name' => 'PT Masa Depan',
        'occupation_title' => 'Web Developer',
        'industry' => 'Teknologi',
        'location_city' => 'Bogor',
        'location_province' => 'Jawa Barat',
        'is_publicly_displayable' => true,
    ])
        ->assertCreated()
        ->assertJsonPath('data.status', 'submitted');

    expect(AlumniProfile::query()->where('contact_email', 'alumni.tracer@example.test')->exists())->toBeTrue()
        ->and(TracerStudyResponse::query()->where('current_activity', 'bekerja')->exists())->toBeTrue();
});
