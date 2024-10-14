<?php

namespace App\Models\Database;

use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Authenticatable;

class Staff extends Model implements AuthenticatableContract
{
    use HasFactory, Authenticatable;

    // Tên bảng trong database
    protected $table = 'staffs';

    // Khóa chính của bảng
    protected $primaryKey = 'staffID';

    // Bỏ qua tự động xử lý cột thời gian (timestamps)
    public $timestamps = false;

    // Các cột có thể thêm/sửa
    protected $fillable = [
        'name', 
        'avatar', 
        'password', 
        'status', 
        'staffAddress',
        'workingBranch',
        'staffPhone',
        'createdAt'
    ];

    // Ẩn các trường không muốn trả về khi query
    protected $hidden = [
        'password', // Bảo vệ mật khẩu không trả về trong kết quả query
    ];

    // Định dạng createdAt là kiểu DATETIME
    protected $casts = [
        'createdAt' => 'datetime',
    ];
}


