<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;

        /**
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'descriptions',
        'qty',
        'unit',
        'cost_price',
        'sell_price',
        'critical_level',
        'alert_level',
        'category',
        'created_at',
        'updated_at'
    ];
}
