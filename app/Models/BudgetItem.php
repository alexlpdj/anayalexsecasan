<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetItem extends Model
{
    protected $fillable = ['name', 'category', 'value', 'max', 'sort_order'];

    protected $casts = [
        'value'      => 'integer',
        'max'        => 'integer',
        'sort_order' => 'integer',
    ];
}
