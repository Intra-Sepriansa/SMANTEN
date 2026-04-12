<?php

namespace App\Services;

use App\Enums\TimetableVersionStatus;
use App\Models\TimetableVersion;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TimetablePublishingService
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function publish(TimetableVersion $version, User $actor): TimetableVersion
    {
        if (! $version->entries()->exists()) {
            throw ValidationException::withMessages([
                'entries' => 'Cannot publish an empty timetable version.',
            ]);
        }

        return DB::transaction(function () use ($version, $actor) {
            TimetableVersion::query()
                ->where('academic_term_id', $version->academic_term_id)
                ->whereKeyNot($version->getKey())
                ->where('status', TimetableVersionStatus::Published->value)
                ->update(['status' => TimetableVersionStatus::Archived->value]);

            $version->forceFill([
                'status' => TimetableVersionStatus::Published,
                'published_at' => now(),
                'published_by_user_id' => $actor->getKey(),
            ])->save();

            $this->activityLogService->log(
                $actor,
                $version,
                'timetable.published',
                'Timetable version published.',
                ['academic_term_id' => $version->academic_term_id],
            );

            return $version->fresh();
        });
    }
}
