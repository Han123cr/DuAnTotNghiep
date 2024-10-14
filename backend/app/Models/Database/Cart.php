<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'carts';

    // Khóa chính của bảng
    protected $primaryKey = 'cartItemID';

    // Tắt tự động quản lý 'created_at' và 'updated_at'
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'quantity',
        'notes',
        'menuItemID',
        'customerID'
    ];

    // Định nghĩa quan hệ với bảng 'menuItems'
    public function menuItems()
    {
        return $this->belongsTo(MenuItem::class, 'menuItemID', 'menuItemID');
    }

    // Định nghĩa quan hệ với bảng 'customers'
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }
}
