<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'auth.admin' => \App\Http\Middleware\CheckAdmin::class,
            'auth.customer' => \App\Http\Middleware\CheckCustomer::class,
            'auth.staff' => \App\Http\Middleware\CheckStaff::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
  
    ->create();
    
    // $app->register(Fruitcake\Cors\CorsServiceProvider::class);