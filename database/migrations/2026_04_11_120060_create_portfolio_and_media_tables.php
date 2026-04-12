<?php

use App\Enums\PortfolioItemStatus;
use App\Enums\PortfolioVisibility;
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
        Schema::create('p5_themes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('p5_theme_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('mentor_employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->string('exhibition_name')->nullable();
            $table->date('event_date')->nullable();
            $table->text('description')->nullable();
            $table->string('visibility')->default(PortfolioVisibility::Internal->value);
            $table->boolean('is_featured')->default(false);
            $table->date('starts_on')->nullable();
            $table->date('ends_on')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('portfolio_project_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_profile_id')->constrained()->cascadeOnDelete();
            $table->string('member_role')->nullable();
            $table->boolean('is_lead')->default(false);
            $table->timestamps();

            $table->unique(['portfolio_project_id', 'student_profile_id']);
        });

        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('creator_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('item_type')->nullable();
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->string('status')->default(PortfolioItemStatus::Draft->value);
            $table->string('visibility')->default(PortfolioVisibility::Internal->value);
            $table->boolean('is_featured')->default(false);
            $table->decimal('price_estimate', 12, 2)->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'visibility']);
        });

        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('attachable');
            $table->foreignId('uploader_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('media_type');
            $table->string('disk')->default('public');
            $table->string('path')->nullable();
            $table->string('original_name')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('mime_type', 128)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('visibility')->default(PortfolioVisibility::Internal->value);
            $table->string('provider')->nullable();
            $table->string('provider_media_id')->nullable();
            $table->string('external_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_assets');
        Schema::dropIfExists('portfolio_items');
        Schema::dropIfExists('portfolio_project_members');
        Schema::dropIfExists('portfolio_projects');
        Schema::dropIfExists('p5_themes');
    }
};
