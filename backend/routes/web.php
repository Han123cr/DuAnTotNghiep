<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\ControllerHome;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReservationController;
// Route::get('/', [ControllerHome::class , 'index'])->name(name: "index");
use App\Http\Controllers\SessionController;

Route::get('/session', [SessionController::class, 'showForm'])->name('session.form');
Route::post('/session', [SessionController::class, 'storeData'])->name('session.store');

Route::get('/t', [RegisterController::class , 'test']);
Route::post('/dangky', [RegisterController::class , 'register']);
Route::get('/nhapmaxacthuc', [RegisterController::class , 'nhapmaxacthuc']);
Route::post('/nhapmaxacthuc', [RegisterController::class , 'verifyAndCheckCode']);


Route::get('/dangnhap', [LoginController::class , 'dangnhap']);
Route::post('/dangnhap', [LoginController::class , 'authenticationLogin']);


Route::get('/info', [CustomerController::class , 'show']);
Route::post('/edit', [CustomerController::class , 'datban']);
Route::post('/xacthuc', [CustomerController::class , 'verifyAndCheckCode']);
Route::post('/xoataikhoan', [CustomerController::class , 'destroy']);


Route::get('/datban', [ReservationController::class , 'getAvailableTables']);
Route::get('/chitiet', [ReservationController::class , 'getUserReservations']);

use App\Http\Controllers\MenuController;

Route::get('/menus', [MenuController::class, 'menus'])->name('menus');

use App\Http\Controllers\CartController;


// Thêm món vào giỏ hàng
// Thêm món vào giỏ hàng
Route::post('/cart', [CartController::class, 'addToCart'])->name('cart.add');

// Lấy giỏ hàng của khách hàng
Route::get('/cart/{customerID}', [CartController::class, 'getCart'])->name('cart.get');

// Cập nhật món trong giỏ hàng
Route::put('/cart/items/{cartItemID}', [CartController::class, 'updateCart'])->name('cart.update');

// Xóa món khỏi giỏ hàng
Route::delete('/cart/items/{cartItemID}', [CartController::class, 'removeFromCart'])->name('cart.remove');