<?php

use App\Enums\AcademicTermType;
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
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('official_name')->nullable();
            $table->string('npsn')->unique();
            $table->string('accreditation', 10)->nullable();
            $table->string('establishment_decree_number')->nullable();
            $table->date('established_at')->nullable();
            $table->string('curriculum_name')->nullable();
            $table->string('study_schedule_type')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_branch')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('website_url')->nullable();
            $table->string('street_address')->nullable();
            $table->string('rt', 10)->nullable();
            $table->string('rw', 10)->nullable();
            $table->string('hamlet')->nullable();
            $table->string('village')->nullable();
            $table->string('district')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code', 12)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('land_area_square_meters', 12, 2)->nullable();
            $table->string('principal_name')->nullable();
            $table->string('operator_name')->nullable();
            $table->string('timezone')->default('Asia/Jakarta');
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('school_value_statements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_profile_id')->constrained()->cascadeOnDelete();
            $table->string('key');
            $table->string('label');
            $table->text('value_text');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['school_profile_id', 'key']);
        });

        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('starts_on');
            $table->date('ends_on');
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->unique(['starts_on', 'ends_on']);
        });

        Schema::create('academic_terms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('term_type')->default(AcademicTermType::Odd->value);
            $table->date('starts_on');
            $table->date('ends_on');
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->unique(['academic_year_id', 'term_type']);
        });

        Schema::create('grade_levels', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('grade_number');
            $table->string('label');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['grade_number']);
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('curriculum_category')->nullable();
            $table->unsignedTinyInteger('weekly_periods')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('grade_levels');
        Schema::dropIfExists('academic_terms');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('school_value_statements');
        Schema::dropIfExists('school_profiles');
    }
};
