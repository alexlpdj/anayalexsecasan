# Boda Alex & Ana - Web de Invitaciones

¡Hola, futura esposa! Esta es la web para gestionar las invitaciones y confirmaciones de nuestra boda. Aquí te explico cómo funciona todo para que no tengas que preguntarme cada dos minutos (aunque sabes que no me importa).

Tiene dos partes: el **panel de admin** (para nosotros, los jefes) y la **vista de invitados** (para el resto de mortales).

---

## Panel de Administración (tu nuevo juguete)

### Cómo entrar

1. Abre el navegador y ve a la dirección de la web seguida de `/admin/dashboard`
2. Inicia sesión con tu email y contraseña

¡Y ya estás dentro! Más fácil que elegir el menú de la boda.

### Qué puedes hacer

#### Ver el estado general (Dashboard)

En el dashboard vas a ver un resumen con:

- Cuántos invitados hay en total
- Cuántos han confirmado, cuántos han dicho que no y cuántos todavía no han respondido (a estos habrá que perseguirlos)
- Cuántos necesitan autobús (desde Onda ida, Onda vuelta, o desde Castellón) y cuántos vienen en coche
- Si algún invitado tiene alergias o restricciones alimentarias

También hay una lista completa de todos los invitados donde puedes buscar por nombre y filtrar por estado. Ideal para cuando mi madre pregunte "¿ha confirmado ya la prima Vero?".

#### Gestionar grupos de invitación

Desde el menú de **Grupos** (`/admin/groups`) puedes:

- **Crear un grupo nuevo**: Dale un nombre (ej: "Familia X", "Noe y Edu"), elige si es tipo FAMILIAR o AMIGO, y añade los nombres de los invitados que forman parte de ese grupo.
- **Ver un grupo**: Haz clic en cualquier grupo para ver sus detalles y si cada invitado ha confirmado o no.
- **Editar un grupo**: Cambiar el nombre, añadir o quitar invitados del grupo.
- **Eliminar un grupo**: Si te equivocas puedes borrarlo (se borran también todos los invitados de ese grupo). Tranquila, no se entera nadie.
- **Regenerar código**: Si un invitado pierde su código, le generamos uno nuevo (aunque no deberia pasar ya que van escritos en la invitación)

Cada grupo tiene un **código único de 6 caracteres** (ej: K7HM2P). Ese código es lo que los invitados usan para entrar a la web y confirmar asistencia.

#### Exportar datos a Excel

Hay tres opciones de descarga en CSV (se abre con Excel o Google Sheets):

- **Todos los invitados** - `/admin/export/all`
- **Solo los confirmados** - `/admin/export/confirmed`
- **Lista de códigos** - `/admin/export/codes`

Perfecto para cuando necesites hacer cuentas con el catering o imprimir listados.

#### Imprimir códigos

En `/admin/print/codes` puedes ver todos los códigos en un formato listo para imprimir (en 3 columnas con los nombres). Útil para tener la referencia a mano cuando escribas los códigos en las invitaciones físicas.

---

## Cómo funciona para los invitados

Los invitados no necesitan saber nada técnico. Solo necesitan el **código de invitación** que viene en su invitación física.

1. Entran a la web en `/invitacion/login`
2. Escriben su código de 6 caracteres
3. Ven una página donde pueden:
   - Marcar quién del grupo va y quién no
   - Indicar alergias o restricciones alimentarias de cada persona
   - Elegir cómo llegan: autobús gratuito (desde Onda o Castellón) o coche propio
   - Dejar un email o teléfono de contacto (opcional)
4. Si cambian de planes, pueden volver a entrar con su código y **modificar su respuesta** (porque siempre hay alguien que cambia de opinión tres veces)

En esa misma página los invitados ven toda la info del evento:

- **Fecha**: 20 de junio de 2026
- **Lugar**: La Ópera, Benicàssim (Castellón)
- **Ceremonia civil**: a las 19:30
- **Cóctel y buffet**: a las 21:00 en los jardines
- **Fiesta con DJ**: a medianoche (00h)
- **Parking**: gratuito en el subterráneo del recinto
- **Autobuses**: disponibles desde Onda y Castellón (gratis)

---

## Resumen rápido

| Qué quieres hacer                     | Dónde ir                  |
| ------------------------------------- | ------------------------- |
| Ver dashboard con estadísticas        | `/admin/dashboard`        |
| Gestionar grupos e invitaciones       | `/admin/groups`           |
| Exportar lista de invitados           | `/admin/export/all`       |
| Exportar solo confirmados             | `/admin/export/confirmed` |
| Imprimir códigos                      | `/admin/print/codes`      |
| Probar la vista que ven los invitados | `/invitacion/login`       |

---

## ¿Dudas?

Si algo no funciona o no sabes cómo hacer algo, pregúntale a Alex. Para eso está (aparte de para casarse contigo).
