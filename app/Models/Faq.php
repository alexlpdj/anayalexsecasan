<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = [
        'question',
        'answer',
        'order',
        'is_active',
        'translations',
        'needs_translation',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'translations' => 'array',
        'needs_translation' => 'boolean',
    ];

    /**
     * Scope para obtener solo FAQs activas
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para ordenar por orden
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
