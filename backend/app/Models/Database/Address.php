<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $table = 'addresses'; // Tên bảng

    // Các trường có thể thêm/sửa
    protected $fillable = [
        'customerID', 
        'address', 
        'recipientPhone',
        'recipientName'
    ];

    // Định nghĩa mối quan hệ nhiều-1 với bảng customers
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }
}
