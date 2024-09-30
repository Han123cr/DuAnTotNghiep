<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $table = 'menus'; // Tên bảng
    protected $primaryKey = 'menuID'; // Khóa chính
    public $incrementing = true; // Tự động tăng
    protected $fillable = ['menuName', 'menuImage']; // Các thuộc tính có thể được gán hàng loạt
}