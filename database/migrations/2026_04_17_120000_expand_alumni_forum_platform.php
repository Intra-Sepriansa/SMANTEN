<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('full_name');
            $table->boolean('is_open_to_mentor')->default(false)->after('is_public_profile');
            $table->boolean('has_hiring_info')->default(false)->after('is_open_to_mentor');
        });

        Schema::table('alumni_forum_posts', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title');
            $table->decimal('location_latitude', 10, 7)->nullable()->after('province');
            $table->decimal('location_longitude', 10, 7)->nullable()->after('location_latitude');
            $table->unsignedInteger('comments_count')->default(0)->after('views_count');
            $table->unsignedInteger('bookmarks_count')->default(0)->after('comments_count');
            $table->unsignedInteger('share_count')->default(0)->after('bookmarks_count');
            $table->unsignedInteger('reports_count')->default(0)->after('share_count');
            $table->string('moderation_status')->default('approved')->after('is_featured');
            $table->text('moderation_notes')->nullable()->after('moderation_status');
            $table->unsignedSmallInteger('spam_score')->default(0)->after('moderation_notes');
            $table->boolean('is_open_to_mentor')->default(false)->after('spam_score');
            $table->boolean('has_hiring_info')->default(false)->after('is_open_to_mentor');
            $table->timestamp('approved_at')->nullable()->after('has_hiring_info');
            $table->timestamp('last_interaction_at')->nullable()->after('approved_at');

            $table->index(['moderation_status', 'created_at']);
            $table->index(['location_latitude', 'location_longitude']);
        });

        Schema::create('alumni_forum_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_forum_post_id')->constrained()->cascadeOnDelete();
            $table->string('author_name');
            $table->string('contact_email')->nullable();
            $table->text('body');
            $table->string('moderation_status')->default('approved');
            $table->unsignedSmallInteger('spam_score')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['alumni_forum_post_id', 'created_at']);
            $table->index(['moderation_status', 'created_at']);
        });

        Schema::create('alumni_forum_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_forum_post_id')->constrained()->cascadeOnDelete();
            $table->string('reaction_type', 24);
            $table->string('visitor_token_hash', 64);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(
                ['alumni_forum_post_id', 'reaction_type', 'visitor_token_hash'],
                'alumni_forum_reactions_unique_reaction'
            );
            $table->index(['reaction_type', 'created_at']);
        });

        $this->backfillAlumniProfileSlugs();
        $this->backfillForumPostData();

        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->unique('slug');
        });

        Schema::table('alumni_forum_posts', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni_forum_reactions');
        Schema::dropIfExists('alumni_forum_comments');

        Schema::table('alumni_forum_posts', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropIndex(['moderation_status', 'created_at']);
            $table->dropIndex(['location_latitude', 'location_longitude']);
            $table->dropColumn([
                'slug',
                'location_latitude',
                'location_longitude',
                'comments_count',
                'bookmarks_count',
                'share_count',
                'reports_count',
                'moderation_status',
                'moderation_notes',
                'spam_score',
                'is_open_to_mentor',
                'has_hiring_info',
                'approved_at',
                'last_interaction_at',
            ]);
        });

        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn([
                'slug',
                'is_open_to_mentor',
                'has_hiring_info',
            ]);
        });
    }

    protected function backfillAlumniProfileSlugs(): void
    {
        $profiles = DB::table('alumni_profiles')
            ->select('id', 'full_name')
            ->orderBy('id')
            ->get();

        foreach ($profiles as $profile) {
            DB::table('alumni_profiles')
                ->where('id', $profile->id)
                ->update([
                    'slug' => $this->makeUniqueSlug(
                        table: 'alumni_profiles',
                        source: (string) $profile->full_name,
                        id: (int) $profile->id,
                    ),
                ]);
        }
    }

    protected function backfillForumPostData(): void
    {
        $posts = DB::table('alumni_forum_posts')
            ->select('id', 'title', 'metadata', 'created_at')
            ->orderBy('id')
            ->get();

        foreach ($posts as $post) {
            $metadata = is_string($post->metadata)
                ? json_decode($post->metadata, true)
                : $post->metadata;

            $metadata = is_array($metadata) ? $metadata : [];

            DB::table('alumni_forum_posts')
                ->where('id', $post->id)
                ->update([
                    'slug' => $this->makeUniqueSlug(
                        table: 'alumni_forum_posts',
                        source: (string) $post->title,
                        id: (int) $post->id,
                    ),
                    'location_latitude' => data_get($metadata, 'location.latitude'),
                    'location_longitude' => data_get($metadata, 'location.longitude'),
                    'approved_at' => $post->created_at,
                ]);
        }
    }

    protected function makeUniqueSlug(string $table, string $source, int $id): string
    {
        $base = Str::slug($source);

        if ($base === '') {
            $base = 'item-'.$id;
        }

        $slug = $base;
        $suffix = 2;

        while (
            DB::table($table)
                ->where('slug', $slug)
                ->where('id', '!=', $id)
                ->exists()
        ) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
};
