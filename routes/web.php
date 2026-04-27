<?php

use App\Http\Controllers\Admin\BudgetController;
use App\Http\Controllers\Admin\InvitationGroupController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\WeddingSettingsController;
use App\Http\Controllers\Admin\SongSuggestionController;
use App\Http\Controllers\Guest\GuestAuthController;
use App\Http\Controllers\Guest\GuestDashboardController;
use App\Http\Controllers\Guest\PushController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Sistema de Invitaciones Boda Alex & Ana
|--------------------------------------------------------------------------
*/

// Redirigir home a login de invitados
Route::get('/', function () {
    return redirect()->route('guest.login');
});

/*
|--------------------------------------------------------------------------
| Rutas de Invitados (Públicas)
|--------------------------------------------------------------------------
*/

Route::prefix('invitacion')->name('guest.')->group(function () {
    // Login con código
    Route::get('/login', [GuestAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [GuestAuthController::class, 'login'])->name('login.post');

    // Rutas protegidas (requieren código válido)
    Route::middleware(['guest.auth'])->group(function () {
        Route::get('/dashboard', [GuestDashboardController::class, 'index'])->name('dashboard');
        Route::get('/nuestra-historia', [GuestDashboardController::class, 'ourStory'])->name('our-story');
        Route::post('/confirmar', [GuestDashboardController::class, 'confirm'])->name('confirm');
        Route::post('/pregunta', [GuestDashboardController::class, 'askQuestion'])->name('question');
        Route::post('/logout', [GuestAuthController::class, 'logout'])->name('logout');
        Route::post('/push/subscribe',   [PushController::class, 'subscribe'])->name('push.subscribe');
        Route::post('/push/unsubscribe', [PushController::class, 'unsubscribe'])->name('push.unsubscribe');
        Route::get('/canciones/buscar', [GuestDashboardController::class, 'searchSongs'])->name('songs.search');
        Route::post('/canciones', [GuestDashboardController::class, 'suggestSong'])->name('songs.suggest');
        Route::delete('/canciones/{suggestion}', [GuestDashboardController::class, 'removeSuggestion'])->name('songs.remove');
    });
});

/*
|--------------------------------------------------------------------------
| Rutas de Administración (Alex & Ana)
|--------------------------------------------------------------------------
|
| Requieren autenticación Laravel Breeze estándar
| Login: /admin/login
*/

// Ruta raíz /admin - redirige según autenticación
Route::get('/admin', function () {
    if (auth()->check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('login');
});

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {

    // Dashboard principal
    Route::get('/dashboard', [InvitationGroupController::class, 'dashboard'])->name('dashboard');

    // Gestión de Grupos
    Route::post('/groups/send-push', [InvitationGroupController::class, 'sendPushNotification'])
        ->name('groups.send-push');
    Route::resource('groups', InvitationGroupController::class)->except(['show']);

    // Detalle de grupo
    Route::get('/groups/{group}', [InvitationGroupController::class, 'show'])
        ->name('groups.show');

    // Regenerar código de un grupo
    Route::post('/groups/{group}/regenerate-code', [InvitationGroupController::class, 'regenerateCode'])
        ->name('groups.regenerate-code');

    // Marcar/desmarcar invitación como enviada (sin enviar email)
    Route::post('/groups/{group}/toggle-invitation-sent', [InvitationGroupController::class, 'toggleInvitationSent'])
        ->name('groups.toggle-invitation-sent');

    // Acciones rápidas de RSVP desde el admin
    Route::post('/groups/{group}/admin-confirm', [InvitationGroupController::class, 'adminConfirm'])
        ->name('groups.admin-confirm');
    Route::post('/groups/{group}/admin-decline', [InvitationGroupController::class, 'adminDecline'])
        ->name('groups.admin-decline');
    Route::post('/groups/{group}/admin-reset-rsvp', [InvitationGroupController::class, 'adminResetRsvp'])
        ->name('groups.admin-reset-rsvp');

    // Marcar/desmarcar invitación como impresa
    Route::post('/groups/{group}/toggle-printed', [InvitationGroupController::class, 'togglePrinted'])
        ->name('groups.toggle-printed');

    // Marcar/desmarcar invitación como entregada
    Route::post('/groups/{group}/toggle-delivered', [InvitationGroupController::class, 'toggleDelivered'])
        ->name('groups.toggle-delivered');

    // Envío de emails
    Route::post('/groups/{group}/send-invitation', [InvitationGroupController::class, 'sendInvitation'])
        ->name('groups.send-invitation');
    Route::post('/groups/send-reminders', [InvitationGroupController::class, 'sendReminders'])
        ->name('groups.send-reminders');
    Route::post('/groups/send-custom-message', [InvitationGroupController::class, 'sendCustomMessage'])
        ->name('groups.send-custom-message');

    // Vista de confirmados
    Route::get('/confirmed', [InvitationGroupController::class, 'confirmedGuests'])
        ->name('confirmed');

    // Exportaciones y reportes
    Route::get('/export/all', [InvitationGroupController::class, 'exportAll'])
        ->name('export.all');

    Route::get('/export/confirmed', [InvitationGroupController::class, 'exportConfirmed'])
        ->name('export.confirmed');

    Route::get('/export/codes', [InvitationGroupController::class, 'exportCodes'])
        ->name('export.codes');

    // Vista imprimible de códigos
    Route::get('/print/codes', [InvitationGroupController::class, 'printCodes'])
        ->name('print.codes');

    // Preguntas de invitados
    Route::get('/questions', [InvitationGroupController::class, 'questions'])
        ->name('questions');

    // Sugerencias de canciones
    Route::get('/songs', [SongSuggestionController::class, 'index'])
        ->name('songs.index');

    // FAQs - Preguntas Frecuentes
    Route::post('/faqs/translate', [FaqController::class, 'translateAll'])->name('faqs.translate');
    Route::post('/faqs/update-order', [FaqController::class, 'updateOrder'])->name('faqs.update-order');
    Route::resource('faqs', FaqController::class)->except(['show', 'create', 'edit']);
    Route::post('/faqs/{faq}/toggle', [FaqController::class, 'toggleActive'])->name('faqs.toggle');

    // Presupuesto de la Boda
    Route::get('/presupuesto', [BudgetController::class, 'index'])->name('budget.index');
    Route::post('/presupuesto/items', [BudgetController::class, 'storeItem'])->name('budget.items.store');
    Route::patch('/presupuesto/items/{item}', [BudgetController::class, 'updateItem'])->name('budget.items.update');
    Route::delete('/presupuesto/items/{item}', [BudgetController::class, 'destroyItem'])->name('budget.items.destroy');
    Route::patch('/presupuesto/target', [BudgetController::class, 'updateTarget'])->name('budget.target.update');

    // Wedding Settings - Configuración de la Boda
    Route::get('/settings/wedding', [WeddingSettingsController::class, 'edit'])->name('settings.wedding.edit');
    Route::put('/settings/wedding', [WeddingSettingsController::class, 'update'])->name('settings.wedding.update');
    Route::post('/settings/wedding/translate-schedule', [WeddingSettingsController::class, 'translateSchedule'])->name('settings.wedding.translate-schedule');
});

/*
|--------------------------------------------------------------------------
| ARCHIVOS DE RUTAS ADICIONALES
|--------------------------------------------------------------------------
*/

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
