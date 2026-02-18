<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WeddingSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
                'schedule_needs_translation' => $settings->schedule_needs_translation,
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

        $validated['schedule_needs_translation'] = true;

        if ($settings) {
            $settings->update($validated);
        } else {
            WeddingSetting::create(array_merge($validated, ['is_active' => true]));
        }

        return redirect()->back()->with('success', 'Configuración guardada. ⚠️ Recuerda actualizar las traducciones del programa.');
    }

    /**
     * Translate the wedding schedule using Claude API.
     */
    public function translateSchedule()
    {
        $apiKey = config('services.anthropic.key');

        if (!$apiKey) {
            return back()->withErrors(['translate' => 'Falta ANTHROPIC_API_KEY en el fichero .env']);
        }

        $settings = WeddingSetting::current();

        if (!$settings || empty($settings->schedule)) {
            return back()->withErrors(['translate' => 'No hay programa que traducir.']);
        }

        $languages = [
            'pt-BR' => 'Português do Brasil',
            'fr'    => 'Français',
        ];

        foreach ($languages as $code => $name) {
            $response = Http::timeout(60)->withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-haiku-4-5-20251001',
                'max_tokens' => 4096,
                'messages' => [[
                    'role' => 'user',
                    'content' =>
                        "Eres un traductor para una web de invitación de boda elegante. "
                        . "Traduce este programa de boda del español a $name. "
                        . "Devuelve ÚNICAMENTE un array JSON válido con la misma estructura. "
                        . "Traduce solo los campos 'event', 'description' y los strings del array 'details'. No traduzcas el campo 'time'. Sin bloques de código, solo JSON puro.\n\n"
                        . json_encode($settings->schedule),
                ]],
            ]);

            if ($response->failed()) {
                return back()->withErrors(['translate' => "Error al llamar a la API de Claude: " . $response->status()]);
            }

            $raw = $response->json('content.0.text', '');
            $raw = preg_replace('/^```(?:json)?\s*/m', '', $raw);
            $raw = preg_replace('/\s*```$/m', '', $raw);
            $translated = json_decode(trim($raw), true);

            if (!is_array($translated)) {
                return back()->withErrors(['translate' => "La respuesta de Claude no es JSON válido para $name."]);
            }

            $translations = $settings->schedule_translations ?? [];
            $translations[$code] = $translated;
            $settings->update(['schedule_translations' => $translations]);
        }

        $settings->update(['schedule_needs_translation' => false]);

        return back()->with('success', '✅ Programa del día traducido correctamente al PT y FR.');
    }
}
