<?php

namespace App\Services;

use App\Mail\LegacyRecipientDeliveryMail;
use App\Models\LegacyMessage;
use App\Models\LegacyRecipient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class LegacyChannelDispatcher
{
    public function send(LegacyRecipient $recipient, LegacyMessage $message, string $viewUrl, string $secondaryCode): void
    {
        switch ($recipient->channel_preference) {
            case 'whatsapp':
                $this->sendWhatsapp($recipient, $message, $viewUrl, $secondaryCode);
                break;
            case 'sms':
                $this->sendSms($recipient, $message, $viewUrl, $secondaryCode);
                break;
            default:
                $this->sendEmail($recipient, $message, $viewUrl, $secondaryCode);
        }
    }

    protected function sendEmail(LegacyRecipient $recipient, LegacyMessage $message, string $viewUrl, string $secondaryCode): void
    {
        Mail::to($recipient->email)->queue(new LegacyRecipientDeliveryMail($message, $recipient, $viewUrl, $secondaryCode));
    }

    protected function sendSms(LegacyRecipient $recipient, LegacyMessage $message, string $viewUrl, string $secondaryCode): void
    {
        Log::info('SMS placeholder for legacy delivery', [
            'recipient' => $recipient->phone,
            'message' => $message->id,
            'link' => $viewUrl,
            'code' => $secondaryCode,
        ]);
    }

    protected function sendWhatsapp(LegacyRecipient $recipient, LegacyMessage $message, string $viewUrl, string $secondaryCode): void
    {
        Log::info('WhatsApp placeholder for legacy delivery', [
            'recipient' => $recipient->phone,
            'message' => $message->id,
            'link' => $viewUrl,
            'code' => $secondaryCode,
        ]);
    }
}
