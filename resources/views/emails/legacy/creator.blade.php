<x-mail::message>
# Your legacy note was delivered

Your legacy message **"{{ $messageTitle }}"** has been released to: {{ $recipientNames ?: 'no recipients' }}.

We’ll keep an audit trail in your dashboard. You may pause or delete any remaining notes at any time.

Stay assured,<br>
{{ config('app.name') }} Legacy Desk
</x-mail::message>
