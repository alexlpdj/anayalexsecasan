<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\GuestVisit;
use App\Models\InvitationGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class GuestAuthController extends Controller
{
    /**
     * Mostrar página de login
     */
    public function showLogin()
    {
        // Si ya está autenticado, redirigir a dashboard
        if (Session::has('invitation_group_id')) {
            return redirect()->route('guest.dashboard');
        }

        return Inertia::render('Guest/Login');
    }

    /**
     * Procesar login con código
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|size:4',
        ], [
            'code.required' => 'Por favor, introduce tu código de invitación',
            'code.size' => 'El código debe tener 4 caracteres',
        ]);

        // Buscar grupo por código
        $group = InvitationGroup::where('code', strtoupper($validated['code']))
            ->first();

        if (!$group) {
            return back()->withErrors([
                'code' => 'Código no válido. Verifica que está escrito correctamente.',
            ]);
        }

        // Guardar en sesión
        Session::put('invitation_group_id', $group->id);

        // Registrar visita (single INSERT, no bloquea la respuesta)
        $parsed = GuestVisit::parseUserAgent($request->userAgent() ?? '');
        GuestVisit::create([
            'group_id'   => $group->id,
            'device'     => $parsed['device'],
            'browser'    => $parsed['browser'],
            'os'         => $parsed['os'],
            'created_at' => now(),
        ]);

        return redirect()->route('guest.dashboard');
    }

    /**
     * Cerrar sesión
     */
    public function logout()
    {
        Session::forget('invitation_group_id');

        return redirect()->route('guest.login')
            ->with('success', 'Sesión cerrada correctamente');
    }
}
