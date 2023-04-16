<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;

class TwoFactorConfirmRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'code' => 'required|string',
        ];
    }

    /**
     * Determine if the request has a valid two factor code.
     *
     * @return bool
     */
    public function hasValidCode()
    {
        return $this->code && app(TwoFactorAuthenticationProvider::class)->verify(
            decrypt($this->user()->two_factor_secret),
            $this->code
        );
    }
}