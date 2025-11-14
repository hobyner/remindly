<?php

use Illuminate\Support\Facades\Route;

Route::view('/{view?}', 'app')
    ->where('view', '(.*)')
    ->name('spa');
