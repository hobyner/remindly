<?php

namespace App\Http\Controllers;

use App\Models\LegacyMessage;
use App\Models\LegacyRecipient;
use App\Support\LegacyAttachmentManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\URL;

class LegacyPublicController extends Controller
{
    public function confirmHeartbeat(Request $request, string $token)
    {
        $message = LegacyMessage::where('heartbeat_token', $token)->firstOrFail();

        $checkin = $message->checkins()
            ->where('response_token', $request->query('checkin'))
            ->first();

        if ($checkin) {
            $checkin->update([
                'status' => 'confirmed',
                'responded_at' => now(),
            ]);
        }

        $message->update([
            'last_check_in_at' => now(),
        ]);

        $message->scheduleNextCheckIn();
        $message->save();

        return view('legacy.heartbeat-confirm', [
            'message' => $message,
        ]);
    }

    public function viewRecipient(Request $request, LegacyRecipient $recipient)
    {
        if ($request->query('token') !== $recipient->verification_code || ! $recipient->secondary_verified_at) {
            abort(403);
        }

        $recipient->loadMissing('legacyMessage');

        $needsCode = $recipient->secondary_code && ! $recipient->secondary_verified_at;

        if (! $needsCode) {
            $recipient->update([
                'delivery_status' => 'opened',
                'last_viewed_at' => now(),
            ]);
        }

        $message = $recipient->legacyMessage;

        $fileLink = $message->file_path
            ? URL::temporarySignedRoute(
                'legacy.recipient.download',
                now()->addDays(7),
                ['recipient' => $recipient->id, 'type' => 'file', 'token' => $recipient->verification_code],
            )
            : null;

        $voiceLink = $message->voice_note_path
            ? URL::temporarySignedRoute(
                'legacy.recipient.download',
                now()->addDays(7),
                ['recipient' => $recipient->id, 'type' => 'voice', 'token' => $recipient->verification_code],
            )
            : null;

        return view('legacy.recipient-view', [
            'recipient' => $recipient,
            'message' => $message,
            'needsCode' => $needsCode,
            'fileLink' => $fileLink,
            'voiceLink' => $voiceLink,
            'token' => $request->query('token'),
        ]);
    }

    public function verifyRecipient(Request $request, LegacyRecipient $recipient)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);

        if ($request->input('token') !== $recipient->verification_code) {
            abort(403);
        }

        if ($recipient->secondary_code !== $request->input('code')) {
            return back()->withErrors(['code' => 'Invalid code.'])->withInput();
        }

        $recipient->update([
            'secondary_verified_at' => now(),
            'delivery_status' => 'opened',
            'last_viewed_at' => now(),
        ]);

        return redirect(
            URL::temporarySignedRoute(
                'legacy.recipient.view',
                now()->addMinutes(30),
                [
                    'recipient' => $recipient->id,
                    'token' => $recipient->verification_code,
                ],
            ),
        );
    }

    public function downloadAttachment(Request $request, LegacyRecipient $recipient, string $type)
    {
        if ($request->query('token') !== $recipient->verification_code) {
            abort(403);
        }

        $payload = LegacyAttachmentManager::streamAttachment($recipient->legacyMessage, $type === 'voice' ? 'voice' : 'file');

        if (! $payload) {
            abort(404);
        }

        return Response::make($payload['contents'])
            ->header('Content-Type', $payload['mime'])
            ->header('Content-Disposition', 'attachment; filename="'.$payload['name'].'"');
    }
}
