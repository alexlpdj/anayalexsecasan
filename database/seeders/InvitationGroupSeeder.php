<?php

namespace Database\Seeders;

use App\Models\InvitationGroup;
use App\Models\Guest;
use Illuminate\Database\Seeder;

class InvitationGroupSeeder extends Seeder
{
    /**
     * Cargar todos los invitados organizados por grupos/núcleos familiares
     */
    public function run(): void
    {
        $groups = $this->getGuestGroups();
        
        $totalGroups = 0;
        $totalGuests = 0;
        $familyGroups = 0;
        $friendGroups = 0;
        $codes = [];

        foreach ($groups as $groupData) {
            // Crear grupo con código único
            $group = InvitationGroup::create([
                'name' => $groupData['name'],
                'type' => $groupData['type'],
                'code' => InvitationGroup::generateUniqueCode(),
            ]);

            if ($group->type === 'FAMILIAR') $familyGroups++;
            if ($group->type === 'AMIGO') $friendGroups++;

            $codes[] = [
                'code' => $group->code,
                'name' => $group->name,
                'count' => count($groupData['guests']),
            ];

            // Crear invitados del grupo
            foreach ($groupData['guests'] as $guestData) {
                Guest::create([
                    'invitation_group_id' => $group->id,
                    'name' => $guestData['name'],
                    'gender' => $guestData['gender'] ?? null,
                    'allergies' => $guestData['allergies'] ?? null,
                ]);
                $totalGuests++;
            }

            $totalGroups++;
        }

        $this->printSummary($totalGroups, $totalGuests, $familyGroups, $friendGroups, $codes);
    }

