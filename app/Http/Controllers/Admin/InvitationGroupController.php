<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CodeInvitationMail;
use App\Mail\CustomMessageMail;
use App\Mail\RsvpReminderMail;
use App\Models\Guest;
use App\Models\GuestQuestion;
use App\Models\InvitationGroup;
use App\Models\PushSubscription;
use App\Models\SongSuggestion;
use App\Models\WeddingSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class InvitationGroupController extends Controller
{
    /**
     * Dashboard principal del admin
     */
    public function dashboard()
    {
        $wedding = WeddingSetting::current();
        $daysUntil = $wedding?->wedding_date
            ? (int) now()->startOfDay()->diffInDays($wedding->wedding_date->startOfDay(), false)
            : null;

        $totalGroups = InvitationGroup::count();
        $submittedGroups = InvitationGroup::submitted()->count();
        $confirmedGroups = InvitationGroup::submitted()->whereHas('guests', fn ($q) => $q->where('attending', true))->count();
        $declinedGroups = InvitationGroup::submitted()->whereDoesntHave('guests', fn ($q) => $q->where('attending', true))->count();
        $pendingGroups = InvitationGroup::pending()->count();
        $responseRate = $totalGroups > 0 ? round(($submittedGroups / $totalGroups) * 100) : 0;

        $recentActivity = InvitationGroup::submitted()
            ->with('guests')
            ->orderByDesc('submitted_at')
            ->take(7)
            ->get()
            ->map(fn ($g) => [
                'id' => $g->id,
                'name' => $g->name,
                'submitted_at' => $g->submitted_at,
                'attending_count' => $g->attendingCount(),
                'total_count' => $g->guests->count(),
                'is_confirmed' => $g->attendingCount() > 0,
            ]);

        $recentQuestions = GuestQuestion::with('invitationGroup')
            ->orderByDesc('created_at')
            ->take(4)
            ->get()
            ->map(fn ($q) => [
                'id' => $q->id,
                'group_name' => $q->invitationGroup->name,
                'message' => $q->message,
                'created_at' => $q->created_at,
            ]);

        return Inertia::render('admin/dashboard', [
            'wedding' => $wedding ? [
                'bride' => $wedding->bride,
                'groom' => $wedding->groom,
                'wedding_date' => $wedding->wedding_date?->format('Y-m-d'),
                'venue_name' => $wedding->venue_name,
            ] : null,
            'days_until' => $daysUntil,
            'stats' => [
                'total_guests' => Guest::count(),
                'attending_guests' => Guest::attending()->count(),
                'not_attending_guests' => Guest::where('attending', false)->count(),
                'pending_guests' => Guest::whereNull('attending')->count(),
                'total_groups' => $totalGroups,
                'confirmed_groups' => $confirmedGroups,
                'declined_groups' => $declinedGroups,
                'pending_groups' => $pendingGroups,
                'submitted_groups' => $submittedGroups,
                'response_rate' => $responseRate,
            ],
            'alerts' => [
                'pending_with_email' => InvitationGroup::pending()->whereNotNull('contact_email')->count(),
                'without_transport' => InvitationGroup::submitted()
                    ->whereHas('guests', fn ($q) => $q->where('attending', true))
                    ->where(fn ($q) => $q->whereNull('transport')->orWhere('transport', 'NO_CONFIRMADO'))
                    ->count(),
                'with_allergies' => Guest::attending()->whereNotNull('allergies')->where('allergies', '!=', '')->count(),
                'songs_count' => SongSuggestion::count(),
                'questions_count' => GuestQuestion::count(),
            ],
            'transport' => [
                ['name' => 'Bus Onda ida',    'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_onda_ida', true))->count()],
                ['name' => 'Bus Onda vuelta', 'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_onda_vuelta', true))->count()],
                ['name' => 'Bus Castellón',   'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_cs', true))->count()],
                ['name' => 'Coche propio',    'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('transport', 'COCHE'))->count()],
                ['name' => 'Sin definir',     'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->whereNull('transport')->orWhere('transport', 'NO_CONFIRMADO'))->count()],
            ],
            'recent_activity' => $recentActivity,
            'recent_questions' => $recentQuestions,
        ]);
    }

    /**
     * Listar todos los grupos
     */
    public function index()
    {
        $groups = InvitationGroup::with([
            'guests',
            'visits' => fn ($q) => $q->orderByDesc('created_at'),
        ])
            ->withCount(['guests', 'visits'])
            ->orderBy('name')
            ->get()
            ->map(function ($group) {
                $lastVisit = $group->visits->first(); // desc order → most recent
                $firstVisit = $group->visits->last();  // desc order → oldest

                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'code' => $group->code,
                    'type' => $group->type,
                    'guests_count' => $group->guests_count,
                    'attending_count' => $group->attendingCount(),
                    'submitted_at' => $group->submitted_at,
                    'has_submitted' => $group->hasSubmitted(),
                    'contact_email' => $group->contact_email,
                    'invitation_sent_at' => $group->invitation_sent_at,
                    'reminder_sent_at' => $group->reminder_sent_at,
                    'printed_at' => $group->printed_at,
                    'delivered_at' => $group->delivered_at,
                    'visits_count' => $group->visits_count,
                    'first_visited_at' => $firstVisit?->created_at,
                    'last_visited_at' => $lastVisit?->created_at,
                    'last_device' => $lastVisit?->device,
                ];
            });

        $accessedGroupsCount = InvitationGroup::has('visits')->count();

        $stats = [
            'total_groups' => InvitationGroup::count(),
            'submitted_groups' => InvitationGroup::submitted()->count(),
            'pending_groups' => InvitationGroup::pending()->count(),
            'total_guests' => Guest::count(),
            'attending_guests' => Guest::attending()->count(),
            'confirmed_groups' => InvitationGroup::submitted()->whereHas('guests', fn ($q) => $q->where('attending', true))->count(),
            'pending_with_email' => InvitationGroup::pending()->whereNotNull('contact_email')->count(),
            'accessed_groups' => $accessedGroupsCount,
            'not_accessed_groups' => InvitationGroup::count() - $accessedGroupsCount,
        ];

        $chartData = [
            'attendance' => [
                ['name' => 'Confirmados', 'value' => Guest::attending()->count(), 'color' => '#22c55e'],
                ['name' => 'No asisten', 'value' => Guest::where('attending', false)->count(), 'color' => '#f87171'],
                ['name' => 'Pendientes', 'value' => Guest::whereNull('attending')->count(), 'color' => '#d1d5db'],
            ],
            'transport' => [
                ['name' => 'Bus Onda (ida)',    'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_onda_ida', true))->count()],
                ['name' => 'Bus Onda (vuelta)', 'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_onda_vuelta', true))->count()],
                ['name' => 'Bus Castellón',     'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_cs', true))->count()],
                ['name' => 'Coche',             'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('transport', 'COCHE'))->count()],
                ['name' => 'Sin definir',       'value' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->whereNull('transport')->orWhere('transport', 'NO_CONFIRMADO'))->count()],
            ],
            'group_types' => [
                ['name' => 'Familiar', 'value' => InvitationGroup::where('type', 'FAMILIAR')->count(), 'color' => '#8b7355'],
                ['name' => 'Amigos', 'value' => InvitationGroup::where('type', 'AMIGO')->count(), 'color' => '#c4a571'],
            ],
        ];

        return Inertia::render('admin/groups/index', [
            'groups' => $groups,
            'stats' => $stats,
            'chartData' => $chartData,
        ]);
    }

    /**
     * Mostrar formulario para crear grupo
     */
    public function create()
    {
        return Inertia::render('admin/groups/create');
    }

    /**
     * Guardar nuevo grupo
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:FAMILIAR,AMIGO',
            'default_language' => 'nullable|in:es,pt-BR,fr',
            'guests' => 'required|array|min:1',
            'guests.*.name' => 'required|string|max:255',
            'guests.*.gender' => 'nullable|in:HOMBRE,MUJER',
        ]);

        // Crear grupo con código único
        $group = InvitationGroup::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'code' => InvitationGroup::generateUniqueCode(),
            'default_language' => $validated['default_language'] ?? null,
        ]);

        // Crear invitados del grupo
        foreach ($validated['guests'] as $guestData) {
            Guest::create([
                'invitation_group_id' => $group->id,
                'name' => $guestData['name'],
                'gender' => $guestData['gender'] ?? null,
            ]);
        }

        return redirect()
            ->route('admin.groups.index')
            ->with('success', "Grupo '{$group->name}' creado con código: {$group->code}");
    }

    /**
     * Mostrar detalle de un grupo
     */
    public function show(InvitationGroup $group)
    {
        $group->load(['guests', 'visits' => fn ($q) => $q->orderByDesc('created_at')]);

        return Inertia::render('admin/groups/show', [
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'code' => $group->code,
                'type' => $group->type,
                'submitted_at' => $group->submitted_at,
                'transport' => $group->transport,
                'bus_onda_ida' => $group->bus_onda_ida,
                'bus_onda_vuelta' => $group->bus_onda_vuelta,
                'bus_cs' => $group->bus_cs,
                'contact_email' => $group->contact_email,
                'contact_phone' => $group->contact_phone,
                'notes' => $group->notes,
                'default_language' => $group->default_language,
                'invitation_sent_at' => $group->invitation_sent_at,
                'reminder_sent_at' => $group->reminder_sent_at,
                'guests' => $group->guests->map(function ($guest) {
                    return [
                        'id' => $guest->id,
                        'name' => $guest->name,
                        'gender' => $guest->gender,
                        'attending' => $guest->attending,
                        'allergies' => $guest->allergies,
                    ];
                }),
                'visits' => $group->visits->map(fn ($v) => [
                    'id' => $v->id,
                    'device' => $v->device,
                    'browser' => $v->browser,
                    'os' => $v->os,
                    'created_at' => $v->created_at,
                ]),
            ],
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(InvitationGroup $group)
    {
        $group->load('guests');

        return Inertia::render('admin/groups/edit', [
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'code' => $group->code,
                'type' => $group->type,
                'notes' => $group->notes,
                'default_language' => $group->default_language,
                'guests' => $group->guests,
            ],
        ]);
    }

    /**
     * Actualizar grupo
     */
    public function update(Request $request, InvitationGroup $group)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:FAMILIAR,AMIGO',
            'notes' => 'nullable|string',
            'default_language' => 'nullable|in:es,pt-BR,fr',
            'guests' => 'required|array|min:1',
            'guests.*.id' => 'nullable|exists:guests,id',
            'guests.*.name' => 'required|string|max:255',
            'guests.*.gender' => 'nullable|in:HOMBRE,MUJER',
        ]);

        // Actualizar grupo
        $group->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'notes' => $validated['notes'] ?? null,
            'default_language' => $validated['default_language'] ?? null,
        ]);

        // IDs de invitados a mantener
        $guestIdsToKeep = [];

        // Actualizar/crear invitados
        foreach ($validated['guests'] as $guestData) {
            if (isset($guestData['id'])) {
                // Actualizar existente
                $guest = Guest::find($guestData['id']);
                $guest->update([
                    'name' => $guestData['name'],
                    'gender' => $guestData['gender'] ?? null,
                ]);
                $guestIdsToKeep[] = $guest->id;
            } else {
                // Crear nuevo
                $guest = Guest::create([
                    'invitation_group_id' => $group->id,
                    'name' => $guestData['name'],
                    'gender' => $guestData['gender'] ?? null,
                ]);
                $guestIdsToKeep[] = $guest->id;
            }
        }

        // Eliminar invitados que ya no están en la lista
        $group->guests()->whereNotIn('id', $guestIdsToKeep)->delete();

        return redirect()
            ->route('admin.groups.index')
            ->with('success', "Grupo '{$group->name}' actualizado correctamente");
    }

    /**
     * Eliminar grupo
     */
    public function destroy(InvitationGroup $group)
    {
        $name = $group->name;
        $group->delete();

        return redirect()
            ->route('admin.groups.index')
            ->with('success', "Grupo '{$name}' eliminado correctamente");
    }

    /**
     * Listar preguntas de invitados
     */
    public function questions()
    {
        $questions = GuestQuestion::with('invitationGroup')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($q) => [
                'id' => $q->id,
                'group_name' => $q->invitationGroup->name,
                'message' => $q->message,
                'created_at' => $q->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('admin/questions/index', [
            'questions' => $questions,
        ]);
    }

    /**
     * Marcar o desmarcar invitación como impresa
     */
    public function togglePrinted(InvitationGroup $group)
    {
        $group->update(['printed_at' => $group->printed_at ? null : now()]);

        $msg = $group->printed_at
            ? "'{$group->name}' marcado como preparado"
            : "'{$group->name}' desmarcado como preparado";

        return back()->with('success', $msg);
    }

    /**
     * Marcar o desmarcar invitación como entregada
     */
    public function toggleDelivered(InvitationGroup $group)
    {
        $group->update(['delivered_at' => $group->delivered_at ? null : now()]);

        $msg = $group->delivered_at
            ? "'{$group->name}' marcado como entregado"
            : "'{$group->name}' desmarcado como entregado";

        return back()->with('success', $msg);
    }

    /**
     * Marcar o desmarcar invitación como enviada (sin enviar email)
     */
    public function toggleInvitationSent(InvitationGroup $group)
    {
        $group->update([
            'invitation_sent_at' => $group->invitation_sent_at ? null : now(),
        ]);

        $msg = $group->invitation_sent_at
            ? "'{$group->name}' marcado como invitación enviada"
            : "'{$group->name}' desmarcado como invitación enviada";

        return back()->with('success', $msg);
    }

    /**
     * Regenerar código de un grupo
     */
    public function regenerateCode(InvitationGroup $group)
    {
        $oldCode = $group->code;
        $group->update([
            'code' => InvitationGroup::generateUniqueCode(),
        ]);

        return back()->with('success', "Código regenerado: {$oldCode} → {$group->code}");
    }

    /**
     * Enviar email de invitación con código a un grupo
     */
    public function sendInvitation(InvitationGroup $group)
    {
        if (! $group->contact_email) {
            return back()->with('error', "El grupo '{$group->name}' no tiene email de contacto.");
        }

        try {
            Mail::to($group->contact_email)->queue(new CodeInvitationMail($group));
            $group->update(['invitation_sent_at' => now()]);

            return back()->with('success', "Invitación enviada a {$group->contact_email}");
        } catch (\Exception $e) {
            return back()->with('error', "Error al enviar el email: {$e->getMessage()}");
        }
    }

    /**
     * Enviar recordatorio bulk a todos los grupos pendientes con email
     */
    public function sendReminders()
    {
        $groups = InvitationGroup::pending()
            ->whereNotNull('contact_email')
            ->get();

        if ($groups->isEmpty()) {
            return back()->with('error', 'No hay grupos pendientes con email de contacto.');
        }

        $sent = 0;
        $errors = 0;

        foreach ($groups as $group) {
            try {
                Mail::to($group->contact_email)->queue(new RsvpReminderMail($group));
                $group->update(['reminder_sent_at' => now()]);
                $sent++;
            } catch (\Exception $e) {
                $errors++;
            }
        }

        $message = "Recordatorios enviados: {$sent}";
        if ($errors > 0) {
            $message .= " ({$errors} con error)";
        }

        return back()->with('success', $message);
    }

    /**
     * Enviar mensaje personalizado a grupos seleccionados
     */
    public function sendCustomMessage(Request $request)
    {
        $validated = $request->validate([
            'group_ids' => 'required|array|min:1',
            'group_ids.*' => 'integer|exists:invitation_groups,id',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:5000',
        ]);

        $groups = InvitationGroup::whereIn('id', $validated['group_ids'])
            ->whereNotNull('contact_email')
            ->get();

        if ($groups->isEmpty()) {
            return back()->with('error', 'Ninguno de los grupos seleccionados tiene email de contacto.');
        }

        $sent = 0;
        $errors = 0;

        foreach ($groups as $group) {
            try {
                Mail::to($group->contact_email)
                    ->queue(new CustomMessageMail($group, $validated['subject'], $validated['message']));
                $sent++;
            } catch (\Exception $e) {
                $errors++;
            }
        }

        $msg = "Mensaje enviado a {$sent} grupo".($sent !== 1 ? 's' : '');
        if ($errors) {
            $msg .= " ({$errors} con error)";
        }

        return back()->with('success', $msg);
    }

    /**
     * Enviar notificación push a grupos seleccionados
     */
    public function sendPushNotification(Request $request)
    {
        $validated = $request->validate([
            'group_ids' => 'required|array|min:1',
            'group_ids.*' => 'integer|exists:invitation_groups,id',
            'title' => 'required|string|max:100',
            'body' => 'required|string|max:500',
        ]);

        $subscriptions = PushSubscription::whereIn('invitation_group_id', $validated['group_ids'])->get();

        if ($subscriptions->isEmpty()) {
            return back()->with('error', 'Ninguno de los grupos seleccionados tiene dispositivos suscritos a notificaciones push.');
        }

        $auth = [
            'VAPID' => [
                'subject' => config('webpush.vapid.subject'),
                'publicKey' => config('webpush.vapid.public_key'),
                'privateKey' => config('webpush.vapid.private_key'),
            ],
        ];

        $webPush = new WebPush($auth);
        $payload = json_encode(['title' => 'Boda Ana & Alex - '.$validated['title'], 'body' => $validated['body']]);

        $staleIds = [];

        foreach ($subscriptions as $sub) {
            $subscription = Subscription::create([
                'endpoint' => $sub->endpoint,
                'keys' => [
                    'p256dh' => $sub->p256dh,
                    'auth' => $sub->auth,
                ],
            ]);
            $webPush->queueNotification($subscription, $payload);
        }

        $sent = 0;
        $errors = 0;

        foreach ($webPush->flush() as $report) {
            if ($report->isSuccess()) {
                $sent++;
            } else {
                $errors++;
                // Remove stale subscriptions (410 Gone or 404 Not Found)
                if ($report->getResponse() && in_array($report->getResponse()->getStatusCode(), [404, 410])) {
                    $staleIds[] = $report->getRequest()->getUri()->__toString();
                }
            }
        }

        if (! empty($staleIds)) {
            PushSubscription::whereIn('endpoint', $staleIds)->delete();
        }

        $msg = "Push enviado a {$sent} dispositivo".($sent !== 1 ? 's' : '');
        if ($errors > 0) {
            $msg .= " ({$errors} con error)";
        }

        return back()->with('success', $msg);
    }

    /**
     * Vista imprimible de códigos por grupo
     */
    public function printCodes()
    {
        $groups = InvitationGroup::with('guests')
            ->orderBy('name')
            ->get()
            ->map(fn ($g) => [
                'id' => $g->id,
                'name' => $g->name,
                'code' => $g->code,
                'guests' => $g->guests->pluck('name')->join(', '),
                'printed_at' => $g->printed_at,
                'delivered_at' => $g->delivered_at,
            ]);

        return Inertia::render('admin/printable-codes', [
            'groups' => $groups,
        ]);
    }

    /**
     * Actualizar RSVP completo de un grupo desde admin (attending individual, alergias, transporte, contacto)
     */
    public function adminUpdateRsvp(Request $request, InvitationGroup $group)
    {
        $validated = $request->validate([
            'transport' => 'nullable|in:AUTOBUS,COCHE,NO_CONFIRMADO',
            'bus_onda_ida' => 'boolean',
            'bus_onda_vuelta' => 'boolean',
            'bus_cs' => 'boolean',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:2000',
            'guests' => 'array',
            'guests.*.id' => 'required|exists:guests,id',
            'guests.*.attending' => 'nullable|boolean',
            'guests.*.allergies' => 'nullable|string|max:500',
        ]);

        $group->update([
            'transport' => $validated['transport'] ?? null,
            'bus_onda_ida' => $validated['bus_onda_ida'] ?? false,
            'bus_onda_vuelta' => $validated['bus_onda_vuelta'] ?? false,
            'bus_cs' => $validated['bus_cs'] ?? false,
            'contact_email' => $validated['contact_email'] ?? null,
            'contact_phone' => $validated['contact_phone'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($validated['guests'] ?? [] as $guestData) {
            $guest = Guest::find($guestData['id']);
            if ($guest && $guest->invitation_group_id === $group->id) {
                $guest->update([
                    'attending' => $guestData['attending'],
                    'allergies' => $guestData['allergies'] ?: null,
                ]);
            }
        }

        $group->refresh();
        $anyResponded = $group->guests()->whereNotNull('attending')->exists();

        if ($anyResponded && ! $group->submitted_at) {
            $group->update(['submitted_at' => now()]);
        } elseif (! $anyResponded && $group->submitted_at) {
            $group->update(['submitted_at' => null]);
        }

        return back()->with('success', "RSVP de '{$group->name}' actualizado correctamente");
    }

    /**
     * Eliminar una pregunta de invitado
     */
    public function destroyQuestion(GuestQuestion $question)
    {
        $question->delete();

        return back()->with('success', 'Pregunta eliminada');
    }

    /**
     * Exportar alergias para catering como CSV
     */
    public function exportAllergies()
    {
        $guests = Guest::attending()
            ->whereNotNull('allergies')
            ->where('allergies', '!=', '')
            ->with('invitationGroup')
            ->orderBy('name')
            ->get();

        $rows = ['Invitado,Alergias/Restricciones,Grupo,Transporte'];
        foreach ($guests as $guest) {
            $transport = match ($guest->invitationGroup->transport) {
                'AUTOBUS' => 'Autobús',
                'COCHE' => 'Coche propio',
                'NO_CONFIRMADO' => 'Sin confirmar',
                default => '—',
            };
            $rows[] = implode(',', [
                "\"{$guest->name}\"",
                "\"{$guest->allergies}\"",
                "\"{$guest->invitationGroup->name}\"",
                $transport,
            ]);
        }

        $filename = 'alergias-boda-'.now()->format('Y-m-d').'.csv';

        return response(implode("\n", $rows), 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Confirmar RSVP de un grupo desde el admin (todos asisten)
     */
    public function adminConfirm(InvitationGroup $group)
    {
        $group->guests()->update(['attending' => true]);
        if (! $group->submitted_at) {
            $group->update(['submitted_at' => now()]);
        }

        return back()->with('success', "'{$group->name}' marcado como confirmado");
    }

    /**
     * Rechazar RSVP de un grupo desde el admin (nadie asiste)
     */
    public function adminDecline(InvitationGroup $group)
    {
        $group->guests()->update(['attending' => false, 'allergies' => null]);
        $group->update([
            'submitted_at' => $group->submitted_at ?? now(),
            'transport' => 'NO_CONFIRMADO',
            'bus_onda_ida' => false,
            'bus_onda_vuelta' => false,
            'bus_cs' => false,
        ]);

        return back()->with('success', "'{$group->name}' marcado como rechazado");
    }

    /**
     * Resetear RSVP de un grupo a pendiente
     */
    public function adminResetRsvp(InvitationGroup $group)
    {
        $group->guests()->update(['attending' => null]);
        $group->update(['submitted_at' => null]);

        return back()->with('success', "'{$group->name}' restablecido a pendiente");
    }

    /**
     * Vista de grupos confirmados con sus invitados
     */
    public function confirmedGuests()
    {
        $groups = InvitationGroup::submitted()
            ->whereHas('guests', fn ($q) => $q->where('attending', true))
            ->with('guests')
            ->orderByDesc('submitted_at')
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'type' => $group->type,
                    'submitted_at' => $group->submitted_at,
                    'transport' => $group->transport,
                    'bus_onda_ida' => $group->bus_onda_ida,
                    'bus_onda_vuelta' => $group->bus_onda_vuelta,
                    'bus_cs' => $group->bus_cs,
                    'contact_email' => $group->contact_email,
                    'contact_phone' => $group->contact_phone,
                    'attending_count' => $group->attendingCount(),
                    'total_count' => $group->guests->count(),
                    'guests' => $group->guests->map(fn ($g) => [
                        'id' => $g->id,
                        'name' => $g->name,
                        'attending' => $g->attending,
                        'allergies' => $g->allergies,
                    ]),
                ];
            });

        $stats = [
            'total_confirmed_groups' => InvitationGroup::submitted()->whereHas('guests', fn ($q) => $q->where('attending', true))->count(),
            'total_attending' => Guest::attending()->count(),
            'total_not_attending' => Guest::where('attending', false)->count(),
            'with_allergies' => Guest::attending()->whereNotNull('allergies')->where('allergies', '!=', '')->count(),
            'bus_onda_ida' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_onda_ida', true))->count(),
            'bus_onda_vuelta' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_onda_vuelta', true))->count(),
            'bus_cs' => Guest::attending()->whereHas('invitationGroup', fn ($q) => $q->where('bus_cs', true))->count(),
        ];

        return Inertia::render('admin/confirmed', [
            'groups' => $groups,
            'stats' => $stats,
        ]);
    }

    /**
     * Exportar confirmados como CSV
     */
    public function exportConfirmed()
    {
        $groups = InvitationGroup::submitted()->with('guests')->orderByDesc('submitted_at')->get();

        $rows = ['Grupo,Tipo,Confirmado el,Asisten,Total,Transporte,Bus Onda Ida,Bus Onda Vuelta,Bus Castellón,Email,Teléfono,Invitado,Asiste,Alergias'];
        foreach ($groups as $group) {
            foreach ($group->guests as $guest) {
                $attending = match ($guest->attending) {
                    true => 'Sí',
                    false => 'No',
                    default => 'Sin responder',
                };
                $rows[] = implode(',', [
                    "\"{$group->name}\"",
                    $group->type,
                    $group->submitted_at?->format('d/m/Y H:i'),
                    $group->attendingCount(),
                    $group->guests->count(),
                    $group->transport ?? '',
                    $group->bus_onda_ida ? 'Sí' : 'No',
                    $group->bus_onda_vuelta ? 'Sí' : 'No',
                    $group->bus_cs ? 'Sí' : 'No',
                    "\"{$group->contact_email}\"",
                    "\"{$group->contact_phone}\"",
                    "\"{$guest->name}\"",
                    $attending,
                    "\"{$guest->allergies}\"",
                ]);
            }
        }

        $filename = 'confirmados-boda-'.now()->format('Y-m-d').'.csv';

        return response(implode("\n", $rows), 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Exportar códigos como CSV
     */
    public function exportCodes()
    {
        $groups = InvitationGroup::with('guests')->orderBy('name')->get();

        $rows = ['Grupo,Código,Invitados'];
        foreach ($groups as $group) {
            $guests = $group->guests->pluck('name')->join(' / ');
            $rows[] = "\"{$group->name}\",{$group->code},\"{$guests}\"";
        }

        $filename = 'codigos-boda-'.now()->format('Y-m-d').'.csv';

        return response(implode("\n", $rows), 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
