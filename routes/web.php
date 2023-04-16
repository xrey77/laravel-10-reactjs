<?php

use app\Http\Controllers\TwoFAController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\Api\UsersDataController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Main', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

//TWO FACTOR AUTHENTICATION
// Route::get('/2fa', [TwoFAController::class, 'index'])->name('2fa');
// Route::post('/two-factor-challenge', [TwoFAController::class, 'store']); //->name('2fa.post')->middleware('2fa');
// Route::get('/2fa/reset', [TwoFAController::class, 'resend'])->name('2fa.resend');


// Route::get('/home', function () {
//     return Inertia::render('Home');
// })->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/contact', function () {
    return Inertia::render('Contact');
});

Route::get('/mailtokens', function () {
    return Inertia::render('Mailtoken');
});

Route::get('/profile201', function () {
    return Inertia::render('Profile201');
});

Route::get('/otpdiaglog', function () {
    return Inertia::render('TotopDialog');
});

Route::get('/chnageforgottenpassword', function () {
    return Inertia::render('ChangeForgottenPassword');
});

Route::get('/signout', [UsersController::class, 'signout']);

Route::group(
    ['prefix' => 'v1'],
    function() {        
        Route::get('/sst', function () {
            return Inertia::render('SSTerminals'); 
        });

        Route::get('/onlinebanking', function () {
            return Inertia::render('OnlineBanking'); 
        });

        Route::get('/bankingsolutions', function () {
            return Inertia::render('BankingSolutions'); 
        });

        Route::get('/services', function () {
            return Inertia::render('Services'); 
        });
        
        
        
    }
);


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');


// Route::get('/getusers', [UsersDataController::class, 'getUsers']);

// Route::middleware('auth')->group(function () {
//     Route::get('/getusers', [UserDataController::class, 'getUsers']);
// });


// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
