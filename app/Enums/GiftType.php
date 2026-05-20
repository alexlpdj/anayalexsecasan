<?php

namespace App\Enums;

enum GiftType: string
{
    case Cash = 'cash';
    case Transfer = 'transfer';
    case Physical = 'physical';
    case DirectPayment = 'direct_payment';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Efectivo',
            self::Transfer => 'Transferencia',
            self::Physical => 'Regalo físico',
            self::DirectPayment => 'Pago directo',
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
