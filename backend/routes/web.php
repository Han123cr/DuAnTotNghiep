<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ControllerHome;

Route::get('/', [ControllerHome::class , 'index'])->name(name: "index");

Route::get('/dangky', [ControllerHome::class , 'dangky']);
Route::post('/dangky', [ControllerHome::class , 'xacthucdangky'])->name(name: "xacthucdangky");
Route::get('/nhapmaxacthuc', [ControllerHome::class , 'nhapmaxacthuc']);
Route::post('/nhapmaxacthuc', [ControllerHome::class , 'checkmaxacnhan'])->name(name: "checkmaxacnhan");


Route::get('/dangnhap', [ControllerHome::class , 'dangnhap']);
Route::post('/dangnhap', [ControllerHome::class , 'xacthucdangnhap'])->name(name: "dangnhap");



Route::post('/datban', [ControllerHome::class , 'datban'])->name("datban");
Route::post('/xacthuc', [ControllerHome::class , 'xacthucc'])->name("xacthuc");
