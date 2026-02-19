<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CodeInvitationMail;
use App\Mail\CustomMessageMail;
use App\Mail\RsvpReminderMail;
use App\Models\GuestQuestion;
use App\Models\InvitationGroup;
use App\Models\Guest;
use App\Models\PushSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class InvitationGroupController extends Controller
{
    /**
     * Listar todos los grupos
     */
    public function index()
    {
        $groups = InvitationGroup::with('guests')
            ->withCount('guests')
            ->orderBy('name')
            ->get()
            ->map(function ($group) {
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
                ];
            });

        $stats = [
            'total_groups' => InvitationGroup::count(),
            'submitted_groups' => InvitationGroup::submitted()->count(),
            'pending_groups' => InvitationGroup::pending()->count(),
            'total_guests' => Guest::count(),
            'attending_guests' => Guest::attending()->count(),
            'confirmed_groups' => InvitationGroup::submitted()->count(),
            'pending_with_email' => InvitationGroup::pending()->whereNotNull('contact_email')->count(),
        ];

        $chartData = [
            'attendance' => [
                ['name' => 'Confirmados', 'value' => Guest::attending()->count(), 'color' => '#22c55e'],
                ['name' => 'No asisten', 'value' => Guest::where('attending', false)->count(), 'color' => '#f87171'],
                ['name' => 'Pendientes', 'value' => Guest::whereNull('attending')->count(), 'color' => '#d1d5db'],
            ],
            'transport' => [
                ['name' => 'Bus Onda (ida)', 'value' => InvitationGroup::submitted()->where('bus_onda_ida', true)->count()],
                ['name' => 'Bus Onda (vuelta)', 'value' => InvitationGroup::submitted()->where('bus_onda_vuelta', true)->count()],
                ['name' => 'Bus Castellón', 'value' => InvitationGroup::submitted()->where('bus_cs', true)->count()],
                ['name' => 'Coche', 'value' => InvitationGroup::submitted()->where('transport', 'COCHE')->count()],
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
        $group->load('guests');

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
            ->map(fn($q) => [
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
        if (!$group->contact_email) {
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
            'group_ids'   => 'required|array|min:1',
            'group_ids.*' => 'integer|exists:invitation_groups,id',
            'subject'     => 'required|string|max:200',
            'message'     => 'required|string|max:5000',
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

        $msg = "Mensaje enviado a {$sent} grupo" . ($sent !== 1 ? 's' : '');
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
            'group_ids'   => 'required|array|min:1',
            'group_ids.*' => 'integer|exists:invitation_groups,id',
            'title'       => 'required|string|max:100',
            'body'        => 'required|string|max:500',
        ]);

        $subscriptions = PushSubscription::whereIn('invitation_group_id', $validated['group_ids'])->get();

        if ($subscriptions->isEmpty()) {
            return back()->with('error', 'Ninguno de los grupos seleccionados tiene dispositivos suscritos a notificaciones push.');
        }

        $auth = [
            'VAPID' => [
                'subject'    => config('webpush.vapid.subject'),
                'publicKey'  => config('webpush.vapid.public_key'),
                'privateKey' => config('webpush.vapid.private_key'),
            ],
        ];

        $webPush = new WebPush($auth);
        $payload = json_encode(['title' => $validated['title'], 'body' => $validated['body']]);

        $staleIds = [];

        foreach ($subscriptions as $sub) {
            $subscription = Subscription::create([
                'endpoint'        => $sub->endpoint,
                'keys'            => [
                    'p256dh' => $sub->p256dh,
                    'auth'   => $sub->auth,
                ],
            ]);
            $webPush->queueNotification($subscription, $payload);
        }

        $sent   = 0;
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

        if (!empty($staleIds)) {
            PushSubscription::whereIn('endpoint', $staleIds)->delete();
        }

        $msg = "Push enviado a {$sent} dispositivo" . ($sent !== 1 ? 's' : '');
        if ($errors > 0) {
            $msg .= " ({$errors} con error)";
        }

        return back()->with('success', $msg);
    }
}
