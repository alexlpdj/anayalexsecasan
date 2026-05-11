<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicMoment;
use App\Models\SongSuggestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MusicMomentController extends Controller
{
    public function index()
    {
        $moments = MusicMoment::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn (MusicMoment $m) => [
                'id' => $m->id,
                'section' => $m->section->value,
                'name' => $m->name,
                'playlist_url' => $m->playlist_url,
                'notes' => $m->notes,
                'estimated_duration' => $m->estimated_duration,
                'sort_order' => $m->sort_order,
            ]);

        $songs = SongSuggestion::with('invitationGroup')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'track_title' => $s->track_title,
                'artist_name' => $s->artist_name,
                'artwork_url' => $s->artwork_url,
                'preview_url' => $s->preview_url,
                'group_name' => $s->invitationGroup->name,
            ]);

        return Inertia::render('admin/music/index', [
            'moments' => $moments,
            'songs' => $songs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section' => ['required', 'in:cena,fiesta'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $maxOrder = MusicMoment::where('section', $validated['section'])->max('sort_order') ?? -1;

        MusicMoment::create([
            ...$validated,
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Momento creado');
    }

    public function update(Request $request, MusicMoment $moment)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'playlist_url' => ['nullable', 'url', 'max:500'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'estimated_duration' => ['nullable', 'string', 'max:50'],
        ]);

        $moment->update($validated);

        return back()->with('success', 'Momento actualizado');
    }

    public function destroy(MusicMoment $moment)
    {
        $moment->delete();

        return back()->with('success', "Momento '{$moment->name}' eliminado");
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'moments' => ['required', 'array'],
            'moments.*.id' => ['required', 'exists:music_moments,id'],
            'moments.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['moments'] as $item) {
            MusicMoment::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Orden actualizado');
    }
}
