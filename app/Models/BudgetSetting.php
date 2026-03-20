<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetSetting extends Model
{
    protected $fillable = ['target'];

    protected $casts = ['target' => 'integer'];

    public static function getTarget(): int
    {
        return static::first()?->target ?? 30000;
    }

    public static function setTarget(int $target): void
    {
        $setting = static::firstOrNew();
        $setting->target = $target;
        $setting->save();
    }
}
