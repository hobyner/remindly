<?php

namespace App\Services\Messaging;

use App\Enums\ReminderChannel;
use App\Models\Reminder;
use Illuminate\Support\Facades\Http;

class WhatsAppClient
{
    public function sendTextMessage(Reminder $reminder, array $content): array
    {
        $credential = $reminder->user->channelCredentials()
            ->where('channel', ReminderChannel::WhatsApp->value)
            ->first();

        $settings = $credential?->settings ?? [];
        $token = $settings['access_token'] ?? config('services.meta.access_token');
        $phoneNumberId = $settings['phone_number_id'] ?? config('services.meta.phone_number_id');

        if (!$token || !$phoneNumberId) {
            throw new \RuntimeException('WhatsApp credentials missing');
        }

        $recipient = $reminder->contact?->whatsapp_number ?? $reminder->contact?->phone_number;

        if (!$recipient) {
            throw new \RuntimeException('Contact WhatsApp number missing');
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $recipient,
            'type' => 'text',
            'text' => [
                'preview_url' => false,
                'body' => $content['body'],
            ],
        ];

        $response = Http::withToken($token)
            ->post(sprintf('%s/%s/messages', rtrim(config('services.meta.base_url'), '/'), $phoneNumberId), $payload);

        if ($response->failed()) {
            throw new \RuntimeException($response->json('error.message', 'WhatsApp API error'));
        }

        return $response->json();
    }
}
