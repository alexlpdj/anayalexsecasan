<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PushSubscription extends Model
{
    protected $fillable = [
        'invitation_group_id',
        'endpoint',
        'p256dh',
        'auth',
    ];

    public function invitationGroup(): BelongsTo
    {
        return $this->belongsTo(InvitationGroup::class);
    }
}
