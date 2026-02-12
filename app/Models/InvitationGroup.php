<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\GuestQuestion;
use Illuminate\Support\Str;

class InvitationGroup extends Model
{
    protected $fillable = [
        'name',
        'code',
        'type',
        'submitted_at',
        'transport',
        'bus_onda_ida',
        'bus_onda_vuelta',
        'bus_cs',
        'contact_email',
        'contact_phone',
        'notes',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'bus_onda_ida' => 'boolean',
        'bus_onda_vuelta' => 'boolean',
        'bus_cs' => 'boolean',
    ];

    /**
     * Relación: Un grupo tiene muchos invitados
     */
    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(GuestQuestion::class);
    }

    /**
     * Generar código único alfanumérico
     * Formato: 5 caracteres mayúsculas y números
     * Ejemplo: K7HM2, P3QR9, etc.
     */
    public static function generateUniqueCode(): string
    {
        do {
            // Genera código de 5 caracteres alfanuméricos
            $code = strtoupper(Str::random(5));
            
            // Evita caracteres confusos: 0, O, I, 1, L
            $code = str_replace(['0', 'O', 'I', '1', 'L'], ['A', 'B', 'C', 'D', 'E'], $code);
            
        } while (self::where('code', $code)->exists());

        return $code;
    }

    /**
     * ¿El grupo ya confirmó su asistencia?
     */
    public function hasSubmitted(): bool
    {
        return $this->submitted_at !== null;
    }

    /**
     * Número de personas que asisten
     */
    public function attendingCount(): int
    {
        return $this->guests()->where('attending', true)->count();
    }

    /**
     * Número total de personas en el grupo
     */
    public function totalGuests(): int
    {
        return $this->guests()->count();
    }

    /**
     * ¿Todos del grupo asisten?
     */
    public function allAttending(): bool
    {
        $total = $this->totalGuests();
        if ($total === 0) return false;
        
        return $this->attendingCount() === $total;
    }

    /**
     * ¿Nadie del grupo asiste?
     */
    public function noneAttending(): bool
    {
        return $this->guests()->where('attending', true)->count() === 0;
    }

    /**
     * Scope: Grupos que ya confirmaron
     */
    public function scopeSubmitted($query)
    {
        return $query->whereNotNull('submitted_at');
    }

    /**
     * Scope: Grupos pendientes
     */
    public function scopePending($query)
    {
        return $query->whereNull('submitted_at');
    }
}
