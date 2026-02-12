<?php

use App\Http\Controllers\Admin\InvitationGroupController;
use App\Http\Controllers\Guest\GuestAuthController;
use App\Http\Controllers\Guest\GuestDashboardController;
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
        Route::post('/confirmar', [GuestDashboardController::class, 'confirm'])->name('confirm');
        Route::post('/pregunta', [GuestDashboardController::class, 'askQuestion'])->name('question');
        Route::post('/logout', [GuestAuthController::class, 'logout'])->name('logout');
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

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {

    // Dashboard principal
    Route::get('/dashboard', function () {
        return redirect()->route('admin.groups.index');
    })->name('dashboard');

    // Gestión de Grupos
    Route::resource('groups', InvitationGroupController::class)->except(['show']);

    // Detalle de grupo
    Route::get('/groups/{group}', [InvitationGroupController::class, 'show'])
        ->name('groups.show');

    // Regenerar código de un grupo
    Route::post('/groups/{group}/regenerate-code', [InvitationGroupController::class, 'regenerateCode'])
        ->name('groups.regenerate-code');

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
});

/*
|--------------------------------------------------------------------------
| ARCHIVOS DE RUTAS ADICIONALES
|--------------------------------------------------------------------------
*/

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
