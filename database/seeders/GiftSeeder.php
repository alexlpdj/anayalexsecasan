<?php

namespace Database\Seeders;

use App\Enums\GiftStatus;
use App\Enums\GiftType;
use App\Models\Gift;
use App\Models\Guest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GiftSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (Gift::count() > 0) {
            return;
        }

        // Datos importados del Excel Regalos_boda.xlsx
        // ['display_name', amount, type, notes, search_terms_para_guest]
        $rows = [
            ['Merche & Victor', 6000, GiftType::Cash, null, ['MERCHE', 'VICTOR']],
            ['Ivanete & Vicente', 1000, GiftType::Cash, null, ['IVANETE', 'VICENTE']],
            ['Raquel Abuela', 500, GiftType::Cash, null, ['RAQUEL']],
            ['Pepe & Raquel (y familia)', 1000, GiftType::Cash, 'Reponer 50', ['PEPE']],
            ['Marcia & Joaquin', 600, GiftType::Cash, 'Reponer 10', ['MARCIA', 'JOAQUIN']],
            ['Amiga Café Merche', 200, GiftType::Cash, null, []],
            ['Carlos & Clara', 400, GiftType::Cash, null, ['CARLOS', 'CLARA']],
            ['Raúl & Karim', 300, GiftType::Cash, null, ['RAUL', 'KARIM']],
            ['Noe & Edu', 300, GiftType::Cash, null, ['NOE', 'EDU']],
            ['Tía Glaucia', null, GiftType::DirectPayment, 'Pago Rio Quente', ['GLAUCIA']],
            ['Tía Mamen & Juanma', 500, GiftType::Cash, null, ['MAMEN', 'JUANMA']],
            ['Regalo Empresa Ana', 600, GiftType::Physical, null, []],
            ['Arantxa & Carlos', 350, GiftType::Cash, null, ['ARANTXA']],
            ['Amigas Café Merche', 160, GiftType::Cash, null, []],
        ];

        foreach ($rows as $index => [$name, $amount, $type, $notes, $searchTerms]) {
            $guestId = null;
            foreach ($searchTerms as $term) {
                $guest = Guest::whereRaw('UPPER(name) = ?', [$term])->first();
                if ($guest) {
                    $guestId = $guest->id;
                    break;
                }
            }

            Gift::create([
                'guest_id' => $guestId,
                'display_name' => $name,
                'amount' => $amount,
                'type' => $type,
                'status' => GiftStatus::Received,
                'received_at' => null,
                'notes' => $notes,
                'sort_order' => $index,
            ]);
        }
    }
}
