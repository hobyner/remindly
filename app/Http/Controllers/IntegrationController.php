<?php

namespace App\Http\Controllers;

use App\Models\ChannelCredential;
use App\Services\Integrations\MetaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegrationController extends Controller
{
    public function __construct(private MetaService $metaService)
    {
    }

    public function verifyMetaCredentials(Request $request): JsonResponse
    {
        $data = $request->validate([
            'access_token' => ['required', 'string'],
            'phone_number_id' => ['required', 'string'],
            'business_id' => ['required', 'string'],
        ]);

        $this->metaService->verify($data);
        $credential = $this->metaService->saveCredentials($request->user(), $data);

        return response()->json([
            'message' => 'WhatsApp connected',
            'credential' => $credential,
        ]);
    }

    public function listMetaTemplates(Request $request): JsonResponse
    {
        /** @var ChannelCredential|null $credential */
        $credential = $request->user()->channelCredentials()
            ->where('channel', 'whatsapp')
            ->first();

        abort_unless($credential, 404, 'Connect WhatsApp first.');

        $templates = $this->metaService->templates($credential);

        return response()->json($templates);
    }

    public function handleMetaWebhook(Request $request)
    {
        if ($request->isMethod('get')) {
            if ($request->get('hub_mode') === 'subscribe' && $request->get('hub_verify_token') === config('services.meta.webhook_token')) {
                return response($request->get('hub_challenge'));
            }

            abort(403, 'Invalid verification token');
        }

        return response()->json(['status' => 'received']);
    }
}
