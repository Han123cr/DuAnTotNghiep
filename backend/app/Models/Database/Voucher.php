<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;
    protected $table = 'vouchers'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'voucherID'; // Khóa chính

    // Tắt tự động quản lý 'created_at' và 'updated_at' nếu không sử dụng
    public $timestamps = false;

    protected $fillable = [
        'code',
        'discount',
        'type',
        'startDate',
        'endDate',
        'content',
        'image',
        'status',
        'usageLimit',
        'createdAt'
    ];

    public function customerUseVouchers()
    {
        return $this->hasMany(customerUseVoucher::class, 'voucherID', 'voucherID');
    }
}
