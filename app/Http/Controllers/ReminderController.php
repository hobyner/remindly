<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use App\Models\ReminderTemplate;
use App\Services\Reminders\ReminderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    public function __construct(private ReminderService $reminderService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $reminders = $request->user()->reminders()->with(['contact', 'template'])->latest()->paginate(15);

        return response()->json($reminders);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);
        $this->ensureContactBelongsToUser($request, $data['contact_id']);

        if (!empty($data['reminder_template_id'])) {
            $this->ensureTemplateBelongsToUser($request, $data['reminder_template_id']);
        }

        $reminder = $this->reminderService->create($request->user(), $data);

        return response()->json($reminder, 201);
    }

    public function show(Request $request, Reminder $reminder): JsonResponse
    {
        $this->authorizeReminder($request, $reminder);

        return response()->json($reminder->load(['contact', 'template', 'logs']));
    }

    public function update(Request $request, Reminder $reminder): JsonResponse
    {
        $this->authorizeReminder($request, $reminder);
        $data = $this->validatedData($request, true);

        if (array_key_exists('contact_id', $data)) {
            $this->ensureContactBelongsToUser($request, $data['contact_id']);
        }

        if (array_key_exists('reminder_template_id', $data) && $data['reminder_template_id']) {
            $this->ensureTemplateBelongsToUser($request, $data['reminder_template_id']);
        }

        $updated = $this->reminderService->update($reminder, $data);

        return response()->json($updated);
    }

    public function destroy(Request $request, Reminder $reminder): JsonResponse
    {
        $this->authorizeReminder($request, $reminder);
        $reminder->delete();

        return response()->json(['message' => 'Reminder deleted']);
    }

    public function queue(Request $request, Reminder $reminder): JsonResponse
    {
        $this->authorizeReminder($request, $reminder);
        $queued = $this->reminderService->queue($reminder);

        return response()->json($queued);
    }

    private function authorizeReminder(Request $request, Reminder $reminder): void
    {
        abort_unless($reminder->user_id === $request->user()->id, 403);
    }

    private function ensureContactBelongsToUser(Request $request, int $contactId): void
    {
        abort_unless($request->user()->contacts()->whereKey($contactId)->exists(), 422, 'Invalid contact selected.');
    }

    private function ensureTemplateBelongsToUser(Request $request, int $templateId): void
    {
        abort_unless(
            ReminderTemplate::whereKey($templateId)
                ->where(function ($query) use ($request): void {
                    $query->whereNull('user_id')
                        ->orWhere('user_id', $request->user()->id);
                })
                ->exists(),
            422,
            'Invalid template selected.'
        );
    }

    private function validatedData(Request $request, bool $partial = false): array
    {
        $rules = [
            'title' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'contact_id' => [$partial ? 'sometimes' : 'required', 'integer', 'exists:contacts,id'],
            'reminder_template_id' => ['nullable', 'integer', 'exists:reminder_templates,id'],
            'type' => [$partial ? 'sometimes' : 'required', 'in:birthday,bill,meeting,promotion,custom'],
            'channel' => [$partial ? 'sometimes' : 'required', 'in:whatsapp,email'],
            'send_at' => [$partial ? 'sometimes' : 'required', 'date'],
            'timezone' => [$partial ? 'sometimes' : 'required', 'string'],
            'repeat_type' => ['nullable', 'in:none,daily,weekly,monthly,yearly'],
            'repeat_interval' => ['nullable', 'integer', 'min:0'],
        ];

        return $request->validate($rules);
    }
}
