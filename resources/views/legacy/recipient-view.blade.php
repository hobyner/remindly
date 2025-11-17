<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Secure legacy message</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
            rel="stylesheet"
        />
        <style>
            body {
                font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: #020617;
                color: #e2e8f0;
                padding: 2rem;
            }

            .card {
                max-width: 720px;
                margin: 0 auto;
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid rgba(148, 163, 184, 0.2);
                border-radius: 1.5rem;
                padding: 2rem;
            }

            h1 {
                font-size: 1.75rem;
                margin-bottom: 1rem;
            }

            p {
                color: #cbd5f5;
            }

            .body {
                white-space: pre-wrap;
                background: rgba(15, 23, 42, 0.6);
                border-radius: 1rem;
                padding: 1.5rem;
                margin-top: 1.5rem;
                border: 1px solid rgba(148, 163, 184, 0.25);
            }
        </style>
    </head>
    <body>
        <div class="card">
            <p style="text-transform: uppercase; letter-spacing: 0.3em; color: #94a3b8; font-size: 0.8rem">
                Secure delivery via Remindly
            </p>
            <h1>{{ $message->title }}</h1>
            <p>Hi {{ $recipient->name }}, {{ $needsCode ? 'enter your verification code to unlock the note.' : 'the note below was released for you.' }}</p>

            @if ($needsCode)
                @if ($errors->any())
                    <p style="color: #fca5a5; font-size: 0.9rem">{{ $errors->first('code') }}</p>
                @endif
                <form method="POST" action="{{ route('legacy.recipient.verify', $recipient) }}" style="margin-top: 1rem">
                    @csrf
                    <input type="hidden" name="token" value="{{ $token }}">
                    <label style="display: block; text-align: left; font-size: 0.85rem; margin-bottom: 0.5rem">One-time code</label>
                    <input
                        type="text"
                        name="code"
                        maxlength="6"
                        style="width: 100%; padding: 0.9rem 1rem; border-radius: 0.75rem; border: 1px solid rgba(148,163,184,0.3); background: rgba(15,23,42,0.6); color: #fff; font-size: 1.2rem; letter-spacing: 0.4em; text-align: center"
                        required
                    />
                    <button
                        type="submit"
                        style="margin-top: 1rem; width: 100%; padding: 0.9rem 1rem; border-radius: 1rem; border: none; background: #6366f1; color: white; font-weight: 600"
                    >
                        Unlock note
                    </button>
                </form>
            @else
                <div class="body">
                    {!! nl2br(e($message->body ?? '')) !!}
                </div>

                @if ($fileLink || $voiceLink)
                    <div style="margin-top: 1.5rem">
                        <p style="font-weight: 600; margin-bottom: 0.5rem">Attachments</p>
                        @if ($fileLink)
                            <p>
                                <a href="{{ $fileLink }}" style="color: #a5b4fc">Download file</a>
                            </p>
                        @endif
                        @if ($voiceLink)
                            <p>
                                <a href="{{ $voiceLink }}" style="color: #a5b4fc">Download voice note</a>
                            </p>
                        @endif
                    </div>
                @endif
                <p style="margin-top: 1.5rem; font-size: 0.85rem">
                    Please keep this private. If you believe this was sent in error, contact Remindly support.
                </p>
            @endif
        </div>
    </body>
</html>
