<?php

namespace App\Providers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login as LoginEvent;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthEvents();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        RateLimiter::for('alumni-forum-store', function (Request $request) {
            return [
                Limit::perMinute(4)->by($request->ip()),
                Limit::perHour(18)->by($request->ip()),
            ];
        });

        RateLimiter::for('alumni-forum-comment', function (Request $request) {
            return [
                Limit::perMinute(8)->by($request->ip()),
                Limit::perHour(40)->by($request->ip()),
            ];
        });

        RateLimiter::for('alumni-forum-react', function (Request $request) {
            return [
                Limit::perMinute(30)->by($request->ip()),
                Limit::perHour(120)->by($request->ip()),
            ];
        });

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Register authentication event listeners.
     */
    protected function configureAuthEvents(): void
    {
        Event::listen(LoginEvent::class, function (LoginEvent $event): void {
            if (! $event->user instanceof User) {
                return;
            }

            $event->user->forceFill([
                'last_login_at' => now(),
                'last_seen_at' => now(),
            ])->saveQuietly();
        });
    }
}