    /**
     * Definir todos los grupos de invitados
     */
    private function getGuestGroups(): array
    {
        return [
            // ========== FAMILIAS ==========
            [
                'name' => 'Merche y Victor',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Merche', 'gender' => 'MUJER'],
                    ['name' => 'Victor', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Ivanete y Vicente',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Ivanete', 'gender' => 'MUJER'],
                    ['name' => 'Vicente', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Marcia y Joaquín',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Marcia', 'gender' => 'MUJER'],
                    ['name' => 'Joaquín', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Iaia',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Iaia', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Tío Pedro',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Tío Pedro', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Raquel Abuela',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Raquel Abuela', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Ivan Primo y Alba',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Ivan Primo', 'gender' => 'HOMBRE', 'allergies' => 'Cacahuetes'],
                    ['name' => 'Alba Ivan', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Marc Primo',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Marc Primo', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Victor Primo y Familia',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Victor Primo', 'gender' => 'HOMBRE'],
                    ['name' => 'Panadera', 'gender' => 'MUJER'],
                    ['name' => 'Hija Panadera', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Familia Tía Paqui',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Tía Paqui', 'gender' => 'MUJER'],
                    ['name' => 'Ruben Primo', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Noe Prima y Pedro',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Noe Prima', 'gender' => 'MUJER'],
                    ['name' => 'Pedro Noe', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Familia Tía Mari',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Tía Mari', 'gender' => 'MUJER'],
                    ['name' => 'Mario', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Celso y Eduarda',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Celso Primo', 'gender' => 'HOMBRE'],
                    ['name' => 'Eduarda (Novia Celso)', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Familia Pepe',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Pepe', 'gender' => 'HOMBRE'],
                    ['name' => 'Raquel Pepe', 'gender' => 'MUJER'],
                    ['name' => 'Pau', 'gender' => 'HOMBRE'],
                    ['name' => 'Adrian', 'gender' => 'HOMBRE'],
                    ['name' => 'Anita Pepe', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Mamen y Juanma',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Mamen Tía', 'gender' => 'MUJER'],
                    ['name' => 'Juanma', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Tío Manolo y Chari',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Tío Manolo', 'gender' => 'HOMBRE'],
                    ['name' => 'Chari', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Familia Francia',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Tío Antonio Francia', 'gender' => 'HOMBRE'],
                    ['name' => 'Tía Antonia Francia', 'gender' => 'MUJER'],
                    ['name' => 'Ana Francia', 'gender' => 'MUJER'],
                    ['name' => 'Jean Michel', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Tía Carmen',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Tía Carmen', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Familia Vero',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Vero', 'gender' => 'MUJER'],
                    ['name' => 'Santi', 'gender' => 'HOMBRE'],
                    ['name' => 'David', 'gender' => 'HOMBRE'],
                    ['name' => 'Laura', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Mariana',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Mariana', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'M. Pilar y Kiko',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'M. Pilar', 'gender' => 'MUJER'],
                    ['name' => 'Kiko marido pilar', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Tía Anita y Juan',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Tía Anita', 'gender' => 'MUJER'],
                    ['name' => 'Juan marido anita', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Paco y Eva',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Paco', 'gender' => 'HOMBRE'],
                    ['name' => 'Eva', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Manueh',
                'type' => 'FAMILIAR',
                'guests' => [
                    ['name' => 'Manueh', 'gender' => 'HOMBRE'],
                ],
            ],

            // ========== AMIGOS ==========
            [
                'name' => 'Iss y Sori',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Iss', 'gender' => 'HOMBRE'],
                    ['name' => 'Sori', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Gari y Chari Iss',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Gari Iss', 'gender' => 'HOMBRE'],
                    ['name' => 'Chari Iss', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Gloria',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Gloria', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Alberto',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Alberto', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Belén',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Belén', 'gender' => 'MUJER', 'allergies' => 'Melocotón + Cacahuetes'],
                ],
            ],
            [
                'name' => 'Sergio',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Sergio', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Mako',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Mako', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Susana',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Susana', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Jorge',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Jorge', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Vte Jorge e Inma',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Vte Jorge', 'gender' => 'HOMBRE'],
                    ['name' => 'Inma Jorge', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Jose',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Jose', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Valentín',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Valentin', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Sabina',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Sabina', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Raquel',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Raquel', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Miguel Ángel (Michi)',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Miguel Angel (Michi)', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Palomino',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Palomino', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Arantxa y Carlos',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Arantxa', 'gender' => 'MUJER'],
                    ['name' => 'Carlos Arantxa', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Carlos Grábalo',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Carlos Grábalo', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Clara',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Clara', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Noe Unimat y Edu',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Noe Unimat', 'gender' => 'MUJER'],
                    ['name' => 'Edu Noe', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Fran y Ana',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Fran', 'gender' => 'HOMBRE'],
                    ['name' => 'Ana Fran', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Raúl Vilavella',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Raúl Vilavella', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Rania y Fabio',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Rania', 'gender' => 'MUJER'],
                    ['name' => 'Fabio Rania', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Ivan Gym y Nerea',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Ivan Gym', 'gender' => 'HOMBRE'],
                    ['name' => 'Nerea Ivan Gym', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Patri y Guillem',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Patri', 'gender' => 'MUJER'],
                    ['name' => 'Guillem Patri', 'gender' => 'HOMBRE'],
                ],
            ],
            [
                'name' => 'Bea Amazon',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Bea Amazon', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Alejandra Amazon',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Alejandra Amazon', 'gender' => 'MUJER'],
                ],
            ],
            [
                'name' => 'Nerea',
                'type' => 'AMIGO',
                'guests' => [
                    ['name' => 'Nerea', 'gender' => 'MUJER'],
                ],
            ],
        ];
    }

    /**
     * Mostrar resumen de la carga
     */
    private function printSummary(int $totalGroups, int $totalGuests, int $familyGroups, int $friendGroups, array $codes): void
    {
        echo "\n";
        echo "✅ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "   INVITADOS CARGADOS CORRECTAMENTE\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        
        echo "📊 ESTADÍSTICAS:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "   • Total de grupos: {$totalGroups}\n";
        echo "   • Total de invitados: {$totalGuests}\n";
        echo "   • Grupos familiares: {$familyGroups}\n";
        echo "   • Grupos de amigos: {$friendGroups}\n\n";

        echo "🔑 PRIMEROS 15 CÓDIGOS:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        foreach (array_slice($codes, 0, 15) as $code) {
            $personas = $code['count'] === 1 ? 'persona' : 'personas';
            echo sprintf(
                "   %s  →  %-35s  (%d %s)\n",
                $code['code'],
                $code['name'],
                $code['count'],
                $personas
            );
        }
        
        if (count($codes) > 15) {
            echo "\n   ... y " . (count($codes) - 15) . " grupos más\n";
        }
        
        echo "\n💡 ACCIONES:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "   1. Ver todos los códigos: /admin/groups\n";
        echo "   2. Imprimir códigos: /admin/print/codes\n";
        echo "   3. Probar login invitado: /invitacion/login\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    }
}
