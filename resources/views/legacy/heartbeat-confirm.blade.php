<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Legacy heartbeat confirmed</title>
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
                display: flex;
                min-height: 100vh;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .card {
                max-width: 480px;
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid rgba(148, 163, 184, 0.2);
                border-radius: 1.5rem;
                padding: 2rem;
                text-align: center;
            }

            h1 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }

            p {
                color: #94a3b8;
                font-size: 0.95rem;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Thanks for checking in</h1>
            <p>Your legacy note "{{ $message->title }}" stays in the vault. We’ll ask again on the next heartbeat.</p>
            <p style="margin-top: 1rem; font-size: 0.85rem">
                Need to pause deliveries? Open your Remindly dashboard → Legacy tab.
            </p>
        </div>
    </body>
</html>
