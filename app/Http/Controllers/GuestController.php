<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class GuestController extends Controller
{
    /**
     * Show the guest dashboard
     */
    public function dashboard()
    {
        $guestId = Session::get('guest_id');

        if (!$guestId) {
            return redirect()->route('login');
        }

        $guest = Guest::findOrFail($guestId);

        return Inertia::render('Guest/Dashboard', [
            'guest' => $guest,
            'weddingInfo' => $this->getWeddingInfo(),
        ]);
    }

    /**
     * Update guest RSVP and information
     */
    public function updateRsvp(Request $request)
    {
        $guestId = Session::get('guest_id');

        if (!$guestId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $guest = Guest::findOrFail($guestId);

        $validated = $request->validate([
            'confirmed' => 'required|boolean',
            'allergies' => 'nullable|string|max:500',
            'transport' => 'required|in:AUTOBUS,COCHE,NO_CONFIRMADO',
            'bus_onda_ida' => 'nullable|boolean',
            'bus_onda_vuelta' => 'nullable|boolean',
            'bus_cs' => 'nullable|boolean',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $guest->update([
            'confirmed' => $validated['confirmed'],
            'confirmed_at' => now(),
            'allergies' => $validated['allergies'] ?? null,
            'transport' => $validated['transport'],
            'bus_onda_ida' => $validated['bus_onda_ida'] ?? false,
            'bus_onda_vuelta' => $validated['bus_onda_vuelta'] ?? false,
            'bus_cs' => $validated['bus_cs'] ?? false,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
        ]);

        // TODO: Enviar email de confirmación si tiene email
        // TODO: Notificar a WhatsApp grupo

        return back()->with('success', '¡Gracias por confirmar tu asistencia!');
    }

    /**
     * Get wedding information
     */
    private function getWeddingInfo()
    {
        return [
            'bride' => 'Ana',
            'groom' => 'Alex',
            'date' => '2026-06-20',
            'civil_ceremony_date' => '2026-06-19',
            'venue' => [
                'name' => 'La Ópera Benicàssim',
                'url' => 'https://laoperabenicassim.com/',
                'address' => 'Benicàssim, Castellón',
                'parking' => 'Parking subterráneo privado gratuito',
            ],
            'schedule' => [
                [
                    'time' => '19:30',
                    'event' => 'Ceremonia Civil',
                    'description' => 'Oficiada por nuestros amigos',
                ],
                [
                    'time' => '21:00',
                    'event' => 'Cocktail y Buffé',
                    'description' => 'Al aire libre',
                ],
                [
                    'time' => '00:00',
                    'event' => 'Fiesta DJ',
                    'description' => 'En el salón',
                ],
            ],
            'transport' => [
                'buses_available' => true,
                'buses_schedule' => 'Por confirmar - próximamente',
                'parking_available' => true,
            ],
        ];
    }
}
