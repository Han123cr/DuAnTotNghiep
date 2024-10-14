<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->guard('admin')->check()) {
            return response()->json(['message' => 'Unauthorized'], 403); // Trả về mã lỗi 403
        }

        return $next($request);
    }
}