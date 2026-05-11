<?php

namespace App\Models;

use App\Enums\MusicSection;
use Illuminate\Database\Eloquent\Model;

class MusicMoment extends Model
{
    protected $fillable = [
        'section',
        'name',
        'playlist_url',
        'notes',
        'estimated_duration',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'section' => MusicSection::class,
        ];
    }
}
