<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Playlist extends Model
{
    protected $fillable = ['name', 'description', 'sort_order'];

    public function songs(): HasMany
    {
        return $this->hasMany(PlaylistSong::class)->orderBy('sort_order')->orderBy('id');
    }
}
