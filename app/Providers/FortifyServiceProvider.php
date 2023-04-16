<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;
use App\Http\Requests\TwoFactorConfirmRequest;
use App\Http\Requests\ConfirmTwoFactorAuthentication;
use App\Http\Requests\TwoFactorAuthenticationProvider;
use Laravel\Fortify\Contracts\FailedTwoFactorLoginResponse;

use App\Actions\Fortify\DisableTwoFactorAuthentication as ReallyDisableTwoFactorAuthentication;
use App\Actions\Fortify\RedirectIfTwoFactorConfirmed;
use Laravel\Fortify\Actions\AttemptToAuthenticate;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnsureLoginIsNotThrottled;
use Laravel\Fortify\Actions\PrepareAuthenticatedSession;
use Laravel\Fortify\Features;

class FortifyServiceProvider extends ServiceProvider
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
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        Fortify::viewPrefix('auth.');

        Fortify::authenticateThrough(function(){
            return array_filter([
                config('fortify.limiters.login') ? null : EnsureLoginIsNotThrottled::class,
                Features::enabled(Features::twoFactorAuthentication()) ? RedirectIfTwoFactorConfirmed::class : null,
                AttemptToAuthenticate::class,
                PrepareAuthenticatedSession::class,
            ]);
        });

        Fortify::twoFactorChallengeView(function() {
            return view('auth.two-factor-challenge');
        });

        $this->app->bind(DisableTwoFactorAuthentication::class, function(){
            return new ReallyDisableTwoFactorAuthentication();
        });

        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->email;

            return Limit::perMinute(5)->by($email.$request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });




    }
}
