<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicMoment;
use App\Models\SongSuggestion;
use App\Models\WeddingSetting;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
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
                'source' => $s->source ?? 'guest',
                'track_title' => $s->track_title,
                'artist_name' => $s->artist_name,
                'artwork_url' => $s->artwork_url,
                'preview_url' => $s->preview_url,
                'group_name' => $s->invitationGroup?->name ?? 'YouTube',
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
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
        $moments = MusicMoment::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn (MusicMoment $m) => [
                'id' => $m->id,
                'section' => $m->section->value,
                'name' => $m->name,
                'playlist_url' => $m->playlist_url,
                'notes' => $m->notes,
                'estimated_duration' => $m->estimated_duration,
            ]);

        $setting = WeddingSetting::current();

        return Inertia::render('admin/music/print', [
            'moments' => $moments,
            'bride' => $setting?->bride,
            'groom' => $setting?->groom,
            'weddingDate' => $setting?->wedding_date?->format('d/m/Y'),
        ]);
    }

    public function importPlaylist(Request $request)
    {
        $request->validate([
            'playlist_url' => ['required', 'url'],
        ]);

        $apiKey = config('services.youtube.key');

        if (! $apiKey) {
            return back()->withErrors(['playlist_url' => 'No hay clave de API de YouTube configurada. Añade YOUTUBE_API_KEY en el archivo .env.']);
        }

        $playlistId = $this->extractYouTubePlaylistId($request->playlist_url);

        if (! $playlistId) {
            return back()->withErrors(['playlist_url' => 'URL de playlist de YouTube no válida. Asegúrate de que contenga "list=PLAYLIST_ID".']);
        }

        try {
            $songs = $this->fetchYouTubePlaylistSongs($apiKey, $playlistId);
        } catch (RequestException $e) {
            return back()->withErrors(['playlist_url' => 'Error al conectar con YouTube: '.$e->getMessage()]);
        }

        if (empty($songs)) {
            return back()->withErrors(['playlist_url' => 'No se encontraron canciones en esta playlist o la playlist no es pública.']);
        }

        $imported = 0;
        foreach ($songs as $song) {
            $exists = SongSuggestion::where('youtube_video_id', $song['youtube_video_id'])->exists();
            if (! $exists) {
                SongSuggestion::create($song);
                $imported++;
            }
        }

        $skipped = count($songs) - $imported;
        $message = "Se importaron {$imported} canción(es) de YouTube.";
        if ($skipped > 0) {
            $message .= " {$skipped} ya existían y fueron omitidas.";
        }

        return back()->with('success', $message);
    }

    private function extractYouTubePlaylistId(string $url): ?string
    {
        $parsed = parse_url($url);
        if (isset($parsed['query'])) {
            parse_str($parsed['query'], $params);

            return $params['list'] ?? null;
        }

        return null;
    }

    private function fetchYouTubePlaylistSongs(string $apiKey, string $playlistId): array
    {
        $songs = [];
        $nextPageToken = null;

        do {
            $response = Http::get('https://www.googleapis.com/youtube/v3/playlistItems', array_filter([
                'part' => 'snippet',
                'playlistId' => $playlistId,
                'maxResults' => 50,
                'pageToken' => $nextPageToken,
                'key' => $apiKey,
            ]));

            $response->throw();

            $data = $response->json();
            $nextPageToken = $data['nextPageToken'] ?? null;

            foreach ($data['items'] ?? [] as $item) {
                $snippet = $item['snippet'];
                $videoId = $snippet['resourceId']['videoId'] ?? null;
                $title = $snippet['title'] ?? '';

                if (! $videoId || $title === 'Deleted video' || $title === 'Private video') {
                    continue;
                }

                [$artist, $trackTitle] = $this->parseYouTubeTitle($title);

                $songs[] = [
                    'source' => 'youtube',
                    'invitation_group_id' => null,
                    'track_title' => $trackTitle,
                    'artist_name' => $artist,
                    'artwork_url' => $snippet['thumbnails']['medium']['url'] ?? $snippet['thumbnails']['default']['url'] ?? null,
                    'youtube_video_id' => $videoId,
                ];
            }
        } while ($nextPageToken);

        return $songs;
    }

    private function parseYouTubeTitle(string $title): array
    {
        // Strip common YouTube suffixes like "(Official Video)", "[Official Audio]", etc.
        $clean = preg_replace('/[\(\[【].*?[\)\]】]/u', '', $title);
        $clean = trim($clean);

        // Try "Artist - Track" format
        if (str_contains($clean, ' - ')) {
            [$artist, $track] = explode(' - ', $clean, 2);

            return [trim($artist), trim($track)];
        }

        return ['Desconocido', trim($clean) ?: $title];
    }
}
