<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Enums\RoleName;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->instance(LoginResponseContract::class, new class implements LoginResponseContract
        {
            /**
             * Create an HTTP response that represents the object.
             *
             * @param  Request  $request
             */
            public function toResponse($request)
            {
                $user = $request->user();

                if (! $user instanceof User) {
                    return redirect()->intended(config('fortify.home'));
                }

                if ($user->hasAnyRole([RoleName::SuperAdmin->value, RoleName::OperatorSekolah->value])) {
                    return redirect()->intended(route('dashboard.admin', absolute: false));
                }

                if ($user->hasRole(RoleName::Guru->value)) {
                    return redirect()->intended(route('dashboard.guru', absolute: false));
                }

                if ($user->hasAnyRole([RoleName::Siswa->value, RoleName::JurnalisSiswa->value])) {
                    return redirect()->intended(route('dashboard.siswa', absolute: false));
                }

                if ($user->hasRole(RoleName::WaliMurid->value)) {
                    return redirect()->intended(route('dashboard.wali', absolute: false));
                }

                return redirect()->intended(route('dashboard', absolute: false));
            }
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureAuthentication();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure authentication rules for portal access.
     */
    private function configureAuthentication(): void
    {
        Fortify::authenticateUsing(function (Request $request): ?User {
            $user = User::query()
                ->where('email', Str::lower((string) $request->input('email')))
                ->first();

            if (! $user || ! Hash::check((string) $request->input('password'), $user->password)) {
                return null;
            }

            if ($user->status !== UserStatus::Active) {
                throw ValidationException::withMessages([
                    'email' => __('Akun ini tidak aktif untuk portal internal. Hubungi super admin.'),
                ]);
            }

            return $user;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
            'securityProfile' => [
                'guard' => config('fortify.guard'),
                'supportsTwoFactor' => Features::enabled(Features::twoFactorAuthentication()),
                'loginAttemptsPerMinute' => 5,
            ],
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
