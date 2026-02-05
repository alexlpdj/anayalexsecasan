<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Alex - Administrador
        User::create([
            'name' => 'Alex',
            'email' => 'alex@bodaalexyana.com',
            'password' => Hash::make('password'), // Cambiar en producción
            'email_verified_at' => now(),
        ]);

        // Ana - Administradora
        User::create([
            'name' => 'Ana',
            'email' => 'ana@bodaalexyana.com',
            'password' => Hash::make('password'), // Cambiar en producción
            'email_verified_at' => now(),
        ]);

        echo "\n✅ Usuarios administradores creados:\n";
        echo "   - Alex: alex@bodaalexyana.com / password\n";
        echo "   - Ana: ana@bodaalexyana.com / password\n";
        echo "   ⚠️  Cambiar contraseñas en producción\n\n";
    }
}
