<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumni_forum_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_profile_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->unsignedSmallInteger('graduation_year');
            $table->string('category'); // cerita, karir, kampus, inspirasi
            $table->string('title');
            $table->text('body');
            $table->string('institution_name')->nullable();
            $table->string('occupation_title')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('contact_email')->nullable();
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('views_count')->default(0);
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_approved', 'created_at']);
            $table->index('category');
            $table->index('graduation_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni_forum_posts');
    }
};
