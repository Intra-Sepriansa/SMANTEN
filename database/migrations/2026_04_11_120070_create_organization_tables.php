<?php

use App\Enums\OrganizationAssignmentStatus;
use App\Enums\OrganizationScope;
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
        Schema::create('organization_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('organization_units')->nullOnDelete();
            $table->string('scope')->default(OrganizationScope::SchoolManagement->value);
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('organization_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_unit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('scope')->default(OrganizationScope::SchoolManagement->value);
            $table->string('title');
            $table->string('slug')->unique();
            $table->unsignedSmallInteger('hierarchy_level')->default(0);
            $table->boolean('is_unique_holder')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_unit_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('organization_position_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('student_profile_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name_snapshot');
            $table->string('status')->default(OrganizationAssignmentStatus::Planned->value);
            $table->boolean('is_current')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->text('biography')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['organization_position_id', 'status', 'is_current']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_assignments');
        Schema::dropIfExists('organization_positions');
        Schema::dropIfExists('organization_units');
    }
};
