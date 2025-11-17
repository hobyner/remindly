<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request , Closure )
    {
        if (! ->user() || ! ->user()->is_admin) {
            abort(403, 'Admin access only.');
        }

        return ();
    }
}
