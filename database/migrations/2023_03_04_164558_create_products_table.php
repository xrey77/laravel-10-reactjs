<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {            
            $table->id();
            $table->string('descriptions')->nullable();
            $table->integer('qty')->default(0);
            $table->string('unit')->nullable();
            $table->decimal('cost_price')->default(0);
            $table->decimal('sell_price')->default(0);
            $table->integer('alert_level')->default(0);
            $table->integer('critical_level')->default(0);
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
