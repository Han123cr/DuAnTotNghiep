<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteFood extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'favoriteFoods';

    // Khóa chính của bảng
    protected $primaryKey = 'favoriteFoodID';

    // Tự động quản lý thời gian (vì bảng có trường 'addedAt')
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'addedAt',
        'createdAt',
        'customerID',
        'menuItemID'
    ];

    // Định nghĩa quan hệ với bảng 'customers'
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }

    // Định nghĩa quan hệ với bảng 'menuItems'
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'menuItemID', 'menuItemID');
    }
}
