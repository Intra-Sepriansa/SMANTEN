<?php

use App\Enums\TracerStudyStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alumni_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->foreignId('student_profile_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('graduation_year')->nullable();
            $table->string('full_name');
            $table->string('institution_name')->nullable();
            $table->string('occupation_title')->nullable();
            $table->string('career_cluster')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone', 32)->nullable();
            $table->text('bio')->nullable();
            $table->boolean('is_public_profile')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('tracer_study_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('verified_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default(TracerStudyStatus::Draft->value);
            $table->string('current_activity')->nullable();
            $table->string('institution_name')->nullable();
            $table->string('major')->nullable();
            $table->string('occupation_title')->nullable();
            $table->string('industry')->nullable();
            $table->string('location_city')->nullable();
            $table->string('location_province')->nullable();
            $table->date('started_at')->nullable();
            $table->string('monthly_income_range')->nullable();
            $table->text('reflections')->nullable();
            $table->boolean('is_publicly_displayable')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->nullableMorphs('subject');
            $table->string('event');
            $table->text('description')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('properties')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['event', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('tracer_study_responses');
        Schema::dropIfExists('alumni_profiles');
    }
};
