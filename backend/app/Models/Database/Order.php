<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'orders';

    // Khóa chính của bảng
    protected $primaryKey = 'orderID';

    // Cho phép Laravel tự động quản lý 'created_at' và 'updated_at'
    public $timestamps = true;

    // Tên cột 'created_at' và 'updated_at' khác mặc định
    const CREATED_AT = 'createdAt'; // Nếu bạn muốn sử dụng orderDate làm cột tạo

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'status',
        'totalAmount',
        'totalAfterVoucher',
        'transactionCode',
        'paymentMethodID',
        'customerID',
        'addressID',
        'voucherID'
    ];

    // Định nghĩa quan hệ với bảng 'paymentMethods'
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'paymentMethodID', 'paymentMethodID');
    }

    // Định nghĩa quan hệ với bảng 'customers'
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }

    // Định nghĩa quan hệ với bảng 'addresses'
    public function address()
    {
        return $this->belongsTo(Address::class, 'addressID', 'addressID');
    }

    // Định nghĩa quan hệ với bảng 'vouchers'
    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucherID', 'voucherID');
    }

    // Định nghĩa quan hệ với bảng 'orderDetails'
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'orderID', 'orderID');
    }

    public function serviceReviews()
    {
        return $this->belongsTo(ServiceReview::class, 'paymentMethodID', 'paymentMethodID');
    }
}
