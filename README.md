# Remindly

Remindly is a full-stack reminder automation platform that lets teams orchestrate birthday shoutouts, bill nudges, meeting alerts, and promo blasts عبر WhatsApp (Meta Cloud API) or email. It ships with a Laravel 12 API (Sanctum auth, scheduler-driven delivery, Paystack billing) and a modern Vite + React dashboard powered by Tailwind 4 and Redux Toolkit.

## Feature Highlights
- **Multi-channel reminders** – WhatsApp via Meta Cloud API + transactional email fallback.
- **Event-aware calendar** – drag-friendly (informational) FullCalendar view fed directly from reminder schedules.
- **Auto-messaging templates** – categorized gallery with personalization tokens (`{{contact.first_name}}`, etc.).
- **Contacts & CRM extras** – tags, timezone-aware scheduling, reminder history logs.
- **Paystack subscriptions** – unlock unlimited reminders, webhooks keep subscriptions in sync.
- **Laravel Scheduler + Queue** – due reminders fan-out to jobs every minute for reliable delivery.

## Tech Stack
- **Backend:** PHP 8.2, Laravel 12, Sanctum, Scheduler/Queue (database), Guzzle HTTP.
- **Frontend:** React 18, Vite, Tailwind CSS v4, Redux Toolkit, React Router, FullCalendar.
- **Database:** MySQL 8 (see `.env.example` for defaults).
- **Payments & Messaging:** Paystack REST API, Meta Cloud WhatsApp API, Laravel Mail markdown templates.

## Quick Start

### 1. Environment
```bash
cp .env.example .env
php artisan key:generate
```
Set the following in `.env`:

| Key | Description |
| --- | --- |
| `DB_*` | MySQL connection for the core app. |
| `META_ACCESS_TOKEN`, `META_PHONE_NUMBER_ID`, `META_BUSINESS_ID`, `META_WEBHOOK_VERIFY_TOKEN` | Meta Cloud credentials + verify token for the webhook challenge. |
| `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_CALLBACK_URL` | Paystack keys for subscription checkout + webhook callback. |
| `VITE_API_URL` | Frontend base URL to the Laravel API (`http://localhost/api` for local dev). |

### 2. Backend
```bash
composer install
php artisan migrate --seed
php artisan schedule:work # or schedule:run from cron every minute
php artisan queue:work    # database queue connection
php artisan serve
```

### 3. Frontend
```bash
npm install
npm run dev  # Vite dev server with hot reload
```

### 4. Scheduler & Webhooks
- **Dispatch due reminders:** the `remindly:dispatch-due` command is already scheduled every minute via `app/Console/Kernel.php`. Hook it into cron (`* * * * * php artisan schedule:run`).
- **Queue worker:** keep `php artisan queue:work --tries=3` running (Supervisor/PM2/etc.).
- **Meta webhook:** point Meta to `https://your-domain/api/webhooks/meta` with the verification token from `.env`.
- **Paystack webhook:** set `https://your-domain/api/payments/paystack/webhook` inside the Paystack dashboard.

## API Surface (Sanctum protected unless noted)

| Method | Path | Description |
| --- | --- | --- |
| `POST /api/auth/register` | Create a user + token. |
| `POST /api/auth/login` | Exchange credentials for token. |
| `GET /api/me` | Profile, contacts, reminders, templates. |
| `apiResource /contacts` | Manage CRM contacts. |
| `apiResource /templates` | CRUD auto-messaging templates. |
| `apiResource /reminders` | Create + manage reminders (queue trigger at `/reminders/{id}/queue`). |
| `GET /api/calendar/events` | Calendar feed. |
| `POST /api/payments/paystack/initialize` | Begin a Paystack checkout. |
| `POST /api/integrations/meta/verify` | Save Meta Cloud credentials per user. |
| `GET /api/integrations/meta/templates` | Fetch approved WhatsApp templates. |
| `POST /api/payments/paystack/webhook` | Paystack webhook (no auth). |
| `GET|POST /api/webhooks/meta` | Meta verify + status callbacks (no auth). |

## Frontend Modules
- `resources/js/pages/DashboardPage.jsx` – hero stats, upcoming reminders, template highlights.
- `resources/js/pages/CalendarPage.jsx` – FullCalendar DayGrid view.
- `resources/js/pages/RemindersPage.jsx` – reminder composer + timeline.
- `resources/js/pages/TemplatesPage.jsx` – template builder/gallery.
- `resources/js/pages/SettingsPage.jsx` – Meta Cloud credential manager.
- `resources/js/pages/BillingPage.jsx` – Paystack plan selector + inline checkout trigger.

Redux slices live in `resources/js/store/slices/*` and share a common Axios client (`resources/js/api/client.js`) that automatically injects the Sanctum token from `localStorage`.

## Messaging Flow
1. User creates a reminder via the React form → API stores it with `next_run_at`.
2. `remindly:dispatch-due` finds due reminders and dispatches `SendReminderJob`.
3. The job renders the body (`TemplateRenderer`), hits WhatsApp (Meta Cloud) or sends email (`ReminderMail`), logs the attempt, and reschedules recurrent reminders.

## Billing Flow
1. User clicks “Subscribe with Paystack” → backend creates a `payments` row + initializes Paystack.
2. Paystack redirects back and fires a webhook → we verify signature, update the payment, and activate the `subscriptions` record for a month-long cycle.

## Testing
- Run feature/unit tests with `php artisan test`.
- Frontend linting/formatting can be wired to `npm run lint` (add as needed).
- For end-to-end validation consider wiring Playwright/Cypress against the running stack (not included by default).

Happy shipping! 🎉
