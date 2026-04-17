<?php

namespace App\Services;

use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;

class AlumniProfileSyncService
{
    public function syncFromForumPost(AlumniForumPost $post): AlumniProfile
    {
        $profile = $post->alumniProfile;

        if ($profile === null) {
            $profile = AlumniProfile::query()
                ->when(
                    filled($post->contact_email),
                    fn ($query) => $query->where('contact_email', $post->contact_email),
                    fn ($query) => $query->where('full_name', $post->author_name)
                        ->where('graduation_year', $post->graduation_year),
                )
                ->first();
        }

        if ($profile === null) {
            $profile = new AlumniProfile;
        }

        $profile->fill([
            'full_name' => $post->author_name,
            'graduation_year' => $post->graduation_year,
            'institution_name' => $post->institution_name ?: $profile->institution_name,
            'occupation_title' => $post->occupation_title ?: $profile->occupation_title,
            'city' => $post->city ?: $profile->city,
            'province' => $post->province ?: $profile->province,
            'contact_email' => $post->contact_email ?: $profile->contact_email,
            'is_public_profile' => true,
            'is_open_to_mentor' => $profile->is_open_to_mentor || $post->is_open_to_mentor,
            'has_hiring_info' => $profile->has_hiring_info || $post->has_hiring_info,
            'metadata' => [
                ...($profile->metadata ?? []),
                'last_forum_post_id' => $post->id,
            ],
        ]);

        if (! filled($profile->bio) && filled($post->body)) {
            $profile->bio = mb_substr($post->body, 0, 280);
        }

        $profile->save();

        if ($post->alumni_profile_id !== $profile->id) {
            $post->alumniProfile()->associate($profile);
            $post->saveQuietly();
        }

        return $profile;
    }
}
