<?php

namespace App\Http\Controllers\Admin;

use App\Enums\GiftStatus;
use App\Enums\GiftType;
use App\Http\Controllers\Controller;
use App\Models\BudgetItem;
use App\Models\BudgetSetting;
use App\Models\Gift;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GiftsController extends Controller
{
    public function index()
    {
        $gifts = Gift::with('guest:id,name,invitation_group_id')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        $totalReceived = (float) Gift::received()->sum('amount');
        $totalPending = (float) Gift::pending()->sum('amount');
        $budgetSpent = (int) BudgetItem::sum('value');
        $budgetTarget = (int) BudgetSetting::getTarget();

        return Inertia::render('admin/gifts/index', [
            'gifts' => $gifts,
            'guests' => Guest::orderBy('name')->get(['id', 'name']),
            'totals' => [
                'received' => $totalReceived,
                'pending' => $totalPending,
                'count' => $gifts->count(),
                'budget_target' => $budgetTarget,
                'budget_spent' => $budgetSpent,
                'net' => $totalReceived - $budgetSpent,
                'coverage_pct' => $budgetTarget > 0
                    ? min(100, round(($totalReceived / $budgetTarget) * 100))
                    : 0,
            ],
            'types' => GiftType::options(),
            'statuses' => GiftStatus::options(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['sort_order'] = (int) Gift::max('sort_order') + 1;

        Gift::create($data);

        return back();
    }

    public function update(Request $request, Gift $gift)
    {
        $gift->update($this->validated($request));

        return back();
    }

    public function destroy(Gift $gift)
    {
        $gift->delete();

        return back();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'guest_id' => 'nullable|exists:guests,id',
            'display_name' => 'required|string|max:160',
            'amount' => 'nullable|numeric|min:0|max:999999.99',
            'type' => ['required', Rule::enum(GiftType::class)],
            'status' => ['required', Rule::enum(GiftStatus::class)],
            'received_at' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);
    }
}
