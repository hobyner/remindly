<?php

namespace App\Services\Integrations;

use App\Enums\ReminderChannel;
use App\Models\ChannelCredential;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class MetaService
{
    public function verify(array $credentials): array
    {
        $response = Http::withToken($credentials['access_token'])
            ->get(sprintf('%s/%s', rtrim(config('services.meta.base_url'), '/'), $credentials['phone_number_id']));

        if ($response->failed()) {
            throw new \RuntimeException($response->json('error.message', 'Unable to verify Meta credentials'));
        }

        return $response->json();
    }

    public function saveCredentials(User $user, array $credentials): ChannelCredential
    {
        return ChannelCredential::updateOrCreate(
            ['user_id' => $user->id, 'channel' => ReminderChannel::WhatsApp->value],
            [
                'settings' => $credentials,
                'verified_at' => now(),
                'status' => 'active',
            ],
        );
    }

    public function templates(ChannelCredential $credential): array
    {
        $settings = $credential->settings;
        $businessId = $settings['business_id'] ?? config('services.meta.business_id');
        $accessToken = $settings['access_token'] ?? config('services.meta.access_token');

        if (!$businessId || !$accessToken) {
            throw new \RuntimeException('Meta credentials incomplete');
        }

        $response = Http::withToken($accessToken)
            ->get(sprintf('%s/%s/message_templates', rtrim(config('services.meta.base_url'), '/'), $businessId));

        if ($response->failed()) {
            throw new \RuntimeException($response->json('error.message', 'Unable to fetch templates'));
        }

        return $response->json('data', []);
    }
}
