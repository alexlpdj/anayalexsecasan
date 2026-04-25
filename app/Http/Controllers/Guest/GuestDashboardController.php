<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Mail\AdminRsvpNotificationMail;
use App\Mail\AdminSongNotificationMail;
use App\Mail\GuestQuestionMail;
use App\Mail\RsvpConfirmationMail;
use App\Models\Faq;
use App\Models\GuestQuestion;
use App\Models\InvitationGroup;
use App\Models\SongSuggestion;
use App\Models\User;
use App\Models\WeddingSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class GuestDashboardController extends Controller
{
    private function getAuthenticatedGroup()
    {
        $groupId = Session::get('invitation_group_id');

        if (!$groupId) {
            abort(403, 'No autorizado');
        }

        $group = InvitationGroup::with('guests')->find($groupId);

        if (!$group) {
            abort(404, 'Grupo no encontrado');
        }

        return $group;
    }

    public function index()
    {
        $group = $this->getAuthenticatedGroup();

        $weddingInfo = $this->getWeddingInfo();

        $questions = $group->questions()->orderBy('created_at', 'desc')->get()->map(fn($q) => [
            'id' => $q->id,
            'message' => $q->message,
            'created_at' => $q->created_at->format('d/m/Y H:i'),
        ]);

        $faqs = Faq::active()->ordered()->get();

        $songSuggestions = $group->songSuggestions()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'track_title' => $s->track_title,
                'artist_name' => $s->artist_name,
                'album_name' => $s->album_name,
                'artwork_url' => $s->artwork_url,
                'itunes_track_id' => $s->itunes_track_id,
                'preview_url' => $s->preview_url,
            ]);

        return Inertia::render('Guest/Dashboard', [
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'code' => $group->code,
                'type' => $group->type,
                'submitted_at' => $group->submitted_at,
                'transport' => $group->transport,
                'bus_onda_ida' => $group->bus_onda_ida,
                'bus_onda_vuelta' => $group->bus_onda_vuelta,
                'bus_cs' => $group->bus_cs,
                'contact_email' => $group->contact_email,
                'contact_phone' => $group->contact_phone,
                'default_language' => $group->default_language,
                'guests' => $group->guests->map(fn($g) => [
                    'id' => $g->id,
                    'name' => $g->name,
                    'gender' => $g->gender,
                    'attending' => $g->attending,
                    'allergies' => $g->allergies,
                ]),
            ],
            'questions' => $questions,
            'faqs' => $faqs,
            'weddingInfo' => $weddingInfo,
            'songSuggestions' => $songSuggestions,
        ]);
    }

    public function confirm(Request $request)
    {
        $group = $this->getAuthenticatedGroup();

        $validated = $request->validate([
            'attending' => 'required|boolean',
            'guests' => 'nullable|array',
            'guests.*.id' => 'required|exists:guests,id',
            'guests.*.allergies' => 'nullable|string|max:500',
            'transport' => 'nullable|in:AUTOBUS,COCHE,NO_CONFIRMADO',
            'bus_onda_ida' => 'boolean',
            'bus_onda_vuelta' => 'boolean',
            'bus_cs' => 'boolean',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        $attending = $validated['attending'];
        $isUpdate = $group->submitted_at !== null;

        DB::transaction(function () use ($group, $validated, $attending) {
            if ($attending) {
                // Mark all guests as attending, update allergies individually
                foreach ($group->guests as $guest) {
                    $allergies = null;
                    if (!empty($validated['guests'])) {
                        $guestData = collect($validated['guests'])->firstWhere('id', $guest->id);
                        $allergies = $guestData['allergies'] ?? null;
                    }
                    $guest->update([
                        'attending' => true,
                        'allergies' => $allergies,
                    ]);
                }

                $group->update([
                    'submitted_at' => now(),
                    'transport' => $validated['transport'] ?? 'NO_CONFIRMADO',
                    'bus_onda_ida' => $validated['bus_onda_ida'] ?? false,
                    'bus_onda_vuelta' => $validated['bus_onda_vuelta'] ?? false,
                    'bus_cs' => $validated['bus_cs'] ?? false,
                    'contact_email' => $validated['contact_email'] ?? null,
                    'contact_phone' => $validated['contact_phone'] ?? null,
                ]);
            } else {
                // Mark all guests as not attending
                $group->guests()->update([
                    'attending' => false,
                    'allergies' => null,
                ]);

                $group->update([
                    'submitted_at' => now(),
                    'transport' => 'NO_CONFIRMADO',
                    'bus_onda_ida' => false,
                    'bus_onda_vuelta' => false,
                    'bus_cs' => false,
                    'contact_email' => null,
                    'contact_phone' => null,
                ]);
            }
        });

        // Send confirmation email if contact email was provided
        $group->refresh()->load('guests');
        if ($group->contact_email) {
            Mail::to($group->contact_email)->queue(new RsvpConfirmationMail($group));
        }

        // Notify all admins
        $admins = User::all();
        foreach ($admins as $admin) {
            Mail::to($admin->email)->queue(new AdminRsvpNotificationMail($group, $attending, $isUpdate));
        }

        $message = $attending
            ? '¡Gracias por confirmar! Nos vemos el 20 de junio.'
            : 'Lamentamos que no podáis acompañarnos. ¡Gracias por responder!';

        return back()->with('success', $message);
    }

    public function askQuestion(Request $request)
    {
        $group = $this->getAuthenticatedGroup();

        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        GuestQuestion::create([
            'invitation_group_id' => $group->id,
            'message' => $validated['message'],
        ]);

        // Send email to all admin users
        $admins = User::all();
        foreach ($admins as $admin) {
            Mail::to($admin->email)->queue(new GuestQuestionMail($group->name, $validated['message']));
        }

        return back()->with('success', '¡Pregunta enviada! Os responderemos lo antes posible.');
    }

    public function searchSongs(Request $request)
    {
        $this->getAuthenticatedGroup();

        $query = $request->validate(['q' => 'required|string|max:100'])['q'];

        $response = Http::timeout(5)->get('https://itunes.apple.com/search', [
            'term'   => $query,
            'media'  => 'music',
            'entity' => 'song',
            'limit'  => 10,
        ]);

        if (!$response->successful()) {
            return response()->json(['results' => []]);
        }

        $results = collect($response->json('results', []))->map(fn($t) => [
            'id'          => (string) ($t['trackId'] ?? ''),
            'title'       => $t['trackName'] ?? '',
            'artist'      => $t['artistName'] ?? '',
            'album'       => $t['collectionName'] ?? null,
            'artwork'     => isset($t['artworkUrl100'])
                ? str_replace('100x100bb', '300x300bb', $t['artworkUrl100'])
                : null,
            'preview_url' => $t['previewUrl'] ?? null,
        ])->filter(fn($t) => $t['id'] && $t['title'])->values();

        return response()->json(['results' => $results]);
    }

    public function suggestSong(Request $request)
    {
        $group = $this->getAuthenticatedGroup();

        $validated = $request->validate([
            'track_title'     => 'required|string|max:255',
            'artist_name'     => 'required|string|max:255',
            'album_name'      => 'nullable|string|max:255',
            'artwork_url'     => 'nullable|url|max:500',
            'itunes_track_id' => 'nullable|string|max:50',
            'preview_url'     => 'nullable|url|max:500',
        ]);

        if ($group->songSuggestions()->count() >= 20) {
            return back()->with('error', 'Máximo 20 canciones por grupo.');
        }

        // Avoid duplicates
        if ($validated['itunes_track_id'] && $group->songSuggestions()->where('itunes_track_id', $validated['itunes_track_id'])->exists()) {
            return back();
        }

        $group->songSuggestions()->create($validated);

        // Notify all admins
        $admins = User::all();
        foreach ($admins as $admin) {
            Mail::to($admin->email)->queue(new AdminSongNotificationMail(
                $group,
                $validated['track_title'],
                $validated['artist_name'],
                $validated['artwork_url'] ?? null,
            ));
        }

        return back()->with('success', '¡Canción añadida!');
    }

    public function removeSuggestion(SongSuggestion $suggestion)
    {
        $group = $this->getAuthenticatedGroup();

        if ($suggestion->invitation_group_id !== $group->id) {
            abort(403);
        }

        $suggestion->delete();

        return back()->with('success', 'Canción eliminada.');
    }

    public function ourStory()
    {
        $this->getAuthenticatedGroup();

        return Inertia::render('Guest/OurStory');
    }

    private function getWeddingInfo(): array
    {
        $settings = WeddingSetting::current();

        if (!$settings) {
            // Fallback to default values if no settings exist
            return [
                'bride' => 'Ana',
                'groom' => 'Alex',
                'date' => '2026-06-20',
                'civil_ceremony_date' => '2026-06-19',
                'venue' => [
                    'name' => 'La Ópera',
                    'address' => 'Benicàssim, Castellón',
                    'url' => 'https://laoperabenicassim.com/',
                    'parking' => 'Parking subterráneo gratuito disponible',
                ],
                'schedule' => [],
                'schedule_translations' => [],
                'transport' => [
                    'buses_available' => true,
                    'buses_info' => 'Autobuses gratuitos desde Onda y Castellón',
                    'parking_available' => true,
                ],
            ];
        }

        return [
            'bride' => $settings->bride,
            'groom' => $settings->groom,
            'date' => $settings->wedding_date?->format('Y-m-d'),
            'civil_ceremony_date' => $settings->civil_ceremony_date?->format('Y-m-d'),
            'venue' => [
                'name' => $settings->venue_name,
                'address' => $settings->venue_address,
                'url' => $settings->venue_url,
                'parking' => $settings->venue_parking_info,
            ],
            'schedule' => $settings->schedule ?? [],
            'schedule_translations' => $settings->schedule_translations ?? [],
            'transport' => [
                'buses_available' => $settings->buses_available,
                'buses_info' => $settings->buses_info,
                'parking_available' => $settings->parking_available,
            ],
        ];
    }
}
