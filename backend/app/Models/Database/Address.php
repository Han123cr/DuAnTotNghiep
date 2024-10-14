<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $table = 'addresses'; // Tên bảng

    protected $primaryKey = 'addressID'; // Khóa chính

    // Các trường có thể thêm/sửa
    protected $fillable = [
        'address', 
        'recipientPhone',
        'recipientName',
        'default',
        'customerID'
    ];

    // Định nghĩa mối quan hệ nhiều-1 với bảng customers
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }
}





