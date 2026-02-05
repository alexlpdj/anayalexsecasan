<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvitationGroup;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                ];
            });

        $stats = [
            'total_groups' => InvitationGroup::count(),
            'submitted_groups' => InvitationGroup::submitted()->count(),
            'pending_groups' => InvitationGroup::pending()->count(),
            'total_guests' => Guest::count(),
            'attending_guests' => Guest::attending()->count(),
        ];

        return Inertia::render('Admin/Groups/Index', [
            'groups' => $groups,
            'stats' => $stats,
        ]);
    }

    /**
     * Mostrar formulario para crear grupo
     */
    public function create()
    {
        return Inertia::render('Admin/Groups/Create');
    }

    /**
     * Guardar nuevo grupo
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:FAMILIAR,AMIGO',
            'guests' => 'required|array|min:1',
            'guests.*.name' => 'required|string|max:255',
            'guests.*.gender' => 'nullable|in:HOMBRE,MUJER',
        ]);

        // Crear grupo con código único
        $group = InvitationGroup::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'code' => InvitationGroup::generateUniqueCode(),
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

        return Inertia::render('Admin/Groups/Show', [
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

        return Inertia::render('Admin/Groups/Edit', [
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'code' => $group->code,
                'type' => $group->type,
                'notes' => $group->notes,
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
}
