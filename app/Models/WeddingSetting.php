<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeddingSetting extends Model
{
    protected $fillable = [
        'bride',
        'groom',
        'wedding_date',
        'civil_ceremony_date',
        'venue_name',
        'venue_address',
        'venue_url',
        'venue_parking_info',
        'schedule',
        'schedule_translations',
        'schedule_needs_translation',
        'buses_available',
        'buses_info',
        'parking_available',
        'is_active',
        'music_share_token',
    ];

    protected $casts = [
        'wedding_date' => 'date',
        'civil_ceremony_date' => 'date',
        'schedule' => 'array',
        'schedule_translations' => 'array',
        'schedule_needs_translation' => 'boolean',
        'buses_available' => 'boolean',
        'parking_available' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the current active wedding settings (singleton pattern).
     */
    public static function current(): ?self
    {
        return self::where('is_active', true)->first() ?? self::first();
    }
}
