<?php

namespace App\Http\Requests;

class ConfirmTwoFactorAuthentication extends \Laravel\Fortify\Actions\DisableTwoFactorAuthentication
{
    /**
     * Disable two factor authentication for the user.
     *
     * @param mixed $user
     *
     * @return void
     */
    public function __invoke($user)
    {
        $user->forceFill([
            'two_factor_confirmed' => true,
        ])->save();
    }
}