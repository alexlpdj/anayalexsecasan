<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::ordered()->get();
        $pendingCount = $faqs->where('needs_translation', true)->count();

        return Inertia::render('admin/faqs/index', [
            'faqs' => $faqs,
            'pendingCount' => $pendingCount,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $maxOrder = Faq::max('order') ?? 0;
        $validated['order'] = $maxOrder + 1;
        $validated['needs_translation'] = true;

        Faq::create($validated);

        return redirect()->back()->with('success', 'FAQ creada. ⚠️ Recuerda actualizar las traducciones.');
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $validated['needs_translation'] = true;
        $faq->update($validated);

        return redirect()->back()->with('success', 'FAQ actualizada. ⚠️ Recuerda actualizar las traducciones.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();

        return redirect()->back()->with('success', 'FAQ eliminada correctamente');
    }

    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'faqs' => 'required|array',
            'faqs.*.id' => 'required|exists:faqs,id',
            'faqs.*.order' => 'required|integer',
        ]);

        foreach ($validated['faqs'] as $faqData) {
            Faq::where('id', $faqData['id'])->update(['order' => $faqData['order']]);
        }

        return redirect()->back()->with('success', 'Orden actualizado correctamente');
    }

    public function toggleActive(Faq $faq)
    {
        $faq->update(['is_active' => !$faq->is_active]);

        return redirect()->back()->with('success', 'Estado actualizado correctamente');
    }

    /**
     * Translate all pending FAQs using Claude API.
     */
    public function translateAll()
    {
        $apiKey = config('services.anthropic.key');

        if (!$apiKey) {
            return back()->withErrors(['translate' => 'Falta ANTHROPIC_API_KEY en el fichero .env']);
        }

        $pending = Faq::where('needs_translation', true)->get();

        if ($pending->isEmpty()) {
            return back()->with('success', 'No hay FAQs pendientes de traducción.');
        }

        $faqsPayload = $pending->map(fn($f) => [
            'id' => $f->id,
            'question' => $f->question,
            'answer' => $f->answer,
        ])->values()->toArray();

        $languages = [
            'pt-BR' => 'Português do Brasil',
            'fr'    => 'Français',
        ];

        foreach ($languages as $code => $name) {
            $response = Http::timeout(60)->withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-haiku-4-5-20251001',
                'max_tokens' => 4096,
                'messages' => [[
                    'role' => 'user',
                    'content' =>
                        "Eres un traductor para una web de invitación de boda elegante. "
                        . "Traduce estas FAQs del español a $name. "
                        . "Devuelve ÚNICAMENTE un array JSON válido con la misma estructura y los mismos ids. "
                        . "Traduce solo question y answer, no el id. Sin bloques de código, solo JSON puro.\n\n"
                        . json_encode($faqsPayload),
                ]],
            ]);

            if ($response->failed()) {
                return back()->withErrors(['translate' => "Error al llamar a la API de Claude: " . $response->status()]);
            }

            $raw = $response->json('content.0.text', '');
            $raw = preg_replace('/^```(?:json)?\s*/m', '', $raw);
            $raw = preg_replace('/\s*```$/m', '', $raw);
            $translated = json_decode(trim($raw), true);

            if (!is_array($translated)) {
                return back()->withErrors(['translate' => "La respuesta de Claude no es JSON válido para $name."]);
            }

            foreach ($translated as $item) {
                $faq = $pending->firstWhere('id', $item['id']);
                if (!$faq) continue;

                $translations = $faq->translations ?? [];
                $translations[$code] = [
                    'question' => $item['question'],
                    'answer'   => $item['answer'],
                ];
                $faq->update(['translations' => $translations]);
            }
        }

        Faq::whereIn('id', $pending->pluck('id'))->update(['needs_translation' => false]);

        return back()->with('success', '✅ ' . $pending->count() . ' FAQs traducidas correctamente al PT y FR.');
    }
}
