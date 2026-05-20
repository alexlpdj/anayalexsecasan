<?php

namespace App\Models;

use App\Enums\GiftStatus;
use App\Enums\GiftType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gift extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'display_name',
        'amount',
        'type',
        'status',
        'received_at',
        'notes',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'received_at' => 'date',
            'type' => GiftType::class,
            'status' => GiftStatus::class,
            'sort_order' => 'integer',
        ];
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function scopeReceived($query)
    {
        return $query->where('status', GiftStatus::Received->value);
    }

    public function scopePending($query)
    {
        return $query->where('status', GiftStatus::Pending->value);
    }
}
