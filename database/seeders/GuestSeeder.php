<?php

namespace Database\Seeders;

use App\Models\Guest;
use Illuminate\Database\Seeder;

class GuestSeeder extends Seeder
{
    public function run(): void
    {
        // Lista de invitados (SIN Alex y Ana - ellos son los novios/admins)
        $guests = [
            ['MERCHE', 'FAMILIAR', 'MUJER', 'SI', ''],
            ['VICTOR', 'FAMILIAR', 'HOMBRE', 'SI', ''],
            ['IVANETE', 'FAMILIAR', 'MUJER', 'SI', ''],
            ['VICENTE', 'FAMILIAR', 'HOMBRE', 'SI', ''],
            ['ISS', 'AMIGO', 'HOMBRE', 'SI', ''],
            ['SORI', 'AMIGO', 'MUJER', 'SI', ''],
            ['MARCIA', 'FAMILIAR', 'MUJER', 'SI', ''],
            ['JOAQUIN', 'FAMILIAR', 'HOMBRE', 'SI', ''],
            ['GLORIA', 'AMIGO', 'MUJER', 'SI', ''],
            ['ALBERTO', 'AMIGO', 'HOMBRE', 'SI', ''],
            ['BELEN', 'AMIGO', 'MUJER', 'SI', 'Melocotón + Cacahuetes'],
            ['SERGIO', 'AMIGO', 'HOMBRE', 'SI', ''],
            ['MAKO', 'AMIGO', 'HOMBRE', 'SI', ''],
            ['SUSANA', 'AMIGO', 'MUJER', 'SI', ''],
            ['JORGE', 'AMIGO', 'HOMBRE', 'SI', ''],
            ['JOSE', 'AMIGO', 'HOMBRE', '', ''],
            ['VALENTIN', 'AMIGO', 'HOMBRE', 'SI', ''],
            ['SABINA', 'AMIGO', 'MUJER', 'SI', ''],
            ['RAQUEL', 'AMIGO', 'MUJER', 'SI', ''],
            ['MIGUEL ANGEL (MICHI)', 'AMIGO', 'HOMBRE', 'SI', ''],
            ['PALOMINO', 'AMIGO', 'HOMBRE', '', ''],
            ['ARANTXA', 'AMIGO', 'MUJER', '', ''],
            ['CARLOS ARANTXA', 'AMIGO', 'HOMBRE', '', ''],
            ['CARLOS GRÁBALO', 'AMIGO', 'HOMBRE', '', ''],
            ['CLARA', 'AMIGO', 'MUJER', '', ''],
            ['NOE UNIMAT', 'AMIGO', 'MUJER', '', ''],
            ['EDU NOE', 'AMIGO', 'HOMBRE', '', ''],
            ['IAIA', 'FAMILIAR', 'MUJER', '', ''],
            ['TIO PEDRO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['RAQUEL ABUELA', 'FAMILIAR', 'MUJER', '', ''],
            ['IVAN PRIMO', 'FAMILIAR', 'HOMBRE', '', 'Cacahuetes'],
            ['ALBA IVAN', 'FAMILIAR', 'MUJER', '', ''],
            ['MARC PRIMO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['VICTOR PRIMO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['PANADERA', 'FAMILIAR', 'MUJER', '', ''],
            ['HIJA PANADERA', 'FAMILIAR', 'MUJER', '', ''],
            ['RUBEN PRIMO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['TIA PAQUI', 'FAMILIAR', 'MUJER', '', ''],
            ['NOE PRIMA', 'FAMILIAR', 'MUJER', '', ''],
            ['PEDRO NOE', 'FAMILIAR', 'HOMBRE', '', ''],
            ['MARIO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['TIA MARI', 'FAMILIAR', 'MUJER', '', ''],
            ['CELSO PRIMO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['EDUARDA (NOVIA CELSO)', 'FAMILIAR', 'MUJER', '', ''],
            ['PEPE', 'FAMILIAR', 'HOMBRE', '', ''],
            ['RAQUEL PEPE', 'FAMILIAR', 'MUJER', '', ''],
            ['PAU', 'FAMILIAR', 'HOMBRE', '', ''],
            ['ADRIAN', 'FAMILIAR', 'HOMBRE', '', ''],
            ['ANITA PEPE', 'FAMILIAR', 'MUJER', '', ''],
            ['FRAN', 'AMIGO', 'HOMBRE', '', ''],
            ['ANA FRAN', 'AMIGO', 'MUJER', '', ''],
            ['RAÚL VILAVELLA', 'AMIGO', 'HOMBRE', '', ''],
            ['RANIA', 'AMIGO', 'MUJER', '', ''],
            ['FABIO RANIA', 'AMIGO', 'HOMBRE', '', ''],
            ['INMA JORGE', 'AMIGO', 'MUJER', '', ''],
            ['VTE JORGE', 'AMIGO', 'HOMBRE', '', ''],
            ['GARI ISS', 'AMIGO', 'HOMBRE', '', ''],
            ['CHARI ISS', 'AMIGO', 'MUJER', '', ''],
            ['IVAN GYM', 'AMIGO', 'HOMBRE', '', ''],
            ['NEREA IVAN GYM', 'AMIGO', 'MUJER', '', ''],
            ['PATRI', 'AMIGO', 'MUJER', '', ''],
            ['GUILLEM PATRI', 'AMIGO', 'HOMBRE', '', ''],
            ['MAMEN TIA', 'FAMILIAR', 'MUJER', '', ''],
            ['JUANMA', 'FAMILIAR', 'HOMBRE', '', ''],
            ['TIO MANOLO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['CHARI', 'FAMILIAR', 'MUJER', '', ''],
            ['BEA AMAZON', 'AMIGO', 'MUJER', '', ''],
            ['ALEJANDRA AMAZON', 'AMIGO', 'MUJER', '', ''],
            ['TIO ANTONIO FRANCIA', 'FAMILIAR', 'HOMBRE', '', ''],
            ['TIA ANTONIA FRANCIA', 'FAMILIAR', 'MUJER', '', ''],
            ['NEREA', 'AMIGO', 'MUJER', '', ''],
            ['TIA CARMEN', 'FAMILIAR', 'MUJER', '', ''],
            ['VERO', 'FAMILIAR', 'MUJER', '', ''],
            ['SANTI', 'FAMILIAR', 'HOMBRE', '', ''],
            ['DAVID', 'FAMILIAR', 'HOMBRE', '', ''],
            ['LAURA', 'FAMILIAR', 'MUJER', '', ''],
            ['MARIANA', 'FAMILIAR', 'MUJER', '', ''],
            ['M. PILAR', 'FAMILIAR', 'MUJER', '', ''],
            ['KIKO marido pilar', 'FAMILIAR', 'HOMBRE', '', ''],
            ['TIA ANITA', 'FAMILIAR', 'MUJER', '', ''],
            ['JUAN marido anita', 'FAMILIAR', 'HOMBRE', '', ''],
            ['PACO', 'FAMILIAR', 'HOMBRE', '', ''],
            ['EVA', 'FAMILIAR', 'MUJER', '', ''],
            ['ANA FRANCIA', 'FAMILIAR', 'MUJER', '', ''],
            ['JEAN MICHEL', 'FAMILIAR', 'HOMBRE', '', ''],
            ['MANUEH', 'FAMILIAR', 'HOMBRE', '', ''],
        ];

        // Crear invitados con códigos únicos
        foreach ($guests as $guestData) {
            Guest::create([
                'name' => $guestData[0],
                'type' => $guestData[1],
                'gender' => $guestData[2],
                'code' => Guest::generateUniqueCode(),
                'allergies' => !empty($guestData[4]) ? $guestData[4] : null,
            ]);
        }

        // Crear registros de ADMIN para Alex y Ana (NO son invitados, son administradores)
        Guest::create([
            'name' => 'Alex',
            'type' => 'NOVIOS',
            'gender' => 'HOMBRE',
            'code' => 'ALEX',
            'allergies' => 'LACTOSA',
        ]);

        Guest::create([
            'name' => 'Ana',
            'type' => 'NOVIOS',
            'gender' => 'MUJER',
            'code' => 'ANA',
            'allergies' => null,
        ]);

        echo "\n✅ Invitados cargados correctamente\n";
        echo "📊 Total invitados: " . Guest::where('type', '!=', 'NOVIOS')->count() . "\n";
        echo "👑 Códigos de administración:\n";
        echo "   - Alex: ALEX\n";
        echo "   - Ana: ANA\n\n";
    }
}
