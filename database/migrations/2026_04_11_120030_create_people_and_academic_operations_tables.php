<?php

use App\Enums\EmployeeType;
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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('employee_number')->nullable()->unique();
            $table->string('full_name');
            $table->string('employee_type')->default(EmployeeType::Teacher->value);
            $table->string('gender', 20)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->date('joined_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['employee_type', 'is_active']);
        });

        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('nis')->nullable()->unique();
            $table->string('nisn')->nullable()->unique();
            $table->string('full_name');
            $table->string('gender', 20)->nullable();
            $table->date('birth_date')->nullable();
            $table->text('address')->nullable();
            $table->string('village')->nullable();
            $table->string('district')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code', 12)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('enrollment_status')->default('active');
            $table->date('admitted_at')->nullable();
            $table->date('graduated_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('enrollment_status');
        });

        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('national_id')->nullable()->unique();
            $table->string('full_name');
            $table->string('relation_type')->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('email')->nullable();
            $table->string('occupation')->nullable();
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('student_guardian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guardian_id')->constrained()->cascadeOnDelete();
            $table->string('relationship_type')->nullable();
            $table->boolean('is_primary_contact')->default(false);
            $table->boolean('is_financial_guardian')->default(false);
            $table->timestamps();

            $table->unique(['student_profile_id', 'guardian_id']);
        });

        Schema::create('teaching_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grade_level_id')->constrained()->restrictOnDelete();
            $table->foreignId('homeroom_employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('code');
            $table->string('name');
            $table->unsignedSmallInteger('capacity')->default(36);
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['academic_year_id', 'code']);
            $table->unique(['academic_year_id', 'name']);
        });

        Schema::create('student_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_term_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('teaching_group_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('roll_number')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['student_profile_id', 'academic_year_id']);
            $table->unique(['teaching_group_id', 'roll_number']);
            $table->index('status');
        });

        Schema::create('employee_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->unique(['employee_id', 'subject_id', 'academic_year_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_subject');
        Schema::dropIfExists('student_enrollments');
        Schema::dropIfExists('teaching_groups');
        Schema::dropIfExists('student_guardian');
        Schema::dropIfExists('guardians');
        Schema::dropIfExists('student_profiles');
        Schema::dropIfExists('employees');
    }
};
