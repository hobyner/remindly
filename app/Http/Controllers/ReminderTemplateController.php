<?php

namespace App\Http\Controllers;

use App\Models\ReminderTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReminderTemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $templates = ReminderTemplate::query()
            ->where(function ($query) use ($request): void {
                $query->whereNull('user_id')
                    ->orWhere('user_id', $request->user()->id);
            })
            ->orderByDesc('is_default')
            ->paginate(15);

        return response()->json($templates);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:50'],
            'channel' => ['required', 'in:whatsapp,email'],
            'subject' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'placeholders' => ['nullable', 'array'],
        ]);

        $template = ReminderTemplate::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($template, 201);
    }

    public function show(Request $request, ReminderTemplate $template): JsonResponse
    {
        $this->authorizeTemplate($request, $template);

        return response()->json($template);
    }

    public function update(Request $request, ReminderTemplate $template): JsonResponse
    {
        $this->authorizeTemplate($request, $template);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:50'],
            'channel' => ['sometimes', 'in:whatsapp,email'],
            'subject' => ['nullable', 'string', 'max:255'],
            'body' => ['sometimes', 'string'],
            'placeholders' => ['nullable', 'array'],
        ]);

        $template->update($data);

        return response()->json($template);
    }

    public function destroy(Request $request, ReminderTemplate $template): JsonResponse
    {
        $this->authorizeTemplate($request, $template);
        $template->delete();

        return response()->json([
            'message' => 'Template deleted',
        ]);
    }

    private function authorizeTemplate(Request $request, ReminderTemplate $template): void
    {
        abort_unless($template->user_id === null || $template->user_id === $request->user()->id, 403);
    }
}
