<?php

namespace App\Http\Controllers;

use App\Models\MusicMoment;
use App\Models\WeddingSetting;
use Inertia\Inertia;

class MusicShareController extends Controller
{
    public function show(string $token)
    {
        $setting = WeddingSetting::where('music_share_token', $token)->firstOrFail();

        $moments = MusicMoment::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn (MusicMoment $m) => [
                'id' => $m->id,
                'section' => $m->section->value,
                'name' => $m->name,
                'playlist_url' => $m->playlist_url,
                'notes' => $m->notes,
                'estimated_duration' => $m->estimated_duration,
                'sort_order' => $m->sort_order,
            ]);

        return Inertia::render('music/share', [
            'moments' => $moments,
            'bride' => $setting->bride,
            'groom' => $setting->groom,
            'weddingDate' => $setting->wedding_date?->format('d/m/Y'),
        ]);
    }
}
