<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BudgetItem;
use App\Models\BudgetSetting;
use App\Models\Gift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/budget/index', [
            'items' => BudgetItem::orderBy('sort_order')->orderBy('id')->get(),
            'target' => BudgetSetting::getTarget(),
            'giftsTotal' => (float) Gift::received()->sum('amount'),
        ]);
    }

    public function storeItem(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:50',
            'value' => 'required|integer|min:0',
            'max' => 'required|integer|min:100',
        ]);

        $data['sort_order'] = BudgetItem::max('sort_order') + 1;

        BudgetItem::create($data);

        return back();
    }

    public function updateItem(Request $request, BudgetItem $item)
    {
        $data = $request->validate([
            'value' => 'required|integer|min:0',
        ]);

        $item->update($data);

        return back();
    }

    public function destroyItem(BudgetItem $item)
    {
        $item->delete();

        return back();
    }

    public function updateTarget(Request $request)
    {
        $data = $request->validate([
            'target' => 'required|integer|min:0',
        ]);

        BudgetSetting::setTarget($data['target']);

        return back();
    }
}
