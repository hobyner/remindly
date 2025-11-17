<?php

namespace App\Http\Controllers;

use App\Models\LegacyMessage;
use App\Support\LegacyAttachmentManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LegacyMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $messages = $request->user()
            ->legacyMessages()
            ->with('recipients')
            ->latest()
            ->get();

        $user = $request->user();

        $summary = [
            'drafts' => $user->legacyMessages()->where('status', 'draft')->count(),
            'armed' => $user->legacyMessages()->where('status', 'armed')->count(),
            'delivered' => $user->legacyMessages()->where('status', 'delivered')->count(),
        ];

        $nextCheckIn = $user->legacyMessages()
            ->where('status', 'armed')
            ->whereNotNull('next_check_in_due_at')
            ->orderBy('next_check_in_due_at')
            ->first();

        $upcoming = $user->legacyMessages()
            ->where('status', 'armed')
            ->orderBy('next_check_in_due_at')
            ->limit(3)
            ->get(['id', 'title', 'next_check_in_due_at', 'deliver_at', 'status']);

        $summary['next_check_in_due_at'] = optional($nextCheckIn)->next_check_in_due_at;
        $summary['upcoming'] = $upcoming;

        return response()->json([
            'data' => $messages,
            'paused' => $user->legacy_paused_at !== null,
            'legacy_paused_at' => $user->legacy_paused_at,
            'summary' => $summary,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);

        $message = DB::transaction(function () use ($request, $data) {
            $message = $request->user()->legacyMessages()->create($data);

            LegacyAttachmentManager::handleUploads(
                $request->file('file'),
                $request->file('voice_note'),
                $message
            );

            $message->save();

            $this->syncRecipients($message, $request->input('recipients', []));

            return $message->load('recipients');
        });

        return response()->json(['data' => $message], 201);
    }

    public function show(Request $request, LegacyMessage $legacyMessage): JsonResponse
    {
        $this->authorizeMessage($request, $legacyMessage);

        return response()->json(['data' => $legacyMessage->load('recipients', 'checkins')]);
    }

    public function update(Request $request, LegacyMessage $legacyMessage): JsonResponse
    {
        $this->authorizeMessage($request, $legacyMessage);

        if ($legacyMessage->status === 'delivering') {
            abort(422, 'Message is currently delivering and cannot be updated.');
        }

        $data = $this->validatedData($request);

        $message = DB::transaction(function () use ($legacyMessage, $data, $request) {
            $legacyMessage->update($data);

            LegacyAttachmentManager::handleUploads(
                $request->file('file'),
                $request->file('voice_note'),
                $legacyMessage
            );

            $legacyMessage->save();

            $this->syncRecipients($legacyMessage, $request->input('recipients', []));

            return $legacyMessage->load('recipients');
        });

        return response()->json(['data' => $message]);
    }

    public function destroy(Request $request, LegacyMessage $legacyMessage): JsonResponse
    {
        $this->authorizeMessage($request, $legacyMessage);
        $legacyMessage->delete();

        return response()->json(['status' => 'deleted']);
    }

    public function arm(Request $request, LegacyMessage $legacyMessage): JsonResponse
    {
        $this->authorizeMessage($request, $legacyMessage);

        if ($legacyMessage->recipients()->count() === 0) {
            abort(422, 'Add at least one trusted contact before arming.');
        }

        $legacyMessage->fill([
            'status' => 'armed',
            'armed_at' => now(),
            'last_check_in_at' => now(),
        ]);

        $legacyMessage->heartbeat_token ??= Str::uuid()->toString();
        $legacyMessage->scheduleNextCheckIn();
        $legacyMessage->save();

        return response()->json(['data' => $legacyMessage->fresh('recipients')]);
    }

    public function disarm(Request $request, LegacyMessage $legacyMessage): JsonResponse
    {
        $this->authorizeMessage($request, $legacyMessage);

        $legacyMessage->update([
            'status' => 'draft',
            'armed_at' => null,
            'next_check_in_due_at' => null,
        ]);

        return response()->json(['data' => $legacyMessage->fresh('recipients')]);
    }

    public function togglePause(Request $request): JsonResponse
    {
        $data = $request->validate([
            'paused' => ['required', 'boolean'],
        ]);

        $request->user()->forceFill([
            'legacy_paused_at' => $data['paused'] ? now() : null,
        ])->save();

        return response()->json([
            'paused' => $request->user()->legacy_paused_at !== null,
            'legacy_paused_at' => $request->user()->legacy_paused_at,
        ]);
    }

    protected function authorizeMessage(Request $request, LegacyMessage $legacyMessage): void
    {
        if ($legacyMessage->user_id !== $request->user()->id) {
            abort(403);
        }
    }

    protected function validatedData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'check_in_frequency_unit' => ['required', 'in:minute,hour,day,week,month'],
            'check_in_frequency_value' => ['required', 'integer', 'min:1', 'max:365'],
            'grace_period_minutes' => ['required', 'integer', 'min:15', 'max:43200'],
            'deliver_at' => ['nullable', 'date'],
            'file' => ['nullable', 'file', 'max:5120'],
            'voice_note' => ['nullable', 'file', 'max:20480'],
        ]);
    }

    protected function syncRecipients(LegacyMessage $legacyMessage, array $recipients): void
    {
        $idsToKeep = [];

        foreach ($recipients as $recipient) {
            $payload = validator($recipient, [
                'id' => ['nullable', 'integer', 'exists:legacy_recipients,id'],
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email'],
                'phone' => ['nullable', 'string', 'max:30'],
                'channel_preference' => ['nullable', 'in:email,whatsapp,sms'],
            ])->validated();

            if (isset($payload['id'])) {
                $model = $legacyMessage->recipients()->where('id', $payload['id'])->firstOrFail();
                $model->update([
                    'name' => $payload['name'],
                    'email' => $payload['email'],
                    'phone' => $payload['phone'] ?? null,
                    'channel_preference' => $payload['channel_preference'] ?? 'email',
                ]);
            } else {
                $model = $legacyMessage->recipients()->create([
                    'name' => $payload['name'],
                    'email' => $payload['email'],
                    'phone' => $payload['phone'] ?? null,
                    'channel_preference' => $payload['channel_preference'] ?? 'email',
                ]);
            }

            $idsToKeep[] = $model->id;
        }

        if (! empty($idsToKeep)) {
            $legacyMessage->recipients()->whereNotIn('id', $idsToKeep)->delete();
        }
    }
}
