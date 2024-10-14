<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableBill extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'tableBills';

    // Khóa chính của bảng
    protected $primaryKey = 'tableBillID';

    // Cho phép Laravel tự động quản lý 'created_at' và 'updated_at'
    public $timestamps = true;

    // Tên cột 'created_at' và 'updated_at' khác mặc định
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'totalAmount',
        'transactionCode',
        'paymentMethodID',
        'tableOrderID',
        'voucherID'
    ];

    // Định nghĩa quan hệ với bảng 'paymentMethods'
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'paymentMethodID', 'paymentMethodID');
    }

    // Định nghĩa quan hệ với bảng 'tableOrders'
    public function tableOrder()
    {
        return $this->belongsTo(TableOrder::class, 'tableOrderID', 'tableOrderID');
    }

    // Định nghĩa quan hệ với bảng 'vouchers'
    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucherID', 'voucherID');
    }

    // Định nghĩa quan hệ với bảng 'tableBillDetails'
    public function tableBillDetails()
    {
        return $this->hasMany(TableBillDetail::class, 'tableBillID', 'tableBillID');
    }
}
