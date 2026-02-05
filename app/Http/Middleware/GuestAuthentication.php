<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class GuestAuthentication
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Session::has('invitation_group_id')) {
            return redirect()->route('guest.login')
                ->with('error', 'Por favor, introduce tu código de invitación');
        }

        return $next($request);
    }
}
