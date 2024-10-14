<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;
    
    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'paymentMethods';
    
    // Khóa chính của bảng
    protected $primaryKey = 'paymentMethodID';

    // Tắt tự động quản lý 'created_at' và 'updated_at' nếu không sử dụng
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'methodName'
    ];


    public function tableOrders()
    {
        return $this->hasMany(TableOrder::class, 'paymentMethodID', 'paymentMethodID');
    }
    public function tableBills()
    {
        return $this->hasMany(TableBill::class, 'paymentMethodID', 'paymentMethodID');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'paymentMethodID', 'paymentMethodID');
    }

    


}
