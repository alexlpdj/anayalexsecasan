<?php

namespace App\Enums;

enum GiftStatus: string
{
    case Pending = 'pending';
    case Received = 'received';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente',
            self::Received => 'Recibido',
        };
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
