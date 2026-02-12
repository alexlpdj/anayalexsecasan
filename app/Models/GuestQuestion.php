<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestQuestion extends Model
{
    protected $fillable = [
        'invitation_group_id',
        'message',
    ];

    public function invitationGroup(): BelongsTo
    {
        return $this->belongsTo(InvitationGroup::class);
    }
}
