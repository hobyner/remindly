<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $start = Carbon::parse($request->query('start', now()->startOfMonth()));
        $end = Carbon::parse($request->query('end', now()->endOfMonth()));

        $events = Reminder::query()
            ->where('user_id', $request->user()->id)
            ->whereBetween('send_at', [$start, $end])
            ->with('contact')
            ->get();

        return response()->json($events);
    }
}
