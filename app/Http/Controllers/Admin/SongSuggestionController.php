<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SongSuggestion;
use Inertia\Inertia;

class SongSuggestionController extends Controller
{
    public function index()
    {
        $songs = SongSuggestion::with('invitationGroup')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'track_title' => $s->track_title,
                'artist_name' => $s->artist_name,
                'album_name' => $s->album_name,
                'artwork_url' => $s->artwork_url,
                'preview_url' => $s->preview_url,
                'group_name' => $s->invitationGroup?->name ?? 'YouTube',
                'created_at' => $s->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('admin/songs/index', [
            'songs' => $songs,
        ]);
    }

    public function destroy(SongSuggestion $song)
    {
        $song->delete();

        return back()->with('success', "Canción '{$song->track_title}' eliminada");
    }
}
