<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsersDataController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductsController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    if(!auth()->user()->tokenCan('userinfo')){
        return response()->json(['message' => 'Unauthorized Access.']);

    } 
    return response()->json(['message' => 'ok...']);
    
});

Route::post('signin', [UsersController::class, 'login']);
Route::post('signup', [UsersController::class, 'register']);
Route::post('sendmailtoken', [UsersController::class, 'sendMailToken']);
Route::post('checkmailtoken', [UsersController::class, 'validateMailtoken']);
Route::post('updatepassword', [UsersController::class, 'updatePassword']);
Route::put('activateaccount/{id}', [UsersDataController::class, 'activateAccount']);

Route::group(
    ['prefix' => 'v1','middleware' => ['auth:sanctum', 'abilities:check-status']],
    function() {
        Route::get('getusers', [UsersDataController::class, "getUsers"]);
        Route::get('getuserid/{id}', [UsersDataController::class, "getUserid"]);
        Route::delete('deleteuser/{id}', [UsersDataController::class, "deleteUser"]);
        Route::put('updateuser/{id}', [UsersDataController::class, "updateUser"]);
        Route::post('updateuserpicture/{id}', [UsersDataController::class, 'updatePicture']);
        Route::put('updateqrcode', [UsersDataController::class, "enableDisableQrcode"]);
        Route::post('validatetoken', [UsersDataController::class, 'validateToken']);
    }
);

Route::group(
    ['prefix' => 'v2'],
    function() {
        Route::post('inserproduct', [ProductsController::class, "insertProduct"]);
        Route::put('updateproduct', [ProductsController::class, "updateProduct"]);
        Route::get('listproducts', [ProductsController::class, "listProducts"]);
        Route::get('getproduct/{id}', [ProductsController::class, "getProduct"]);
        Route::get('deleteproduct/{id}', [ProductsController::class, "deleteProduct"]);
    }
);

