<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'menuItems';

    // Khóa chính của bảng
    protected $primaryKey = 'menuItemID';

    // Tắt tự động quản lý 'created_at' và 'updated_at' nếu không sử dụng
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'itemName',
        'itemImage',
        'description',
        'price',
        'discount',
        'size',
        'status',
        'menuID'
    ];

    // Định nghĩa quan hệ với bảng 'menus'
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menuID', 'menuID');
    }

    public function favoriteFood()
    {
        return $this->hasMany(FavoriteFood::class, 'menuItemID', 'menuItemID');
    }

    public function orderDetail()
    {
        return $this->hasMany(OrderDetail::class, 'menuItemID', 'menuItemID');
    }

    
}
