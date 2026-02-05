<?php

namespace App\Http\Middleware;

use App\Models\Guest;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $guestId = $request->session()->get('guest_id');

        if (!$guestId) {
            abort(403, 'No autorizado');
        }

        $guest = Guest::find($guestId);

        // Aceptar códigos ALEX o ANA como administradores
        if (!$guest || !in_array($guest->code, ['ALEX', 'ANA'])) {
            abort(403, 'Acceso solo para administradores (Alex y Ana)');
        }

        return $next($request);
    }
}
