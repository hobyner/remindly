@component('mail::message')
{{ $body }}

@component('mail::panel')
Reminder: {{ $reminder->title }}  
Scheduled for: {{ optional($reminder->send_at)->toDayDateTimeString() }}
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
