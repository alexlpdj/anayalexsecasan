<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WeddingSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeddingSettingsController extends Controller
{
    /**
     * Show the form for editing the wedding settings.
     */
    public function edit()
    {
        $settings = WeddingSetting::current();

        // If no settings exist, create default ones
        if (!$settings) {
            $settings = WeddingSetting::create([
                'bride' => 'Novia',
                'groom' => 'Novio',
                'wedding_date' => now()->addMonths(6),
                'venue_name' => 'Nombre del Lugar',
                'venue_address' => 'Dirección',
                'schedule' => [],
                'buses_available' => false,
                'parking_available' => false,
                'is_active' => true,
            ]);
        }

        return Inertia::render('admin/settings/wedding-edit', [
            'settings' => [
                'id' => $settings->id,
                'bride' => $settings->bride,
                'groom' => $settings->groom,
                'wedding_date' => $settings->wedding_date?->format('Y-m-d'),
                'civil_ceremony_date' => $settings->civil_ceremony_date?->format('Y-m-d'),
                'venue_name' => $settings->venue_name,
                'venue_address' => $settings->venue_address,
                'venue_url' => $settings->venue_url,
                'venue_parking_info' => $settings->venue_parking_info,
                'schedule' => $settings->schedule ?? [],
                'buses_available' => $settings->buses_available,
                'buses_info' => $settings->buses_info,
                'parking_available' => $settings->parking_available,
            ],
        ]);
    }

    /**
     * Update the wedding settings in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'bride' => 'required|string|max:100',
            'groom' => 'required|string|max:100',
            'wedding_date' => 'required|date',
            'civil_ceremony_date' => 'nullable|date|before:wedding_date',
            'venue_name' => 'required|string|max:255',
            'venue_address' => 'required|string|max:500',
            'venue_url' => 'nullable|url',
            'venue_parking_info' => 'nullable|string|max:500',
            'schedule' => 'required|array|min:1',
            'schedule.*.time' => 'required|string',
            'schedule.*.event' => 'required|string|max:100',
            'schedule.*.description' => 'nullable|string|max:255',
            'schedule.*.details' => 'nullable|array',
            'schedule.*.details.*' => 'string|max:255',
            'buses_available' => 'boolean',
            'buses_info' => 'nullable|string|max:500',
            'parking_available' => 'boolean',
        ]);

        $settings = WeddingSetting::current();

        if ($settings) {
            $settings->update($validated);
        } else {
            WeddingSetting::create(array_merge($validated, ['is_active' => true]));
        }

        return redirect()->back()->with('success', 'Configuración de la boda actualizada correctamente');
    }
}
