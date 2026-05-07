# Plan de Mejora del Backoffice — Boda Ana & Alex

> Fecha: 2026-05-07  
> Rama: `develop`

---

## Contexto y modelo de datos

El modelo central tiene dos niveles:

- **InvitationGroup** — la unidad de invitación (una familia, una pareja, un amigo). Tiene código único, transporte (nivel grupo), contact_email, contact_phone, etc.
- **Guest** — cada persona dentro de un grupo. Tiene `attending` (null | true | false) y `allergies` (por persona).

Esta distinción es importante: el **transporte lo elige el grupo**, pero la **asistencia es individual**. Un grupo puede tener personas que sí vienen y personas que no.

---

## Problemas detectados

### 1. Sin control total del RSVP desde admin

El problema más crítico. Actualmente desde admin **no se puede**:

- Cambiar el `attending` de un invitado individual (solo confirm/decline de todo el grupo)
- Editar las `allergies` de un invitado concreto
- Cambiar el `transport` / `bus_onda_ida` / `bus_onda_vuelta` / `bus_cs` del grupo
- Editar el `contact_email` o `contact_phone` del grupo (solo al crear)
- Cambiar la fecha `submitted_at` o resetearla selectivamente
- Añadir notas desde la vista de detalle (solo desde edit)

### 2. Estadísticas con ambigüedades

- **Gráfica de transporte**: cuenta personas (`Guest::attending()`) cuyo grupo tiene `bus_onda_ida = true`, etc. Correcto en lógica, pero la etiqueta "Bus Onda ida: N" puede confundir — ¿son personas o grupos? Deben ser personas claramente.
- **confirmed_groups vs declined_groups**: Un grupo "rechazado" tiene `submitted_at` pero ningún `attending = true`. Un grupo mixto (algunos sí, algunos no) cuenta como `confirmed_group`, lo cual es correcto pero no es obvio en la UI.
- **pending_guests vs pending_groups**: El dashboard tiene stats a nivel invitado Y a nivel grupo. Hay que dejar claro visualmente qué es cada número.
- **Sidebar "Confirmados"**: En `AdminSidebarLayout` el contador de "Confirmados" no está claro si son grupos o personas.
- **Transport: grupos sin transporte seleccionado**: Si un grupo confirma pero no elige transporte (queda en `NO_CONFIRMADO`), sus invitados no suman en ninguna categoría de transporte. No hay forma rápida de ver cuántas personas "van pero no han dicho cómo".

### 3. Página `show` solo de lectura

La vista de detalle de grupo (`/admin/groups/{id}`) muestra toda la información correctamente, pero **no tiene ningún control de edición inline**. Para hacer cualquier cambio hay que ir al formulario `edit`, que tampoco tiene campos de RSVP.

### 4. Formulario `edit` incompleto

El formulario de edición solo permite cambiar nombre, tipo, idioma, notas y la lista de invitados (nombre/género). **No permite modificar el RSVP** (attending, allergies, transport, contacto).

### 5. Gestión de preguntas y canciones incompleta

- Las preguntas (`/admin/questions`) son solo lectura, no se pueden borrar
- Las canciones (`/admin/songs`) son solo lectura, no se pueden borrar duplicados
- No hay forma de marcar una pregunta como "respondida/leída"

---

## Plan de acción por fases

---

### FASE 1 — Edición completa del RSVP desde admin ⭐ Prioridad alta

El objetivo es poder modificar cualquier dato de un grupo/invitado sin que los propios invitados tengan que volver a confirmar.

#### 1.1 Nueva ruta + endpoint: `PATCH /admin/groups/{group}/rsvp`

Crear `adminUpdateRsvp(Request $request, InvitationGroup $group)` en `InvitationGroupController`.

Campos que debe aceptar:
```php
[
    'submitted_at'    => 'nullable|date',
    'transport'       => 'nullable|in:AUTOBUS,COCHE,NO_CONFIRMADO',
    'bus_onda_ida'    => 'boolean',
    'bus_onda_vuelta' => 'boolean',
    'bus_cs'          => 'boolean',
    'contact_email'   => 'nullable|email|max:255',
    'contact_phone'   => 'nullable|string|max:50',
    'notes'           => 'nullable|string|max:2000',
    'guests'          => 'array',
    'guests.*.id'     => 'required|exists:guests,id',
    'guests.*.attending' => 'nullable|boolean',
    'guests.*.allergies' => 'nullable|string|max:500',
]
```

Lógica:
- Actualiza el grupo (transport, buses, contacto, submitted_at, notas)
- Actualiza cada guest (attending, allergies) por ID
- Si todos los guests quedan `attending = null`, resetea `submitted_at = null`
- Si alguno tiene `attending = true` o `false`, asegura que `submitted_at` tenga valor

#### 1.2 Mejorar la vista `show` del grupo

Añadir panel de edición inline al detalle del grupo:

**Panel "Respuesta RSVP (admin)":**
- Para cada invitado: toggle `Asiste / No asiste / Sin respuesta` + campo editable de alergias
- Select de transporte del grupo (AUTOBUS / COCHE / NO_CONFIRMADO)
- Checkboxes de buses (si transport = AUTOBUS)
- Campos de email y teléfono de contacto editables
- Botón "Guardar cambios RSVP" que hace PATCH al endpoint 1.1

