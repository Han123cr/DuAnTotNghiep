<?php

use Illuminate\Support\Facades\Route;
// Controller Admin;
use App\Http\Controllers\AdminControllers\LoginAdminController;
// use App\Http\Controllers\ControllerHome;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReservationController;
// Route::get('/', [ControllerHome::class , 'index'])->name(name: "index");
use App\Http\Controllers\SessionController;
use App\Http\Controllers\MenuController;

Route::get('/session', [SessionController::class, 'showForm'])->name('session.form');
Route::post('/session', [SessionController::class, 'storeData'])->name('session.store');

Route::get('/t', [RegisterController::class , 'test']);
Route::post('/dangky', [RegisterController::class , 'register']);
Route::get('/nhapmaxacthuc', [RegisterController::class , 'nhapmaxacthuc']);
Route::post('/nhapmaxacthuc', [RegisterController::class , 'verifyAndCheckCode']);


Route::get('/dangnhap', [LoginController::class , 'dangnhap']);
Route::post('/dangnhap', [LoginController::class , 'authenticationLogin']);







Route::prefix('admin')->group(function(){
    //Đăng nhập
    Route::post('/login', [LoginAdminController::class , 'login']);


    Route::middleware((['auth.admin']))->group(function () {
        //Đăng xuất
        Route::post('/logout', [LoginController::class , 'logout']);
    });
});

Route::prefix('staff')->group(function(){
    //Đăng nhập
    Route::post('/login', [LoginController::class , 'login']);
    Route::post('/forgotPassword', [LoginController::class , 'forgotPassword']);

    Route::middleware((['auth.staff']))->group(function () {
        //Đăng xuất
        Route::post('/logout', [LoginController::class , 'logout']);
    });
});


Route::prefix('/')->group(function(){
    //Đăng ký
    Route::post('/register', [RegisterController::class , 'register']);
    Route::post('/verifyAndCheckCode', [RegisterController::class , 'verifyAndCheckCode']);

    //Đăng nhập
    Route::post('/login', [LoginController::class , 'login']);
    Route::post('/forgotPassword', [LoginController::class , 'forgotPassword']);

    //Trả dữ liệu menu và món ăn
    Route::get('/getMenus', [MenuController::class , 'getMenus']);
    Route::get('/getMenuItems', [MenuController::class , 'getMenuItems']);
    Route::get('/getMenusWithItems', [MenuController::class , 'getMenusWithItems']);
    
    //Lấy thời gian và bàn trống
    Route::get('/getAvailableTables', [ReservationController::class , 'getAvailableTables']);

    Route::middleware((['auth.customer']))->group(function () {
        //Đăng xuất
        Route::post('/logout', [LoginController::class , 'logout']);
        //Check lại đơn đặt bàn
        Route::get('/getUserReservations', [ReservationController::class , 'getUserReservations']);
        //Hủy đơn đặt bàn
        Route::post('/cancelReservation', [ReservationController::class , 'cancelReservation']);
        //Show thông tin nguời dùng
        Route::get('/showInfo', [CustomerController::class , 'showInfo']);
        //Chỉnh sửa thông tin
        Route::post('/edit', [CustomerController::class , 'datban']);
        Route::post('/xacthuc', [CustomerController::class , 'verifyAndCheckCode']);
        Route::post('/xoataikhoan', [CustomerController::class , 'destroy']);

    });
});
