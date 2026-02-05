<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\InvitationGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class GuestDashboardController extends Controller
{
    /**
     * Obtener grupo autenticado
     */
    private function getAuthenticatedGroup()
    {
        $groupId = Session::get('invitation_group_id');

        if (!$groupId) {
            abort(403, 'No autorizado');
        }

        $group = InvitationGroup::with('guests')->find($groupId);

        if (!$group) {
            abort(404, 'Grupo no encontrado');
        }

        return $group;
    }

    /**
     * Mostrar dashboard
     */
    public function index()
    {
        $group = $this->getAuthenticatedGroup();

        // Información de la boda
        $weddingInfo = $this->getWeddingInfo();

        return Inertia::render('Dashboard.jsx', [
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'code' => $group->code,
                'type' => $group->type,
                'confirmed_at' => $group->confirmed_at,
                'transport' => $group->transport,
                'bus_onda_ida' => $group->bus_onda_ida,
                'bus_onda_vuelta' => $group->bus_onda_vuelta,
                'bus_cs' => $group->bus_cs,
                'contact_email' => $group->contact_email,
                'contact_phone' => $group->contact_phone,
                'guests' => $group->guests->map(fn($g) => [
                    'id' => $g->id,
                    'name' => $g->name,
                    'gender' => $g->gender,
                    'attending' => $g->attending,
                    'allergies' => $g->allergies,
                ]),
            ],
            'weddingInfo' => $weddingInfo,
        ]);
    }

    /**
     * Guardar confirmación
     */
    public function confirm(Request $request)
    {
        $group = $this->getAuthenticatedGroup();

        $validated = $request->validate([
            'guests' => 'required|array',
            'guests.*.id' => 'required|exists:guests,id',
            'guests.*.attending' => 'required|boolean',
            'guests.*.allergies' => 'nullable|string|max:500',
            'transport' => 'required|in:AUTOBUS,COCHE,NO_CONFIRMADO',
            'bus_onda_ida' => 'boolean',
            'bus_onda_vuelta' => 'boolean',
            'bus_cs' => 'boolean',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($group, $validated) {
            // Actualizar invitados individuales
            foreach ($validated['guests'] as $guestData) {
                $guest = $group->guests()->find($guestData['id']);

                if ($guest) {
                    $guest->update([
                        'attending' => $guestData['attending'],
                        'allergies' => $guestData['allergies'] ?? null,
                    ]);
                }
            }

            // Actualizar información del grupo
            $group->update([
                'confirmed_at' => now(),
                'transport' => $validated['transport'],
                'bus_onda_ida' => $validated['bus_onda_ida'] ?? false,
                'bus_onda_vuelta' => $validated['bus_onda_vuelta'] ?? false,
                'bus_cs' => $validated['bus_cs'] ?? false,
                'contact_email' => $validated['contact_email'] ?? null,
                'contact_phone' => $validated['contact_phone'] ?? null,
            ]);
        });

        return back()->with('success', '¡Gracias por confirmar! Nos vemos el 20 de junio 🌴💝');
    }

    /**
     * Información de la boda
     */
    private function getWeddingInfo(): array
    {
        return [
            'bride' => 'Ana',
            'groom' => 'Alex',
            'date' => '2026-06-20',
            'civil_ceremony_date' => '2026-06-19',
            'venue' => [
                'name' => 'La Ópera',
                'address' => 'Benicàssim, Castellón',
                'url' => 'https://laoperabenicassim.com/',
                'parking' => 'Parking subterráneo gratuito disponible',
            ],
            'schedule' => [
                [
                    'time' => '14:00',
                    'event' => 'Ceremonia Civil',
                    'description' => 'Ceremonia oficiada por nuestros amigos',
                ],
                [
                    'time' => '14:30',
                    'event' => 'Cocktail & Buffet',
                    'description' => 'Al aire libre en los jardines',
                ],
                [
                    'time' => '00:00',
                    'event' => 'Fiesta DJ',
                    'description' => 'En el salón principal',
                ],
            ],
            'transport' => [
                'buses_available' => true,
                'buses_info' => 'Autobuses gratuitos desde Onda y Castellón (horarios por confirmar)',
                'parking_available' => true,
            ],
        ];
    }
}
