<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\TracerStudyStatus;
use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use App\Models\TracerStudyResponse;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TracerStudyController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:120'],
            'graduation_year' => ['required', 'integer', 'min:1990', 'max:'.(date('Y') + 1)],
            'contact_email' => ['nullable', 'email', 'max:120'],
            'contact_phone' => ['nullable', 'string', 'max:32'],
            'current_activity' => ['required', 'string', Rule::in([
                'kuliah',
                'bekerja',
                'wirausaha',
                'mencari_kerja',
                'gap_year',
                'lainnya',
            ])],
            'institution_name' => ['nullable', 'string', 'max:150'],
            'major' => ['nullable', 'string', 'max:150'],
            'occupation_title' => ['nullable', 'string', 'max:150'],
            'industry' => ['nullable', 'string', 'max:120'],
            'location_city' => ['nullable', 'string', 'max:100'],
            'location_province' => ['nullable', 'string', 'max:100'],
            'started_at' => ['nullable', 'date'],
            'monthly_income_range' => ['nullable', 'string', 'max:80'],
            'reflections' => ['nullable', 'string', 'max:2000'],
            'is_publicly_displayable' => ['nullable', 'boolean'],
        ]);

        $submission = DB::transaction(function () use ($request, $validated): TracerStudyResponse {
            $profile = $this->resolveProfile($validated);
            $isPublic = (bool) ($validated['is_publicly_displayable'] ?? false);

            $profile->fill([
                'graduation_year' => $validated['graduation_year'],
                'full_name' => $validated['full_name'],
                'institution_name' => $validated['institution_name'] ?? $profile->institution_name,
                'occupation_title' => $validated['occupation_title'] ?? $profile->occupation_title,
                'career_cluster' => $validated['current_activity'],
                'city' => $validated['location_city'] ?? $profile->city,
                'province' => $validated['location_province'] ?? $profile->province,
                'contact_email' => $validated['contact_email'] ?? $profile->contact_email,
                'contact_phone' => $validated['contact_phone'] ?? $profile->contact_phone,
                'is_public_profile' => $isPublic,
                'metadata' => [
                    ...($profile->metadata ?? []),
                    'claim_status' => 'pending_review',
                    'last_tracer_submitted_at' => now()->toIso8601String(),
                ],
            ])->save();

            $response = $profile->tracerStudyResponses()->create([
                'status' => TracerStudyStatus::Submitted,
                'current_activity' => $validated['current_activity'],
                'institution_name' => $validated['institution_name'] ?? null,
                'major' => $validated['major'] ?? null,
                'occupation_title' => $validated['occupation_title'] ?? null,
                'industry' => $validated['industry'] ?? null,
                'location_city' => $validated['location_city'] ?? null,
                'location_province' => $validated['location_province'] ?? null,
                'started_at' => $validated['started_at'] ?? null,
                'monthly_income_range' => $validated['monthly_income_range'] ?? null,
                'reflections' => $validated['reflections'] ?? null,
                'is_publicly_displayable' => $isPublic,
                'submitted_at' => now(),
                'metadata' => [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'claim_status' => 'pending_review',
                ],
            ]);

            $this->activityLogService->log(
                null,
                $response,
                'tracer_study.submitted',
                'Tracer study alumni submitted.',
                [
                    'alumni_profile_id' => $profile->id,
                    'graduation_year' => $profile->graduation_year,
                    'current_activity' => $validated['current_activity'],
                ],
            );

            return $response;
        });

        return response()->json([
            'message' => 'Tracer study berhasil dikirim dan menunggu validasi admin.',
            'data' => [
                'id' => $submission->id,
                'status' => $submission->status?->value,
                'alumniProfileId' => $submission->alumni_profile_id,
            ],
        ], 201);
    }

    private function resolveProfile(array $validated): AlumniProfile
    {
        $query = AlumniProfile::query();

        if (! empty($validated['contact_email'])) {
            $query->where('contact_email', $validated['contact_email']);
        } else {
            $query
                ->where('full_name', $validated['full_name'])
                ->where('graduation_year', $validated['graduation_year']);
        }

        return $query->first() ?? new AlumniProfile;
    }
}
