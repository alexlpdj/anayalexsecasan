<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use Illuminate\Http\Request;

class PushController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => 'required|string',
            'p256dh'   => 'required|string',
            'auth'     => 'required|string',
        ]);

        $groupId = session('invitation_group_id');

        PushSubscription::updateOrCreate(
            ['endpoint' => $validated['endpoint']],
            [
                'invitation_group_id' => $groupId,
                'p256dh'              => $validated['p256dh'],
                'auth'                => $validated['auth'],
            ]
        );

        return response()->json(['ok' => true]);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => 'required|string',
        ]);

        PushSubscription::where('endpoint', $validated['endpoint'])->delete();

        return response()->json(['ok' => true]);
    }
}
