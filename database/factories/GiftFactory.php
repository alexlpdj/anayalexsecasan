<?php

namespace Database\Factories;

use App\Enums\GiftStatus;
use App\Enums\GiftType;
use App\Models\Gift;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Gift>
 */
class GiftFactory extends Factory
{
    protected $model = Gift::class;

    public function definition(): array
    {
        return [
            'guest_id' => null,
            'display_name' => $this->faker->name(),
            'amount' => $this->faker->randomElement([100, 200, 300, 500, 1000]),
            'type' => GiftType::Cash,
            'status' => GiftStatus::Received,
            'received_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'notes' => null,
            'sort_order' => 0,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => GiftStatus::Pending,
            'received_at' => null,
        ]);
    }

    public function received(): static
    {
        return $this->state(fn () => [
            'status' => GiftStatus::Received,
            'received_at' => now(),
        ]);
    }

    public function nonMonetary(): static
    {
        return $this->state(fn () => [
            'amount' => null,
            'type' => GiftType::DirectPayment,
        ]);
    }
}
