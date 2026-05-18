<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicSection;
use Illuminate\Http\Request;

class MusicSectionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'emoji' => ['required', 'string', 'max:10'],
        ]);

        $maxOrder = MusicSection::max('sort_order') ?? -1;
        MusicSection::create([...$validated, 'sort_order' => $maxOrder + 1]);

        return back()->with('success', "Sección \"{$validated['name']}\" creada");
    }

    public function update(Request $request, MusicSection $section)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'emoji' => ['sometimes', 'required', 'string', 'max:10'],
        ]);

        $section->update($validated);

        return back()->with('success', 'Sección actualizada');
    }

    public function destroy(MusicSection $section)
    {
        if ($section->moments()->exists()) {
            return back()->withErrors(['section' => 'No puedes eliminar una sección que tiene momentos. Muévelos primero.']);
        }

        $name = $section->name;
        $section->delete();

        return back()->with('success', "Sección \"{$name}\" eliminada");
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'exists:music_sections,id'],
            'sections.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['sections'] as $item) {
            MusicSection::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Orden actualizado');
    }
}
