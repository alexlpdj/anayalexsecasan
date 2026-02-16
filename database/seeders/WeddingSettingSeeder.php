<?php

namespace Database\Seeders;

use App\Models\WeddingSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WeddingSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WeddingSetting::create([
            'bride' => 'Ana',
            'groom' => 'Alex',
            'wedding_date' => '2026-06-20',
            'civil_ceremony_date' => '2026-06-19',
            'venue_name' => 'La Ópera',
            'venue_address' => 'Benicàssim, Castellón',
            'venue_url' => 'https://laoperabenicassim.com/',
            'venue_parking_info' => 'Parking subterráneo gratuito disponible',
            'schedule' => [
                [
                    'time' => '19:30',
                    'event' => 'Ceremonia Civil',
                    'description' => 'Ceremonia oficiada por nuestros amigos en los jardines de La Ópera',
                    'details' => [
                        'Duración aproximada: 30 minutos',
                        'Al aire libre (hay espacio cubierto si llueve)',
                        'Por favor, llegad 15 minutos antes',
                    ],
                ],
                [
                    'time' => '21:30',
                    'event' => 'Cocktail & Buffet',
                    'description' => 'Aperitivo y cena tipo buffet en los jardines',
                    'details' => [
                        'Cóctel de bienvenida con cavas y vinos',
                        'Buffet variado con opciones vegetarianas',
                        'Mesas en el jardín bajo las estrellas',
                    ],
                ],
                [
                    'time' => '00:00',
                    'event' => 'Fiesta con DJ',
                    'description' => 'A bailar hasta que el cuerpo aguante',
                    'details' => [
                        'DJ profesional con variedad musical',
                        'Barra libre toda la noche',
                        'Photobooth disponible',
                    ],
                ],
            ],
            'buses_available' => true,
            'buses_info' => 'Autobuses gratuitos desde Onda y Castellón (horarios por confirmar)',
            'parking_available' => true,
            'is_active' => true,
        ]);
    }
}
