<?php

use App\Enums\PpdbApplicationStatus;
use App\Enums\PpdbDocumentStatus;
use App\Enums\PpdbTrackType;
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
        Schema::create('ppdb_cycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('status')->default('draft');
            $table->unsignedInteger('capacity')->nullable();
            $table->decimal('school_latitude', 10, 7)->nullable();
            $table->decimal('school_longitude', 10, 7)->nullable();
            $table->decimal('default_zone_radius_km', 8, 2)->nullable();
            $table->timestamp('application_opens_at')->nullable();
            $table->timestamp('application_closes_at')->nullable();
            $table->timestamp('announcement_at')->nullable();
            $table->json('rules_snapshot')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('ppdb_track_quotas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_cycle_id')->constrained()->cascadeOnDelete();
            $table->string('track_type')->default(PpdbTrackType::Zonasi->value);
            $table->decimal('quota_percentage', 5, 2)->nullable();
            $table->unsignedInteger('quota_seats')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['ppdb_cycle_id', 'track_type']);
        });

        Schema::create('ppdb_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_cycle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('verified_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('registration_number')->unique();
            $table->string('track_type')->default(PpdbTrackType::Zonasi->value);
            $table->string('status')->default(PpdbApplicationStatus::Draft->value);
            $table->string('full_name');
            $table->date('birth_date')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('nisn')->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('email')->nullable();
            $table->string('previous_school_name')->nullable();
            $table->text('address_line')->nullable();
            $table->string('village')->nullable();
            $table->string('district')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code', 12)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('distance_meters', 10, 2)->nullable();
            $table->timestamp('distance_calculated_at')->nullable();
            $table->boolean('ketm_flag')->default(false);
            $table->boolean('special_condition_flag')->default(false);
            $table->text('achievements_summary')->nullable();
            $table->json('submission_payload')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->text('decision_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['ppdb_cycle_id', 'track_type', 'status']);
            $table->index(['latitude', 'longitude']);
        });

        Schema::create('ppdb_application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('verified_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('document_type');
            $table->string('original_name');
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('mime_type', 128)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('status')->default(PpdbDocumentStatus::Pending->value);
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['ppdb_application_id', 'document_type'], 'idx_ppdb_docs_app_id_type');
        });

        Schema::create('ppdb_application_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewer_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('review_type');
            $table->string('status');
            $table->text('notes')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();

            $table->index(['ppdb_application_id', 'status']);
        });

        Schema::create('ppdb_distance_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('calculated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('origin_latitude', 10, 7);
            $table->decimal('origin_longitude', 10, 7);
            $table->decimal('school_latitude', 10, 7);
            $table->decimal('school_longitude', 10, 7);
            $table->decimal('distance_meters', 10, 2);
            $table->string('formula_version')->default('haversine:v1');
            $table->timestamp('calculated_at');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_distance_audits');
        Schema::dropIfExists('ppdb_application_reviews');
        Schema::dropIfExists('ppdb_application_documents');
        Schema::dropIfExists('ppdb_applications');
        Schema::dropIfExists('ppdb_track_quotas');
        Schema::dropIfExists('ppdb_cycles');
    }
};
