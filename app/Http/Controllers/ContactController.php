<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $contacts = Contact::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json($contacts);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'whatsapp_number' => ['nullable', 'string', 'max:20'],
            'timezone' => ['required', 'string', 'max:64'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $contact = Contact::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($contact, 201);
    }

    public function show(Request $request, Contact $contact): JsonResponse
    {
        $this->authorizeContact($request, $contact);

        return response()->json($contact);
    }

    public function update(Request $request, Contact $contact): JsonResponse
    {
        $this->authorizeContact($request, $contact);

        $data = $request->validate([
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'whatsapp_number' => ['nullable', 'string', 'max:20'],
            'timezone' => ['sometimes', 'string', 'max:64'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $contact->update($data);

        return response()->json($contact);
    }

    public function destroy(Request $request, Contact $contact): JsonResponse
    {
        $this->authorizeContact($request, $contact);
        $contact->delete();

        return response()->json([
            'message' => 'Contact deleted',
        ]);
    }

    private function authorizeContact(Request $request, Contact $contact): void
    {
        abort_unless($contact->user_id === $request->user()->id, 403);
    }
}
