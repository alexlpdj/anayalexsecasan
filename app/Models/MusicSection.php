<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MusicSection extends Model
{
    protected $fillable = ['name', 'emoji', 'sort_order'];

    public function moments(): HasMany
    {
        return $this->hasMany(MusicMoment::class, 'section_id');
    }
}
