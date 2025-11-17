<?php

use Illuminate\Support\Facades\Route;

Route::get('/.well-known/{path}', fn () => response()->noContent())
    ->where('path', '.*');

Route::view('/login', 'app')->name('login.screen');
Route::view('/register', 'app')->name('register.screen');
Route::get('/legacy/heartbeat/{token}', [\App\Http\Controllers\LegacyPublicController::class, 'confirmHeartbeat'])
    ->name('legacy.heartbeat.confirm')
    ->middleware('signed');
Route::get('/legacy/messages/{recipient}/view', [\App\Http\Controllers\LegacyPublicController::class, 'viewRecipient'])
    ->name('legacy.recipient.view')
    ->middleware('signed');
Route::post('/legacy/messages/{recipient}/verify', [\App\Http\Controllers\LegacyPublicController::class, 'verifyRecipient'])
    ->name('legacy.recipient.verify');
Route::get('/legacy/messages/{recipient}/download/{type}', [\App\Http\Controllers\LegacyPublicController::class, 'downloadAttachment'])
    ->name('legacy.recipient.download')
    ->middleware('signed');

Route::view('/legacy', 'app');
Route::view('/dashboard', 'app');
Route::view('/calendar', 'app');
Route::view('/reminders', 'app');
Route::view('/templates', 'app');
Route::view('/billing', 'app');
Route::view('/settings', 'app');
Route::view('/contacts', 'app');
Route::view('/admin/{view?}', 'app')
    ->where('view', '(.*)');

Route::view('/{view?}', 'app')
    ->where('view', '^(?!legacy/(messages|heartbeat)).*$')
    ->name('spa');
