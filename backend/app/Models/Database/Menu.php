<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'menus';

    // Khóa chính của bảng
    protected $primaryKey = 'menuID';

    // Tắt tự động quản lý 'created_at' và 'updated_at' nếu không sử dụng
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'menuName',
        'menuImage',
        'status'
    ];

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class, 'menuID', 'menuID');
    }
}
