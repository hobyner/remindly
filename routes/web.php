<?php

use Illuminate\Support\Facades\Route;

Route::view('/login', 'app')->name('login.screen');
Route::view('/register', 'app')->name('register.screen');

Route::view('/{view?}', 'app')
    ->where('view', '(.*)')
    ->name('spa');
