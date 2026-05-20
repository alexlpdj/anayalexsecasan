<?php

namespace Tests\Feature\Admin;

use App\Enums\GiftStatus;
use App\Enums\GiftType;
use App\Models\Gift;
use App\Models\Guest;
use App\Models\InvitationGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GiftTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    private function guest(string $name = 'Merche'): Guest
    {
        $group = InvitationGroup::create([
            'name' => "Grupo $name",
            'code' => strtoupper(substr(md5($name), 0, 6)),
            'type' => 'FAMILIAR',
        ]);

        return Guest::create([
            'invitation_group_id' => $group->id,
            'name' => $name,
            'gender' => 'MUJER',
        ]);
    }

    public function test_index_loads_for_authenticated_user(): void
    {
        $this->actingAs($this->admin())
            ->get(route('admin.gifts.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/gifts/index'));
    }

    public function test_index_redirects_guests(): void
    {
        $this->get(route('admin.gifts.index'))->assertRedirect(route('login'));
    }

    public function test_index_returns_correct_totals(): void
    {
        Gift::factory()->received()->create(['amount' => 1000]);
        Gift::factory()->received()->create(['amount' => 500]);
        Gift::factory()->pending()->create(['amount' => 200]);

        $this->actingAs($this->admin())
            ->get(route('admin.gifts.index'))
            ->assertInertia(fn ($page) => $page
                ->where('totals.received', 1500)
                ->where('totals.pending', 200)
                ->where('totals.count', 3)
            );
    }

    public function test_store_creates_monetary_gift_with_guest(): void
    {
        $guest = $this->guest('Merche');

        $this->actingAs($this->admin())
            ->post(route('admin.gifts.store'), [
                'guest_id' => $guest->id,
                'display_name' => 'Merche & Víctor',
                'amount' => 6000,
                'type' => GiftType::Cash->value,
                'status' => GiftStatus::Received->value,
                'received_at' => '2026-05-01',
                'notes' => null,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('gifts', [
            'guest_id' => $guest->id,
            'display_name' => 'Merche & Víctor',
            'amount' => 6000,
            'type' => 'cash',
            'status' => 'received',
        ]);
    }

    public function test_store_creates_non_monetary_gift(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.gifts.store'), [
                'display_name' => 'Tía Glaucia',
                'amount' => null,
                'type' => GiftType::DirectPayment->value,
                'status' => GiftStatus::Received->value,
                'notes' => 'Pago Rio Quente',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('gifts', [
            'display_name' => 'Tía Glaucia',
            'amount' => null,
            'type' => 'direct_payment',
            'notes' => 'Pago Rio Quente',
        ]);
    }

    public function test_update_modifies_status_and_date(): void
    {
        $gift = Gift::factory()->pending()->create(['amount' => 300]);

        $this->actingAs($this->admin())
            ->patch(route('admin.gifts.update', $gift), [
                'display_name' => $gift->display_name,
                'amount' => 300,
                'type' => GiftType::Cash->value,
                'status' => GiftStatus::Received->value,
                'received_at' => '2026-05-20',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('gifts', [
            'id' => $gift->id,
            'status' => 'received',
        ]);
        $this->assertEquals('2026-05-20', $gift->fresh()->received_at->format('Y-m-d'));
    }

    public function test_destroy_removes_gift(): void
    {
        $gift = Gift::factory()->received()->create();

        $this->actingAs($this->admin())
            ->delete(route('admin.gifts.destroy', $gift))
            ->assertRedirect();

        $this->assertDatabaseMissing('gifts', ['id' => $gift->id]);
    }

    public function test_store_validation_fails_without_display_name(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.gifts.store'), [
                'amount' => 100,
                'type' => GiftType::Cash->value,
                'status' => GiftStatus::Received->value,
            ])
            ->assertSessionHasErrors('display_name');
    }

    public function test_unauthenticated_user_cannot_access_admin(): void
    {
        $this->get(route('admin.gifts.index'))->assertRedirect(route('login'));
        $this->post(route('admin.gifts.store'), [])->assertRedirect(route('login'));
    }
}
