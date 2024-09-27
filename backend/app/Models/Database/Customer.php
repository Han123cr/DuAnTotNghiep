<?php

namespace App\Models\Database;

use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Authenticatable;

class Customer extends Model implements AuthenticatableContract
{
    use HasFactory, Authenticatable;

    protected $table = 'customers'; // Tên bảng
    protected $primaryKey = 'customerID'; // Khóa chính

    public $timestamps = false; 
    protected $fillable = [
        'name', 
        'avatar', 
        'email', 
        'phoneNumber', 
        'password', 
        'status', 
        'role'
    ];

    // Các trường không nên được trả về khi query
    protected $hidden = [
        'password',
    ];

    // Định nghĩa mối quan hệ 1-nhiều với bảng addresses
    public function addresses()
    {
        return $this->hasMany(Address::class, 'customerID', 'customerID');
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'customerID', 'customerID');
    }
}
