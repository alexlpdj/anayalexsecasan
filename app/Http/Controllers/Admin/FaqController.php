<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = Faq::ordered()->get();

        return Inertia::render('admin/faqs/index', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);

        // Obtener el siguiente orden
        $maxOrder = Faq::max('order') ?? 0;
        $validated['order'] = $maxOrder + 1;

        Faq::create($validated);

        return redirect()->back()->with('success', 'FAQ creada correctamente');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return redirect()->back()->with('success', 'FAQ actualizada correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        $faq->delete();

        return redirect()->back()->with('success', 'FAQ eliminada correctamente');
    }

    /**
     * Update the order of FAQs
     */
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

    /**
     * Toggle active status
     */
    public function toggleActive(Faq $faq)
    {
        $faq->update(['is_active' => !$faq->is_active]);

        return redirect()->back()->with('success', 'Estado actualizado correctamente');
    }
}
