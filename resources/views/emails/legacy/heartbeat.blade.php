<x-mail::message>
# Are you okay?

Your legacy note **"{{ $messageTitle }}"** needs a quick heartbeat check (scheduled {{ $frequency }}).

If everything is fine, tap the button below so we keep your message in the vault. If we don’t hear back before the grace window expires, the note will be released to your trusted recipients.

<x-mail::button :url="$confirmUrl">
Confirm I'm OK
</x-mail::button>

If this wasn’t you, pause legacy delivery from your dashboard or contact support immediately.

Stay safe,<br>
{{ config('app.name') }}
</x-mail::message>
