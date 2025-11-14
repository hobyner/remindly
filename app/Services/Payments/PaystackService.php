<?php

namespace App\Services\Payments;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaystackService
{
    public function initialize(User $user, int $amount, string $plan): array
    {
        if (!config('services.paystack.secret_key')) {
            throw new \RuntimeException('Missing Paystack secret key.');
        }

        $reference = 'rem-' . Str::uuid();

        $payment = Payment::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'amount' => $amount,
            'currency' => 'NGN',
            'provider' => 'paystack',
            'status' => PaymentStatus::Pending,
            'metadata' => [
                'plan' => $plan,
            ],
        ]);

        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post('https://api.paystack.co/transaction/initialize', [
                'email' => $user->email,
                'amount' => $amount * 100,
                'reference' => $payment->reference,
                'callback_url' => config('services.paystack.callback_url'),
                'metadata' => [
                    'plan' => $plan,
                    'user_id' => $user->id,
                ],
            ]);

        if ($response->failed()) {
            throw new \RuntimeException($response->json('message', 'Unable to initialize Paystack payment'));
        }

        return $response->json('data');
    }

    public function verifySignature(string $payload, ?string $signature): void
    {
        $secret = config('services.paystack.secret_key');

        if (!$secret) {
            throw new \RuntimeException('Missing Paystack secret key.');
        }
        $hash = hash_hmac('sha512', $payload, $secret);

        abort_unless(
            $signature && hash_equals($hash, $signature),
            401,
            'Invalid Paystack signature'
        );
    }

    public function handleWebhook(array $data): void
    {
        $reference = data_get($data, 'data.reference');
        if (!$reference) {
            return;
        }

        $payment = Payment::where('reference', $reference)->first();

        if (!$payment) {
            return;
        }

        $status = data_get($data, 'data.status');

        if ($status === 'success') {
            $payment->status = PaymentStatus::Successful;
            $payment->metadata = array_merge($payment->metadata ?? [], [
                'gateway_response' => data_get($data, 'data.gateway_response'),
            ]);
            $payment->save();

            $plan = $payment->metadata['plan'] ?? 'pro-monthly';

            $subscription = Subscription::firstOrCreate(
                ['user_id' => $payment->user_id],
                []
            );

            $subscription->fill([
                'plan' => $plan,
                'status' => SubscriptionStatus::Active,
                'starts_at' => now(),
                'expires_at' => now()->addMonth(),
                'next_renewal_at' => now()->addMonth(),
            ])->save();
        } elseif ($status === 'failed') {
            $payment->status = PaymentStatus::Failed;
            $payment->save();
        }
    }
}
