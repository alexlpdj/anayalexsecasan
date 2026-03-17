<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SongSuggestion extends Model
{
    protected $fillable = [
        'invitation_group_id',
        'track_title',
        'artist_name',
        'album_name',
        'artwork_url',
        'itunes_track_id',
        'preview_url',
    ];

    public function invitationGroup(): BelongsTo
    {
        return $this->belongsTo(InvitationGroup::class);
    }
}
