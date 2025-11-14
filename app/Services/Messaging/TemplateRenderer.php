<?php

namespace App\Services\Messaging;

use App\Models\Reminder;
use Illuminate\Support\Arr;

class TemplateRenderer
{
    public function render(Reminder $reminder): array
    {
        $context = $this->context($reminder);
        $subject = $reminder->template?->subject ?? $reminder->title;
        $bodyTemplate = $reminder->template?->body ?? ($reminder->description ?: $reminder->title);

        return [
            'subject' => $this->replace($subject, $context),
            'body' => $this->replace($bodyTemplate, $context),
            'context' => $context,
        ];
    }

    private function context(Reminder $reminder): array
    {
        return [
            'reminder' => [
                'title' => $reminder->title,
                'type' => $reminder->type,
                'send_at' => optional($reminder->send_at)?->toDateTimeString(),
            ],
            'contact' => [
                'first_name' => $reminder->contact?->first_name,
                'last_name' => $reminder->contact?->last_name,
            ],
            'user' => [
                'name' => $reminder->user?->name,
                'email' => $reminder->user?->email,
            ],
        ];
    }

    private function replace(string $body, array $context): string
    {
        return preg_replace_callback('/{{\s*([a-zA-Z0-9._]+)\s*}}/', function ($matches) use ($context) {
            $value = Arr::get($context, $matches[1]);
            return is_scalar($value) ? (string) $value : '';
        }, $body);
    }
}
