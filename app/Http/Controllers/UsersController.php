<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Mail\ForgotPassword;
use App\Mail\ActivateAccount;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\RedirectResponse;

class UsersController extends Controller
{

    public function login(Request $request) {
        // $input = $request->collect();
        $usrname = $request->input('username');
        $pwd = $request->input('password');
        $remember = $request->input('remember');

        $credentials = ['username' => $usrname, 'password' => $pwd, 'remember_token' => $remember];

        try {

            // SEARCH CASE SENSITIVE USERNAME
            $user = User::where(DB::raw('BINARY `username`'),$usrname)->first();
            if ($user->username) {
                if (Hash::check($pwd,$user->password)) {

                    if (Auth::attempt($credentials)) {
                        // $key = Str::random(60);
                        // error_log("key : " . $key);
                        // $userx = Auth::user();
                        // $request->session()->regenerate();
                    } 

                    // $token = Auth::attempt($credentials);
                    // if (!$token) {
                    //     return response()->json([
                    //         'status' => 'error',
                    //         'message' => 'Unauthorized',
                    //     ], 401);
                    // } else {
                    //     $userx = Auth::user();
                    //     $request->session()->regenerate();
                    // }

                    if($user->isactivated == 0) {
                        return response()->json(['statuscode' => 404, 'message' => 'Please check you email inbox and activate your account.']);
                    }

                    if($user->isblocked == 1) {
                        return response()->json(['statuscode' => 404, 'message' => 'Your account has been blocked, please contact Administrator.']);
                    }

                    $token = $user->createToken($user->password, ['userinfo'])->plainTextToken;
                    $user->tokens()->delete();
                    // $request->session()->put('tokenkey', $token);
                    // session(['tokenkey' => $token]);

                    // $user->command('sanctum:prune-expired --hours=24')->daily();
                    $user->token = $token;
                    $user->remember_token = $remember;
                    $user->save();
                    return response()->json([
                        'statuscode' => 200,
                        'message' => 'Login Successfull, please wait..',
                        'userid' => $user->id,
                        'username' => $user->firstname,
                        'userpic' => $user->userpic,
                        'activateotp' => $user->enableqrcode,
                        'jwt' => ['token' => $token]  ]);
                } else {
                    return response()->json(['statuscode' => 404, 'message' => 'Invalid Password.']);
                }

            } else {

                return response()->json(['statuscode' => 404, 'message' => 'Username not found, please register first........']);
            }

        } catch(\Exception $e) {

            return response()->json(['statuscode' => 404, 'message' => 'Username not found, please register first.']);

        }
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $lname = $request->input('lastname');
        $fname = $request->input('firstname');
        $email = $request->input('email');
        $mobile = $request->input('mobile');
        $usrname = $request->input('username');
        $pwd = Hash::make($request->input('password'));
        $usrpic = "http://127.0.0.1:8000/images/user.jpg";
        $data = ['lastname'=> $lname, 'firstname' => $fname, 'email' => $email, 'mobile' => $mobile, 'username' => $usrname, 'password'=> $pwd, 'userpic' => $usrpic];
        try {
            // $users = User::where('name','LIKE',"%{$search}%")->get();
            $validateEmail = User::where('email', $email)->count();
            if ($validateEmail != 0) {
                return response()->json(['statuscode' => 400, 'message' => 'Email Address has already taken.']);
            } 
            $validateUsername = User::where('username', $usrname)->count();
            if ($validateUsername != 0) {
                return response()->json(['statuscode' => 400, 'message' => 'Username has already taken.']);
            }  

            // GET NEW USER ID
            $user = User::create(array_merge($data));
            $getuser = User::where('email', $email)->first();
            
            // start -- SEND ACTIVATION EMAIL
            $emaildata = ['from' => 'rey107@gmail.com','name' => 'Web Master', 'subject' => 'Activate Account', 'userid' => $getuser->id];
            try {
                Mail::to($email)->send(new ActivateAccount($emaildata));
                return response()->json(
                    [
                        'statuscode' => 200,
                        'message' => "Your activation account link has been sent to your email, please check your email inbox."
                    ], 200
                );
            } catch(\Exception $ex) {
                error_log($ex->getMessage());
                return response()->json(['statuscode' => 404,'message' => $ex->getMessage()]);            
            }
            // end -- ACTIVATION



            
        } catch(\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function signout(Request $request): RedirectResponse {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->forget('USERNAME');
        $request->session()->forget('USERID');
        $request->session()->forget('TOKEN');
        $request->session()->flush();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function sendMailToken(Request $request) {
        $email = $request->input('email');
        $mailToken = random_int(100000, 999999);
        try {
            $user = User::where('email',$email)->first();
            if ($user) {
                $user->mailtoken = $mailToken;
                $user->save();

                $data = ['from' => 'reynald88@yahoo.com','name' => 'Web Master', 'subject' => 'Forgot Password', 'token' => $mailToken];

                try {
                    Mail::to($email)->send(new ForgotPassword($data));
                    return response()->json(
                        [
                            'statuscode' => 200,
                            'message' => "Mail Token has been sent to your email address, please check your inbox"
                        ], 200
                    );
                } catch(\Exception $ex) {
                    error_log($ex->getMessage());
                    return response()->json(['statuscode' => 404,'message' => $ex->getMessage()]);            
                }

            } else {
                return response()->json(['statuscode' => 404,'message' => 'Email Address does not exists.']);
            }
        } catch(\Exception $ex) {
            return response()->json(['statuscode' => 404, 'message' => $ex->getMessage()]);
        }
    }

    public function validateMailtoken(Request $request) {
        $mtoken = $request->input('mailtoken');
        try {
            $user = User::where('mailtoken',$mtoken)->first();
            if ($user) {
                if ($user->mailtoken > 0) {
                    return response()->json(['statuscode' => 200, 'message' => 'Mail Token is validated correctly, pls wait.']);
                } else {
                    return response()->json(['statuscode' => 404, 'message' => 'Mail Token is not valid.']);
                }

            } else {
                return response()->json(['statuscode' => 404, 'message' => 'Mail Token is not valid.']);
            }
        } catch(\Exception $ex) {
            return response()->json(['statuscode' => 404, 'message' => $ex->getMessage()]);
        }
    }

    public function updatePassword(Request $request) {
        $mtoken = $request->input('mailtoken');
        $newpassword = $request->input("password");
        try {
            $user = User::where('mailtoken',$mtoken)->first();
            if ($user) {
                $pwd = Hash::make($newpassword);
                $user->mailtoken = 0;
                $user->password = $pwd;
                $user->save();
                return response()->json(['statuscode' => 200, 'message' => 'Password has been change successfully.']);
            } else {
                return response()->json(['statuscode' => 404, 'message' => 'Unable to change the password.']);
            }
        } catch(\Exception $ex) {
            return response()->json(['statuscode' => 404, 'message' => $ex->getMessage()]);
        }
    }


    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }
}


