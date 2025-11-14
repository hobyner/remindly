<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::post('register', [\App\Http\Controllers\AuthController::class, 'register']);
        Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('me', [\App\Http\Controllers\AuthController::class, 'me']);
        Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);

        Route::apiResource('contacts', \App\Http\Controllers\ContactController::class);
        Route::apiResource('templates', \App\Http\Controllers\ReminderTemplateController::class);
        Route::apiResource('reminders', \App\Http\Controllers\ReminderController::class);

        Route::get('calendar/events', [\App\Http\Controllers\CalendarController::class, 'index']);
        Route::post('reminders/{reminder}/queue', [\App\Http\Controllers\ReminderController::class, 'queue']);

        Route::post('payments/paystack/initialize', [\App\Http\Controllers\PaymentController::class, 'initialize']);
        Route::post('integrations/meta/verify', [\App\Http\Controllers\IntegrationController::class, 'verifyMetaCredentials']);
        Route::get('integrations/meta/templates', [\App\Http\Controllers\IntegrationController::class, 'listMetaTemplates']);
    });
});

Route::post('payments/paystack/webhook', [\App\Http\Controllers\PaymentController::class, 'webhook']);
Route::match(['get', 'post'], 'webhooks/meta', [\App\Http\Controllers\IntegrationController::class, 'handleMetaWebhook']);
