<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceReview extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'serviceReviews';

    // Khóa chính của bảng
    protected $primaryKey = 'serviceReviewID';

    // Cho phép Laravel tự động quản lý 'created_at' và 'updated_at'
    public $timestamps = true;

    // Tên cột 'created_at' và 'updated_at' khác mặc định
    const CREATED_AT = 'createdAt';

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'rating',
        'comment',
        'reviewType',
        'orderID',
        'tableOrderID',
        'customerID'
    ];

    // Định nghĩa quan hệ với bảng 'customers'
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }

    // Định nghĩa quan hệ với bảng 'orders'
    public function order()
    {
        return $this->belongsTo(Order::class, 'orderID', 'orderID');
    }

    // Định nghĩa quan hệ với bảng 'tableOrders'
    public function tableOrder()
    {
        return $this->belongsTo(TableOrder::class, 'tableOrderID', 'tableOrderID');
    }
}
