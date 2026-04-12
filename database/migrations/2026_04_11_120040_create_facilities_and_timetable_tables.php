<?php

use App\Enums\TimetableEntryStatus;
use App\Enums\TimetableVersionStatus;
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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('room_type');
            $table->string('campus_zone')->nullable();
            $table->unsignedTinyInteger('floor_level')->nullable();
            $table->unsignedSmallInteger('capacity')->nullable();
            $table->boolean('is_schedulable')->default(true);
            $table->boolean('supports_moving_class')->default(true);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['room_type', 'is_schedulable']);
        });

        Schema::create('timetable_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedTinyInteger('day_of_week');
            $table->unsignedTinyInteger('sequence');
            $table->time('starts_at');
            $table->time('ends_at');
            $table->boolean('is_break')->default(false);
            $table->timestamps();

            $table->unique(['academic_year_id', 'day_of_week', 'sequence']);
        });

        Schema::create('timetable_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_term_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('status')->default(TimetableVersionStatus::Draft->value);
            $table->date('effective_from')->nullable();
            $table->date('effective_until')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('published_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['academic_term_id', 'status']);
        });

        Schema::create('timetable_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('timetable_version_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teaching_group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('timetable_period_id')->constrained()->cascadeOnDelete();
            $table->foreignId('room_id')->constrained()->restrictOnDelete();
            $table->foreignId('subject_id')->constrained()->restrictOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->restrictOnDelete();
            $table->foreignId('original_entry_id')->nullable()->constrained('timetable_entries')->nullOnDelete();
            $table->string('status')->default(TimetableEntryStatus::Scheduled->value);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['timetable_version_id', 'teaching_group_id', 'timetable_period_id'], 'uq_timetable_group_period');
            $table->unique(['timetable_version_id', 'room_id', 'timetable_period_id'], 'uq_timetable_room_period');
            $table->unique(['timetable_version_id', 'employee_id', 'timetable_period_id'], 'uq_timetable_employee_period');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetable_entries');
        Schema::dropIfExists('timetable_versions');
        Schema::dropIfExists('timetable_periods');
        Schema::dropIfExists('rooms');
    }
};
