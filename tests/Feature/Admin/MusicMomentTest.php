<?php

namespace Tests\Feature\Admin;

use App\Models\MusicMoment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MusicMomentTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_index_loads_for_authenticated_user(): void
    {
        $this->actingAs($this->admin())
            ->get(route('admin.music.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/music/index'));
    }

    public function test_index_redirects_guests(): void
    {
        $this->get(route('admin.music.index'))->assertRedirect(route('login'));
    }

    public function test_store_creates_moment(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.music.store'), ['section' => 'cena', 'name' => 'Entrada invitados'])
            ->assertRedirect();

        $this->assertDatabaseHas('music_moments', [
            'section' => 'cena',
            'name'    => 'Entrada invitados',
        ]);
    }

    public function test_store_assigns_sequential_sort_order(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post(route('admin.music.store'), ['section' => 'cena', 'name' => 'Primero']);
        $this->actingAs($admin)->post(route('admin.music.store'), ['section' => 'cena', 'name' => 'Segundo']);

        $this->assertDatabaseHas('music_moments', ['name' => 'Primero',  'sort_order' => 0]);
        $this->assertDatabaseHas('music_moments', ['name' => 'Segundo', 'sort_order' => 1]);
    }

    public function test_store_validates_section(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.music.store'), ['section' => 'invalid', 'name' => 'Test'])
            ->assertSessionHasErrors('section');
    }

    public function test_update_changes_fields(): void
    {
        $moment = MusicMoment::create([
            'section'    => 'fiesta',
            'name'       => 'Original',
            'sort_order' => 0,
        ]);

        $this->actingAs($this->admin())
            ->patch(route('admin.music.update', $moment), [
                'name'               => 'Actualizado',
                'playlist_url'       => 'https://open.spotify.com/playlist/123',
                'notes'              => 'Mucho ritmo',
                'estimated_duration' => '45 min',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('music_moments', [
            'id'                 => $moment->id,
            'name'               => 'Actualizado',
            'playlist_url'       => 'https://open.spotify.com/playlist/123',
            'notes'              => 'Mucho ritmo',
            'estimated_duration' => '45 min',
        ]);
    }

    public function test_update_rejects_invalid_url(): void
    {
        $moment = MusicMoment::create(['section' => 'cena', 'name' => 'Test', 'sort_order' => 0]);

        $this->actingAs($this->admin())
            ->patch(route('admin.music.update', $moment), [
                'name'         => 'Test',
                'playlist_url' => 'not-a-url',
            ])
            ->assertSessionHasErrors('playlist_url');
    }

    public function test_destroy_deletes_moment(): void
    {
        $moment = MusicMoment::create(['section' => 'cena', 'name' => 'A borrar', 'sort_order' => 0]);

        $this->actingAs($this->admin())
            ->delete(route('admin.music.destroy', $moment))
            ->assertRedirect();

        $this->assertDatabaseMissing('music_moments', ['id' => $moment->id]);
    }

    public function test_reorder_updates_sort_order(): void
    {
        $a = MusicMoment::create(['section' => 'fiesta', 'name' => 'A', 'sort_order' => 0]);
        $b = MusicMoment::create(['section' => 'fiesta', 'name' => 'B', 'sort_order' => 1]);

        $this->actingAs($this->admin())
            ->post(route('admin.music.reorder'), [
                'moments' => [
                    ['id' => $a->id, 'sort_order' => 1],
                    ['id' => $b->id, 'sort_order' => 0],
                ],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('music_moments', ['id' => $a->id, 'sort_order' => 1]);
        $this->assertDatabaseHas('music_moments', ['id' => $b->id, 'sort_order' => 0]);
    }
}
