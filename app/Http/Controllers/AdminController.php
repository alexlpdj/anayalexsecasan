<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Check if user is admin
     */
    private function checkAdmin()
    {
        $guestId = Session::get('guest_id');

        if (!$guestId) {
            abort(403);
        }

        $guest = Guest::find($guestId);

        // Aceptar códigos ALEX o ANA
        if (!$guest || !in_array($guest->code, ['ALEX', 'ANA'])) {
            abort(403);
        }

        return $guest;
    }

    /**
     * Show admin dashboard
     */
    public function dashboard()
    {
        $this->checkAdmin();

        // Excluir novios de las estadísticas (solo invitados)
        $stats = [
            'total' => Guest::where('type', '!=', 'NOVIOS')->count(),
            'confirmed' => Guest::where('type', '!=', 'NOVIOS')->where('confirmed', true)->count(),
            'declined' => Guest::where('type', '!=', 'NOVIOS')->where('confirmed', false)->count(),
            'pending' => Guest::where('type', '!=', 'NOVIOS')->whereNull('confirmed')->count(),
            'with_allergies' => Guest::where('type', '!=', 'NOVIOS')
                ->whereNotNull('allergies')
                ->where('allergies', '!=', '')
                ->count(),
            'need_bus' => Guest::where('type', '!=', 'NOVIOS')->where('transport', 'AUTOBUS')->count(),
        ];

        // Solo mostrar invitados (no novios)
        $guests = Guest::where('type', '!=', 'NOVIOS')
            ->orderBy('name')
            ->get();

        $allergies = Guest::where('type', '!=', 'NOVIOS')
            ->whereNotNull('allergies')
            ->where('allergies', '!=', '')
            ->where('confirmed', true)
            ->select('name', 'allergies')
            ->get();

        $transport = [
            'bus_onda_ida' => Guest::where('type', '!=', 'NOVIOS')->where('bus_onda_ida', true)->count(),
            'bus_onda_vuelta' => Guest::where('type', '!=', 'NOVIOS')->where('bus_onda_vuelta', true)->count(),
            'bus_cs' => Guest::where('type', '!=', 'NOVIOS')->where('bus_cs', true)->count(),
            'own_car' => Guest::where('type', '!=', 'NOVIOS')->where('transport', 'COCHE')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'guests' => $guests,
            'allergies' => $allergies,
            'transport' => $transport,
        ]);
    }

    /**
     * Export guests data
     */
    public function export()
    {
        $this->checkAdmin();

        // Solo exportar invitados (no novios)
        $guests = Guest::where('type', '!=', 'NOVIOS')->orderBy('name')->get();

        $csv = "Nombre,Tipo,Confirmado,Email,Teléfono,Alergias,Transporte,Bus Onda Ida,Bus Onda Vuelta,Bus CS\n";

        foreach ($guests as $guest) {
            $csv .= sprintf(
                '"%s","%s","%s","%s","%s","%s","%s","%s","%s","%s"' . "\n",
                $guest->name,
                $guest->type,
                $guest->confirmed === null ? 'Pendiente' : ($guest->confirmed ? 'Sí' : 'No'),
                $guest->email ?? '',
                $guest->phone ?? '',
                $guest->allergies ?? '',
                $guest->transport,
                $guest->bus_onda_ida ? 'Sí' : 'No',
                $guest->bus_onda_vuelta ? 'Sí' : 'No',
                $guest->bus_cs ? 'Sí' : 'No'
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="invitados-' . date('Y-m-d') . '.csv"');
    }

    /**
     * Update guest notes (admin only)
     */
    public function updateNotes(Request $request, Guest $guest)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $guest->update(['notes' => $validated['notes']]);

        return back()->with('success', 'Notas actualizadas');
    }

    /**
     * Generate printable codes
     */
    public function printableCodes()
    {
        $this->checkAdmin();

        // Solo códigos de invitados (no novios)
        $guests = Guest::where('type', '!=', 'NOVIOS')
            ->orderBy('name')
            ->select('name', 'code')
            ->get();

        return Inertia::render('Admin/PrintableCodes', [
            'guests' => $guests,
        ]);
    }
}
