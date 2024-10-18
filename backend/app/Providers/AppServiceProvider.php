<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Fruitcake\Cors\CorsServiceProvider; // Đảm bảo đã import CorsServiceProvider

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Sử dụng $this->app để đăng ký CorsServiceProvider
        // $this->app->register(CorsServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
