<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Playlist;
use App\Models\PlaylistSong;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PlaylistController extends Controller
{
    public function index()
    {
        $playlists = Playlist::withCount('songs')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Playlist $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'songs_count' => $p->songs_count,
                'sort_order' => $p->sort_order,
            ]);

        return Inertia::render('admin/playlists/index', [
            'playlists' => $playlists,
        ]);
    }

    public function show(Playlist $playlist)
    {
        $songs = $playlist->songs->map(fn (PlaylistSong $s) => [
            'id' => $s->id,
            'youtube_video_id' => $s->youtube_video_id,
            'title' => $s->title,
            'artist' => $s->artist,
            'thumbnail_url' => $s->thumbnail_url,
            'duration' => $s->duration,
            'sort_order' => $s->sort_order,
        ]);

        return Inertia::render('admin/playlists/show', [
            'playlist' => [
                'id' => $playlist->id,
                'name' => $playlist->name,
                'description' => $playlist->description,
            ],
            'songs' => $songs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $maxOrder = Playlist::max('sort_order') ?? -1;
        $playlist = Playlist::create([...$validated, 'sort_order' => $maxOrder + 1]);

        return redirect()->route('admin.playlists.show', $playlist)
            ->with('success', "Playlist \"{$playlist->name}\" creada");
    }

    public function update(Request $request, Playlist $playlist)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string', 'max:500'],
        ]);

        $playlist->update($validated);

        return back()->with('success', 'Playlist actualizada');
    }

    public function destroy(Playlist $playlist)
    {
        $name = $playlist->name;
        $playlist->delete();

        return redirect()->route('admin.playlists.index')
            ->with('success', "Playlist \"{$name}\" eliminada");
    }

    public function importFromYoutube(Request $request, Playlist $playlist)
    {
        $request->validate([
            'playlist_url' => ['required', 'url'],
        ]);

        $apiKey = config('services.youtube.key');

        if (! $apiKey) {
            return back()->withErrors(['playlist_url' => 'Añade YOUTUBE_API_KEY en el archivo .env para usar esta función.']);
        }

        $playlistId = $this->extractPlaylistId($request->playlist_url);

        if (! $playlistId) {
            return back()->withErrors(['playlist_url' => 'URL no válida. Debe contener "list=ID_DE_PLAYLIST".']);
        }

        try {
            $videos = $this->fetchYoutubePlaylist($apiKey, $playlistId);
        } catch (\Exception $e) {
            return back()->withErrors(['playlist_url' => 'Error al conectar con YouTube: '.$e->getMessage()]);
        }

        if (empty($videos)) {
            return back()->withErrors(['playlist_url' => 'No se encontraron canciones. Comprueba que la playlist sea pública.']);
        }

        $existing = $playlist->songs()->pluck('youtube_video_id')->flip();
        $maxOrder = $playlist->songs()->max('sort_order') ?? -1;
        $imported = 0;

        foreach ($videos as $video) {
            if ($existing->has($video['youtube_video_id'])) {
                continue;
            }
            $playlist->songs()->create([...$video, 'sort_order' => ++$maxOrder]);
            $imported++;
        }

        $skipped = count($videos) - $imported;
        $msg = "Se importaron {$imported} canciones.";
        if ($skipped > 0) {
            $msg .= " {$skipped} ya estaban en la playlist y se omitieron.";
        }

        return back()->with('success', $msg);
    }

    public function removeSong(Playlist $playlist, PlaylistSong $song)
    {
        abort_unless($song->playlist_id === $playlist->id, 403);
        $song->delete();

        return back()->with('success', 'Canción eliminada');
    }

    // ── private helpers ────────────────────────────────────────

    private function extractPlaylistId(string $url): ?string
    {
        $parsed = parse_url($url);
        if (isset($parsed['query'])) {
            parse_str($parsed['query'], $params);

            return $params['list'] ?? null;
        }

        return null;
    }

    private function fetchYoutubePlaylist(string $apiKey, string $playlistId): array
    {
        $videos = [];
        $nextPageToken = null;

        do {
            $response = Http::get('https://www.googleapis.com/youtube/v3/playlistItems', array_filter([
                'part' => 'snippet,contentDetails',
                'playlistId' => $playlistId,
                'maxResults' => 50,
                'pageToken' => $nextPageToken,
                'key' => $apiKey,
            ]));

            $response->throw();

            $data = $response->json();
            $nextPageToken = $data['nextPageToken'] ?? null;

            // Fetch durations in batch
            $videoIds = collect($data['items'] ?? [])
                ->pluck('contentDetails.videoId')
                ->filter()
                ->values()
                ->join(',');

            $durations = [];
            if ($videoIds) {
                $detailsResp = Http::get('https://www.googleapis.com/youtube/v3/videos', [
                    'part' => 'contentDetails',
                    'id' => $videoIds,
                    'key' => $apiKey,
                ]);
                foreach ($detailsResp->json('items', []) as $item) {
                    $durations[$item['id']] = $this->iso8601ToSeconds($item['contentDetails']['duration'] ?? '');
                }
            }

            foreach ($data['items'] ?? [] as $item) {
                $snippet = $item['snippet'];
                $videoId = $snippet['resourceId']['videoId'] ?? null;
                $title = $snippet['title'] ?? '';

                if (! $videoId || in_array($title, ['Deleted video', 'Private video'])) {
                    continue;
                }

                [$artist, $cleanTitle] = $this->parseTitle($title);

                $videos[] = [
                    'youtube_video_id' => $videoId,
                    'title' => $cleanTitle,
                    'artist' => $artist,
                    'thumbnail_url' => $snippet['thumbnails']['medium']['url']
                        ?? $snippet['thumbnails']['default']['url']
                        ?? null,
                    'duration_seconds' => $durations[$videoId] ?? null,
                ];
            }
        } while ($nextPageToken);

        return $videos;
    }

    private function parseTitle(string $title): array
    {
        $clean = preg_replace('/[\(\[【].*?[\)\]】]/u', '', $title);
        $clean = trim($clean);

        if (str_contains($clean, ' - ')) {
            [$artist, $track] = explode(' - ', $clean, 2);

            return [trim($artist), trim($track) ?: $title];
        }

        return [null, trim($clean) ?: $title];
    }

    private function iso8601ToSeconds(string $duration): int
    {
        preg_match('/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/', $duration, $m);

        return (int) ($m[1] ?? 0) * 3600 + (int) ($m[2] ?? 0) * 60 + (int) ($m[3] ?? 0);
    }
}
