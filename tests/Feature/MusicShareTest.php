<?php

namespace Tests\Feature;

use App\Models\MusicMoment;
use App\Models\MusicSection;
use App\Models\Playlist;
use App\Models\WeddingSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MusicShareTest extends TestCase
{
    use RefreshDatabase;

    private function settingWithToken(string $token = 'share-token'): WeddingSetting
    {
        return WeddingSetting::create([
            'bride' => 'Ana',
            'groom' => 'Alex',
            'wedding_date' => '2026-06-20',
            'venue_name' => 'Finca',
            'venue_address' => 'Calle Mayor 1',
            'schedule' => [],
            'is_active' => true,
            'music_share_token' => $token,
        ]);
    }

    public function test_share_page_loads_with_valid_token(): void
    {
        $this->settingWithToken();

        $this->get(route('music.share', 'share-token'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('music/share'));
    }

    public function test_share_page_returns_404_for_invalid_token(): void
    {
        $this->settingWithToken();

        $this->get(route('music.share', 'wrong-token'))->assertNotFound();
    }

    public function test_share_page_includes_moments_and_playlists(): void
    {
        $this->settingWithToken();

        $section = MusicSection::create(['name' => 'Cena', 'emoji' => '🍽️', 'sort_order' => 0]);
        MusicMoment::create(['section_id' => $section->id, 'name' => 'Entrada', 'sort_order' => 0]);

        $playlist = Playlist::create(['name' => 'Fiesta', 'sort_order' => 0]);
        $playlist->songs()->create(['youtube_video_id' => 'abc123', 'title' => 'Yellow', 'artist' => 'Coldplay', 'sort_order' => 0]);

        $this->get(route('music.share', 'share-token'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('music/share')
                ->has('moments', 1)
                ->has('playlists', 1)
                ->where('playlists.0.name', 'Fiesta')
                ->has('playlists.0.songs', 1)
                ->where('playlists.0.songs.0.title', 'Yellow')
            );
    }
}
