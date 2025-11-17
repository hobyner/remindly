<x-mail::message>
# Private note released

Hi {{ $recipientName }},

Someone trusted you enough to share an important message through Remindly. Their note **"{{ $messageTitle }}"** has just been unlocked.

<x-mail::button :url="$viewUrl">
View secure message
</x-mail::button>

Security code: **{{ $secondaryCode }}**

You’ll be asked for this one-time code before the note unlocks. Please keep it private.

— {{ config('app.name') }} Legacy delivery
</x-mail::message>
