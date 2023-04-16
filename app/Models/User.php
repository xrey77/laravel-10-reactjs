<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Fortify\TwoFactorAuthenticatable;
// implements MustVerifyEmail

class User extends Authenticatable 
{
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'lastname',
        'firstname',
        'email',
        'mobile',
        'isblocked',
        'qrcodeurl',
        'enableqrcode',
        'username',
        'password',
        'two_factor_secret',
        'two_factor_recovery_code',
        'roles',
        'userpic',
        'isactivated',
        'token',
        'token_expiry',
        'mailtoken',
        'mailtoken_expiry'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // /**
    //  * The attributes that should be cast.
    //  *
    //  * @var array<string, string>
    //  */
    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    // ];


}
