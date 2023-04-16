<?php

namespace App\Http\Controllers\Api;


use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use BaconQrCode\Renderer\Color\Rgb;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\Fill;
// use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;

use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use App\Http\Requests\TwoFactorConfirmRequest;
use App\Http\Requests\ConfirmTwoFactorAuthentication;
use App\Http\Requests\TwoFactorAuthenticationProvider;
use Laravel\Fortify\Contracts\FailedTwoFactorLoginResponse;

use Laravel\Fortify\RecoveryCode;
use Illuminate\Support\Collection;
use App\Providers\RouteServiceProvider;

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Image;
use Illuminate\Http\RedirectResponse;

use Laravel\Fortify\Fortify;
use Session;

class UsersDataController extends Controller
{
    protected $provider;

    public function __construct(TwoFactorAuthenticationProvider $provider)
    {
        $this->provider = $provider;
    }

    public function getUsers(Request $request) {
        
        // GET USER CREDENTIALS
        $backend = Auth::user();
        // GET USER INPUT TOKEN
        $frontend = $request->bearerToken();
        if (!empty($frontend)) {

            if($backend->token == $frontend) {
                    $users = User::all();
                    if ($users) {
                        return response()->json(['statuscode' => 200, 'user' => $users]);
                    } else {
                        return response()->json(['statuscode' => 404, 'message' => 'Users table is empty.']);
                    }
            } else {
                return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
            }
        } else {
            return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
        }        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */    
    public function getUserid(Request $request,$id) {
        // GET USER CREDENTIALS
        $backend = Auth::user();
        // GET USER INPUT TOKEN
        $frontend = $request->bearerToken();
        if (!empty($frontend)) {
            if($backend->token == $frontend) {
                    try {
                        $user = User::find($id);
                        if ($user) {
                            return response()->json(['statuscode' => 200, 'message' => 'User Profile retrieved.', 'user' => $user]);
                        } 
                        return response()->json(['statuscode' => 406, 'message' => 'User ID. ' . $id . ' not found.']);
                    } catch(Exception $ex) {
                        return response()->json(['statuscode' => 406, 'message' => $ex->getmessage()]);
                    }    
                } else {
                    return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
                }
        } else {
            return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
        }
    }

    /**
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateUser(Request $request, $id)
    {
        // // GET USER CREDENTIALS
        $backend = Auth::user();
        // // GET USER INPUT TOKEN
        $frontend = $request->bearerToken();
        if (!empty($frontend)) {
            if($backend->token == $frontend) {
                        $pwd = $request->input('password');
                        $hash = Hash::make($pwd);
                        if ($pwd) {
                            $affected = DB::table('users')->where('id', $id)->update([
                                'lastname' => $request->input('lastname'),
                                'firstname' => $request->input('firstname'),
                                'mobile' => $request->input('mobile'),
                                'password' => $hash ,
                                'updated_at' => $request->input('updated_at')
                            ]);                            
                        } else {
                            $affected = DB::table('users')->where('id', $id)->update([
                                'lastname' => $request->input('lastname'),
                                'firstname' => $request->input('firstname'),
                                'mobile' => $request->input('mobile'),
                                'updated_at' => $request->input('updated_at')
                            ]);
                        }
                        return response()->json(['statuscode' => 200, 'message' => 'User ID No. ' . $id . ' has been updated.']);
            } else {
                return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
            }

        } else {
            return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteUser($id)
    {
        // GET USER CREDENTIALS
        $backend = Auth::user();
        // GET USER INPUT TOKEN
        $frontend = $request->bearerToken();
        if (!empty($frontend)) {

            if($backend->token == $frontend) {

                try {
                    $user = User::findOrFail($id);
                    if ($user) {
                        $user->delete();
                        return response()->json(['statuscode' => 200, 'message' => 'User ID No. ' . $id . ' has been deleted.']);
                    }
                    return response()->json(['statuscode' => 406, 'message' => 'Unable to delete user.']);
                } catch(Exception $ex) {
                    return response()->json(['statuscode' => 406, 'message' => $ex->getmessage()]);
                }        
            } else {
                return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
            }
        } else {
            return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
        }
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function enableDisableQrcode(Request $request) {

        $isQrcodeEnable = strval($request->input('enableqrcode'));
    
        // GET USER CREDENTIALS
        $backend = Auth::user();
        
        // GET USER INPUT TOKEN
        $frontend = $request->bearerToken();
        if (!empty($frontend)) {

            // $isOk = app(TwoFactorAuthenticationProvider::class)->verify(decrypt($secretKey),$OTP);
            // error_log('isOk : ' . $isOk);
            // $user = Auth::user();

            // Dump out the recovery codes
            // $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes));
            // error_log("Recovery Code : " . $$recoveryCodes);                           

            if($backend->token == $frontend) {

                try {
                    $user = User::find($backend->id);
                    if ($user) {
                        if ($isQrcodeEnable) {
                            // Generate (or re-generate) 2FA secret and recovery codes and saves to the User model.
                            // app(\Laravel\Fortify\Actions\EnableTwoFactorAuthentication::class)($user);

                            $secret = encrypt($this->provider->generateSecretKey());
                            // $user->two_factor_secret = $secret;
                            // $user->two_factor_recovery_code = $secret;

                            $qrcode = $request->user()->twoFactorQrCodeSvg();

                            $user->qrcodeurl = $qrcode;
                            $user->enableqrcode = 1;
                            $user->save();


                        } else {
                            $user->two_factor_secret = null;
                            $user->qrcodeurl = null;
                            $user->enableqrcode = 0;
                            $user->two_factor_recovery_codes = null;
                            $user->save();
                        }        
                        return response()->json([
                            'statuscode' => 200,
                            'message' => 'OTP Token successfully logged-in, please wait..',
                            'userid' => $user->id,
                            'username' => $user->firstname,
                            'userpic' => $user->userpic,
                        ]);
            

                    } else {
                        return response()->json(['statuscode' => 404, 'User ID not found.']);
                    }
                } catch(Exception $ex) {
                    error_log($ex);
                    return response()->json(['statuscode' => 404, 'message' => $ex->getmessage()]);
                }        

            } else {
                return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
            }
        } else {
            return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
        }
    }

    /**
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function activateAccount(Request $request, $id) {
        try {
            $user = User::find($id);
            if($user->isactivated == 0) {
                $user->isactivated = 1;
                $user->save();
                return response()->json(['statuscode' => 200, 'message' => 'You user account has been activated.']);
            } else {
                return response()->json(['statuscode' => 404, 'message' => 'You account is already activated.']);
            }
        } catch(\Exception $ex) {
            return response()->json(['statuscode' => 404, 'message' => $ex->getMessage()]);
        }                    
    }
 
    /**
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updatePicture(Request $request, $id) {
        // GET MULTIPART FORM FILE
        $file = $request->file('formFile');
        $img = $file->getClientOriginalName();

        // ASSIGN NEW FILENAME        
        $ext = $request->file('formFile')->guessExtension();
        $newfile = '00' . $id . '.' . $ext;        

        // SAVE NEW IMAGE FILE TO users folder in storage folder
        // $file->storeAs('users', $newfile);

        // SAVE NEW IMAGE to users folder in public folder
        // $file->move('users', $newfile);

        // RESISE NEW IMAGE
        $destinationPath = public_path('/users');
        $imgFile = Image::make($file->getRealPath());

        // SAVE NEW IMAGE to users folder in public folder
        $imgFile->resize(150, 150, function ($constraint) {
		    $constraint->aspectRatio();
		})->save($destinationPath.'/' . $newfile);
        $urlimg = "http://127.0.0.1:8000/users/" . $newfile;
        try {
            $user = User::find($id);
            if($user) {
                $user->userpic = $urlimg;
                $user->save();
            }
            return response()->json(['statuscode' => 200, 'message' => 'New picture has been uploaded successfully.','userpic' => $urlimg]);
        } catch(\Exception $ex) {
            return response()->json(['statuscode' => 404, 'message' => $ex->getMessage()]);
        }
    }

    /**
     * @return bool
     */
    public function validateToken(Request $request) {
        // GET USER CREDENTIALS
        $backend = Auth::user();
        
        // GET USER INPUT TOKEN
        $frontend = $request->bearerToken();
        if (!empty($frontend)) {
            if($backend->token == $frontend) {
        
                $otp = strval(trim($request->input('otp')));
                $user = User::find($backend->id);
                if ($user) {
                    $secretkey = $user->two_factor_secret;
                    try {
                        $isOk = $otp && app(TwoFactorAuthenticationProvider::class)->verify(decrypt($secretkey),$otp);
                        if ($isOk) {
                            return response()->json([
                                'statuscode' => 200,
                                'message' => 'OTP TOKEN successfully logged-in.',
                                'userid' => $user->id,
                                'username' => $user->firstname,
                                'userpic' => $user->userpic,
                            ]);
    
                        } else {
                            return response()->json(['statuscode' => 400, 'message' => 'OTP TOKEN is not valid, please try again.']);
                        }
                    } catch(\Exception $ex) {
                        return response()->json(['statuscode' => 404, 'message' => $ex->getMessage()]);
                    }
                } else {
                    return response()->json(['statuscode' => 404, 'message' => 'User ID is not valid.']);
                }

                // auth()->user()->twoFactorQrCodeSvg();


            } else {
                return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
            }
        } else {
            return response()->json(['statuscode' => 403, 'message' => "Unauthorized Access."]);
        }    
    }

    public function bearerToken()
    {
       $header = $this->header('Authorization', '');
       if (Str::startsWith($header, 'Bearer ')) {
                return Str::substr($header, 7);
       }
    }
    
    public function hasValidCode()
    {
        return $this->code && app(TwoFactorAuthenticationProvider::class)->verify(
            decrypt($this->challengedUser()->two_factor_secret), $this->code
        );
    }

    
}