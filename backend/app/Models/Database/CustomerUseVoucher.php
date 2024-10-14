<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerUseVoucher extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'customerUseVouchers';


    // Tắt tự động quản lý 'created_at' và 'updated_at' nếu không sử dụng
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'customerID',
        'voucherID',
        'usedAt'
    ];

    // Định nghĩa quan hệ với bảng 'customers'
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }

    // Định nghĩa quan hệ với bảng 'vouchers'
    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucherID', 'voucherID');
    }
}
