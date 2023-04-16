<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * $table->timestamp('email_verified_at')->nullable();
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('lastname')->nullable();
            $table->string('firstname')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->unique();
            $table->string('username')->nullable();
            $table->text('qrcodeurl')->nullable();
            $table->integer('enableqrcode')->default(0);            
            $table->string('password')->nullable();
            $table->string('roles')->default('User');
            $table->integer('isblocked')->default(0);            
            $table->integer('isactivated')->default(0);
            $table->string('token', 64)->unique()->nullable();
            $table->timestamp('token_expiry')->nullable();
            $table->string('userpic')->nullable();            
            $table->integer('mailtoken')->default(0);
            $table->timestamp('mailtoken_expiry')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
