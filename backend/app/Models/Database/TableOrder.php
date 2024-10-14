<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Model;

class TableOrder extends Model
{
    protected $table = 'tableOrders'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'tableOrderID'; // Khóa chính

    // Tắt tự động quản lý 'created_at' và 'updated_at' nếu không sử dụng
    public $timestamps = false;

    protected $fillable = [
        'createdAt',
        'arrivalTime',
        'numberOfPeople',
        'notes',
        'bookerName',
        'bookerPhoneNumber',
        'tableOrderStatus',
        'deposit',
        'transactionCode',
        'customerID',
        'tableID',
        'paymentMethodID'
    ];

    // Định nghĩa quan hệ với bảng 'customers'
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }

    // Định nghĩa quan hệ với bảng 'tables'
    public function table()
    {
        return $this->belongsTo(Table::class, 'tableID', 'tableID');
    }

    // Định nghĩa quan hệ với bảng 'paymentMethods'
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'paymentMethodID', 'paymentMethodID');
    }
}