**Comportamiento:**
- Formulario Inertia con `useForm` 
- Feedback de éxito/error con toast
- Sin recarga de página (`preserveScroll: true`)

#### 1.3 Actualizar el formulario `edit` del grupo

Añadir sección "Estado RSVP" al formulario de edición con los mismos campos del punto anterior. Útil cuando se hace edición completa del grupo.

---

### FASE 2 — Corrección y mejora de estadísticas ⭐ Prioridad alta

#### 2.1 Aclarar unidades en el dashboard y confirmed

- Etiquetar explícitamente si el número es "personas" o "grupos" en cada stat card
- En el dashboard, separar claramente la sección de grupos de la de personas:
  - **Grupos**: Total | Confirmados | Rechazados | Pendientes
  - **Personas**: Total | Asistirán | No asisten | Sin responder

#### 2.2 Corregir el panel de transporte

Añadir al dashboard y al `confirmed` un desglose más completo:

| Transporte | Personas confirmadas |
|------------|---------------------|
| Bus Onda ida | N |
| Bus Onda vuelta | N |
| Bus Castellón | N |
| Coche propio | N |
| **Sin definir (confirman pero sin transporte)** | **N** ← nuevo |

El cálculo del nuevo campo:
```php
Guest::attending()
    ->whereHas('invitationGroup', fn($q) => $q
        ->where(fn($q2) => $q2->whereNull('transport')->orWhere('transport', 'NO_CONFIRMADO'))
    )->count()
```

#### 2.3 Sidebar: aclarar "Confirmados"

En `AdminSidebarLayout`, el número que acompaña al link "Confirmados" debe mostrar el conteo de **personas** (no grupos), con una etiqueta clara. O mostrar ambos: "12 grupos · 28 personas".

#### 2.4 Alertas del dashboard: añadir "sin transporte"

Ya existe `without_transport` (grupos confirmados sin transporte) pero la UI lo muestra como alerta baja. Hacerlo más prominente y añadir el número de **personas** afectadas, no solo grupos.

---

### FASE 3 — Mejoras en la gestión de preguntas y canciones ⭐ Prioridad media

#### 3.1 Borrar preguntas

Añadir `DELETE /admin/questions/{question}` y botón de borrar en la UI.

#### 3.2 Borrar canciones

Añadir `DELETE /admin/songs/{song}` en `SongSuggestionController` y botón de borrar en la UI.

#### 3.3 Marcar preguntas como leídas (opcional)

Añadir campo `read_at` a `GuestQuestion` (migración). El dashboard muestra el badge de preguntas solo si hay no leídas.

---

### FASE 4 — Mejoras en la vista de grupos confirmados ⭐ Prioridad media

#### 4.1 Acceso rápido a editar RSVP

Desde la tabla `confirmed.jsx`, en el menú de acciones del dropdown, añadir "Editar RSVP" que navega a `show` con el formulario expandido.

#### 4.2 Mostrar correctamente grupos mixtos

Si un grupo tiene, p.ej., 3 personas y solo 2 confirman, mostrar claramente "2/3 asisten". Ya funciona parcialmente pero mejorar la explicación visual de los invitados que no asisten dentro del grupo para evitar confusión.

---

### FASE 5 — Exportaciones mejoradas ⭐ Prioridad baja

#### 5.1 Exportar alergias para catering

Nueva ruta `GET /admin/export/allergies` que genera CSV con solo:
- Nombre del invitado
- Alergias/restricciones
- Nombre del grupo
- Transporte del grupo

#### 5.2 Exportar lista de bus por ruta

CSV por ruta de bus:
- Bus Onda ida: lista de personas (y su grupo)
- Bus Onda vuelta: ídem
- Bus Castellón: ídem

---

## Orden de implementación sugerido

| Orden | Tarea | Impacto | Esfuerzo |
|-------|-------|---------|----------|
| 1 | Endpoint PATCH /admin/groups/{id}/rsvp | Muy alto | Medio |
| 2 | Panel de edición RSVP en `show.jsx` | Muy alto | Medio-alto |
| 3 | Corrección etiquetas stats (personas vs grupos) | Alto | Bajo |
| 4 | Añadir "sin transporte" en stats | Alto | Bajo |
| 5 | Borrar preguntas y canciones | Medio | Bajo |
| 6 | Exportar alergias | Medio | Bajo |
| 7 | Exportar listas de bus | Medio | Bajo |
| 8 | Marcar preguntas como leídas | Bajo | Medio |

---

## Notas de arquitectura

- **No cambiar el modelo de datos** de transporte (sigue siendo por grupo, no por individuo). El diseño actual es correcto porque un grupo familiar comparte coche/bus.
- **No añadir transporte por individuo** — complica mucho la UX del invitado y el modelo de datos sin beneficio real para la planificación de la boda.
- **Mantener la distinción grupo/invitado** en la UI, simplemente mejorar las etiquetas para que quede claro cuándo se habla de grupos y cuándo de personas.
