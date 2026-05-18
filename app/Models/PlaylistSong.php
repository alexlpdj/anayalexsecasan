<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaylistSong extends Model
{
    protected $fillable = [
        'playlist_id', 'youtube_video_id', 'title', 'artist',
        'thumbnail_url', 'duration_seconds', 'sort_order',
    ];

    public function getDurationAttribute(): string
    {
        if (! $this->duration_seconds) {
            return '';
        }
        $m = intdiv($this->duration_seconds, 60);
        $s = $this->duration_seconds % 60;

        return sprintf('%d:%02d', $m, $s);
    }
}
