<?php

use App\Enums\UserStatus;
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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->string('phone', 32)->nullable()->after('email');
            $table->string('status')->default(UserStatus::Pending->value)->after('password');
            $table->timestamp('password_changed_at')->nullable()->after('status');
            $table->timestamp('last_login_at')->nullable()->after('password_changed_at');
            $table->timestamp('last_seen_at')->nullable()->after('last_login_at');
            $table->softDeletes();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropSoftDeletes();
            $table->dropColumn([
                'username',
                'phone',
                'status',
                'password_changed_at',
                'last_login_at',
                'last_seen_at',
            ]);
        });
    }
};
