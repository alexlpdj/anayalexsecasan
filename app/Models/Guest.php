<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guest extends Model
{
    protected $fillable = [
        'invitation_group_id',
        'name',
        'gender',
        'attending',
        'allergies',
    ];

    public function getAttendingAttribute($value)
    {
        return $value === null ? null : (bool) $value;
    }

    /**
     * Relación: Un invitado pertenece a un grupo
     */
    public function invitationGroup(): BelongsTo
    {
        return $this->belongsTo(InvitationGroup::class);
    }

    /**
     * ¿Tiene alergias?
     */
    public function hasAllergies(): bool
    {
        return !empty($this->allergies);
    }

    /**
     * Scope: Invitados que asisten
     */
    public function scopeAttending($query)
    {
        return $query->where('attending', true);
    }

    /**
     * Scope: Con alergias
     */
    public function scopeWithAllergies($query)
    {
        return $query->whereNotNull('allergies')
            ->where('allergies', '!=', '');
    }
}
