<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\WeddingSetting;
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
        $settings = WeddingSetting::current();

        if (!$settings) {
            // Fallback to default values if no settings exist
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
                'schedule' => [],
                'transport' => [
                    'buses_available' => true,
                    'buses_info' => 'Autobuses gratuitos desde Onda y Castellón',
                    'parking_available' => true,
                ],
            ];
        }

        return [
            'bride' => $settings->bride,
            'groom' => $settings->groom,
            'date' => $settings->wedding_date?->format('Y-m-d'),
            'civil_ceremony_date' => $settings->civil_ceremony_date?->format('Y-m-d'),
            'venue' => [
                'name' => $settings->venue_name,
                'address' => $settings->venue_address,
                'url' => $settings->venue_url,
                'parking' => $settings->venue_parking_info,
            ],
            'schedule' => $settings->schedule ?? [],
            'transport' => [
                'buses_available' => $settings->buses_available,
                'buses_info' => $settings->buses_info,
                'parking_available' => $settings->parking_available,
            ],
        ];
    }
}
