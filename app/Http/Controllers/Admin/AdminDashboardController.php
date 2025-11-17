<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegacyMessage;
use App\Models\Payment;
use App\Models\Reminder;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function overview(): JsonResponse
    {
        $stats = [
            'users' => User::count(),
            'reminders' => Reminder::count(),
            'legacy_messages' => LegacyMessage::count(),
            'payments' => Payment::count(),
        ];

        $users = User::latest()->limit(10)->get(['id', 'name', 'email', 'is_admin', 'created_at']);
        $reminders = Reminder::with('contact:id,first_name,last_name,email')
            ->latest()->limit(10)
            ->get(['id', 'title', 'channel', 'send_at', 'status', 'contact_id']);
        $legacyMessages = LegacyMessage::latest()->limit(10)
            ->get(['id', 'title', 'status', 'deliver_at', 'next_check_in_due_at']);
        $payments = Payment::latest()->limit(10)
            ->get(['id', 'amount', 'status', 'provider', 'created_at']);

        return response()->json([
            'stats' => $stats,
            'users' => $users,
            'reminders' => $reminders,
            'legacy_messages' => $legacyMessages,
            'payments' => $payments,
        ]);
    }
}
