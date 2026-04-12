<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\OrganizationAssignment;
use App\Models\PortfolioItem;
use App\Models\PpdbApplication;
use App\Models\Room;
use App\Models\TimetableVersion;
use App\Models\User;
use App\Policies\ArticlePolicy;
use App\Policies\OrganizationAssignmentPolicy;
use App\Policies\PortfolioItemPolicy;
use App\Policies\PpdbApplicationPolicy;
use App\Policies\RoomPolicy;
use App\Policies\TimetableVersionPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Article::class => ArticlePolicy::class,
        OrganizationAssignment::class => OrganizationAssignmentPolicy::class,
        PortfolioItem::class => PortfolioItemPolicy::class,
        PpdbApplication::class => PpdbApplicationPolicy::class,
        Room::class => RoomPolicy::class,
        TimetableVersion::class => TimetableVersionPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::before(function (User $user) {
            return $user->hasRole('super_admin') ? true : null;
        });
    }
}
