<?php
  
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Session;
// use App\Models\UserCode;
use App\Http\Requests\TwoFactorConfirmRequest;
use App\Http\Requests\ConfirmTwoFactorAuthentication;
use App\Http\Requests\TwoFactorAuthenticationProvider;
use Laravel\Fortify\Contracts\FailedTwoFactorLoginResponse;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class TwoFAController extends Controller
{


    /**
     * Write code on Method
     *
     * @return response()
     */
    public function index()
    {
        return view('auth.two-factor-challenge');
    }
        /**
         * Determine if the request has a valid two factor code.
         *
         * @return bool
         */
        public function store(Request $request)
       {
        $OTP = $request->input('code');
        $secretKey = session("SECRETKEY");
        $isOk = app(TwoFactorAuthenticationProvider::class)->verify(decrypt($secretKey),$OTP);
        session(['OTP'=> $isOk]);
        if ($isOk) {
            session("SECRETKEY", NULL);
            session(['XAUTH' => 'true']);
            return redirect()->route('home')->withSuccess('Successfully logged-in!');
        } else {
            return response()->json(['statuscode' => 400,'message' => 'OTP Code is not valid.']);

            // return back()->with('error', 'You entered wrong code.');
        }
 
  
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function resend()
    {
        auth()->user()->generateCode();
  
        return back()->with('success', 'We sent you code on your mobile number.');
    }


    /**
     * Handle response after user authenticated
     * 
     * @param Request $request
     * @param Auth $user
     * 
     * @return \Illuminate\Http\Response
     */
    protected function authenticated(Request $request, $user) 
    {
        return redirect()->intended();
    }    
}