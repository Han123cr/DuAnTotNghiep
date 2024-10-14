<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'orderDetails';

    // Khóa chính của bảng
    protected $primaryKey = 'orderDetailID';

    // Tắt tự động quản lý 'created_at' và 'updated_at'
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'quantity',
        'price',
        'discount',
        'total',
        'orderID',
        'menuItemID'
    ];

    // Định nghĩa quan hệ với bảng 'orders'
    public function order()
    {
        return $this->belongsTo(Order::class, 'orderID', 'orderID');
    }

    // Định nghĩa quan hệ với bảng 'menuItems'
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'menuItemID', 'menuItemID');
    }
}
