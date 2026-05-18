<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MusicMoment extends Model
{
    protected $fillable = [
        'section_id',
        'name',
        'playlist_url',
        'notes',
        'estimated_duration',
        'sort_order',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(MusicSection::class, 'section_id');
    }
}
