<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicMoment;
use App\Models\MusicSection;
use App\Models\SongSuggestion;
use App\Models\WeddingSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MusicMomentController extends Controller
{
    private function sectionsData(): array
    {
        return MusicSection::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn (MusicSection $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'emoji' => $s->emoji,
                'sort_order' => $s->sort_order,
            ])->all();
    }

    private function momentsData(): array
    {
        return MusicMoment::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn (MusicMoment $m) => [
                'id' => $m->id,
                'section_id' => $m->section_id,
                'name' => $m->name,
                'playlist_url' => $m->playlist_url,
                'notes' => $m->notes,
                'estimated_duration' => $m->estimated_duration,
                'sort_order' => $m->sort_order,
            ])->all();
    }

    public function index()
    {
        $songs = SongSuggestion::with('invitationGroup')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'source' => $s->source ?? 'guest',
                'track_title' => $s->track_title,
                'artist_name' => $s->artist_name,
                'artwork_url' => $s->artwork_url,
                'preview_url' => $s->preview_url,
                'group_name' => $s->invitationGroup?->name ?? 'YouTube',
            ]);

        return Inertia::render('admin/music/index', [
            'sections' => $this->sectionsData(),
            'moments' => $this->momentsData(),
            'songs' => $songs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_id' => ['required', 'exists:music_sections,id'],
            'name' => ['required', 'string', 'max:255'],
            'playlist_url' => ['nullable', 'url', 'max:500'],
        ]);

        $maxOrder = MusicMoment::where('section_id', $validated['section_id'])->max('sort_order') ?? -1;

        MusicMoment::create([...$validated, 'sort_order' => $maxOrder + 1]);

        return back()->with('success', 'Momento creado');
    }

    public function update(Request $request, MusicMoment $moment)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'section_id' => ['sometimes', 'required', 'exists:music_sections,id'],
            'playlist_url' => ['sometimes', 'nullable', 'url', 'max:500'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'estimated_duration' => ['sometimes', 'nullable', 'string', 'max:50'],
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

    public function getShareUrl()
    {
        $setting = WeddingSetting::current();

        if (! $setting) {
            return response()->json(['error' => 'No hay configuración de boda activa'], 422);
        }

        if (! $setting->music_share_token) {
            $setting->update(['music_share_token' => Str::random(48)]);
        }

        return response()->json([
            'url' => route('music.share', $setting->music_share_token),
        ]);
    }

    public function print()
    {
        $setting = WeddingSetting::current();

        return Inertia::render('admin/music/print', [
            'sections' => $this->sectionsData(),
            'moments' => $this->momentsData(),
            'bride' => $setting?->bride,
            'groom' => $setting?->groom,
            'weddingDate' => $setting?->wedding_date?->format('d/m/Y'),
        ]);
    }
}
