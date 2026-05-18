<?php

namespace App\Http\Controllers;

use App\Models\MusicMoment;
use App\Models\MusicSection;
use App\Models\WeddingSetting;
use Inertia\Inertia;

class MusicShareController extends Controller
{
    public function show(string $token)
    {
        $setting = WeddingSetting::where('music_share_token', $token)->firstOrFail();

        $sections = MusicSection::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn (MusicSection $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'emoji' => $s->emoji,
            ]);

        $moments = MusicMoment::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn (MusicMoment $m) => [
                'id' => $m->id,
                'section_id' => $m->section_id,
                'name' => $m->name,
                'playlist_url' => $m->playlist_url,
                'notes' => $m->notes,
                'estimated_duration' => $m->estimated_duration,
            ]);

        return Inertia::render('music/share', [
            'sections' => $sections,
            'moments' => $moments,
            'bride' => $setting->bride,
            'groom' => $setting->groom,
            'weddingDate' => $setting->wedding_date?->format('d/m/Y'),
        ]);
    }
}
