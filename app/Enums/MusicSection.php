<?php

namespace App\Enums;

enum MusicSection: string
{
    case Cena = 'cena';
    case Fiesta = 'fiesta';

    public function label(): string
    {
        return match ($this) {
            self::Cena => 'Cena',
            self::Fiesta => 'Fiesta',
        };
    }
}
