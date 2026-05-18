<?php

namespace Tests\Feature\Admin;

use App\Models\Playlist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PlaylistTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    private function playlist(): Playlist
    {
        return Playlist::create(['name' => 'Fiesta', 'sort_order' => 0]);
    }

    public function test_add_song_creates_song(): void
    {
        $playlist = $this->playlist();

        $this->actingAs($this->admin())
            ->post(route('admin.playlists.songs.store', $playlist), [
                'youtube_video_id' => 'abc123',
                'title' => 'Yellow',
                'artist' => 'Coldplay',
                'thumbnail_url' => 'https://i.ytimg.com/vi/abc123/mqdefault.jpg',
                'duration_seconds' => 269,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('playlist_songs', [
            'playlist_id' => $playlist->id,
            'youtube_video_id' => 'abc123',
            'title' => 'Yellow',
            'sort_order' => 0,
        ]);
    }

    public function test_add_song_rejects_duplicates(): void
    {
        $playlist = $this->playlist();
        $playlist->songs()->create(['youtube_video_id' => 'abc123', 'title' => 'Yellow', 'sort_order' => 0]);

        $this->actingAs($this->admin())
            ->post(route('admin.playlists.songs.store', $playlist), [
                'youtube_video_id' => 'abc123',
                'title' => 'Yellow',
            ])
            ->assertSessionHas('error');

        $this->assertSame(1, $playlist->songs()->count());
    }

    public function test_add_song_validates_required_fields(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.playlists.songs.store', $this->playlist()), ['title' => 'Yellow'])
            ->assertSessionHasErrors('youtube_video_id');
    }

    public function test_search_returns_youtube_results(): void
    {
        config(['services.youtube.key' => 'test-key']);

        Http::fake([
            'youtube/v3/search*' => Http::response([
                'items' => [[
                    'id' => ['videoId' => 'vid1'],
                    'snippet' => [
                        'title' => 'Coldplay - Yellow',
                        'channelTitle' => 'Coldplay',
                        'thumbnails' => ['medium' => ['url' => 'https://img/vid1.jpg']],
                    ],
                ]],
            ]),
            'youtube/v3/videos*' => Http::response([
                'items' => [['id' => 'vid1', 'contentDetails' => ['duration' => 'PT4M29S']]],
            ]),
        ]);

        $this->actingAs($this->admin())
            ->getJson(route('admin.playlists.search', $this->playlist()).'?q=yellow')
            ->assertOk()
            ->assertJsonPath('results.0.youtube_video_id', 'vid1')
            ->assertJsonPath('results.0.title', 'Yellow')
            ->assertJsonPath('results.0.artist', 'Coldplay')
            ->assertJsonPath('results.0.duration_seconds', 269);
    }

    public function test_search_requires_query(): void
    {
        $this->actingAs($this->admin())
            ->getJson(route('admin.playlists.search', $this->playlist()))
            ->assertStatus(422);
    }
}
