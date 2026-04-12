<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityLogService
{
    public function log(
        User|int|null $user,
        Model|null $subject,
        string $event,
        ?string $description = null,
        array $properties = [],
    ): ActivityLog {
        $request = request();

        return ActivityLog::create([
            'user_id' => $user instanceof User ? $user->getKey() : $user,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'event' => $event,
            'description' => $description,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'properties' => $properties,
            'created_at' => now(),
        ]);
    }
}
