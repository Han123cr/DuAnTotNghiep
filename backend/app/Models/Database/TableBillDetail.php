<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableBillDetail extends Model
{
    use HasFactory;

    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'tableBillDetails';

    // Khóa chính của bảng
    protected $primaryKey = 'tableBillDetailID';

    // Tắt tự động quản lý 'created_at' và 'updated_at'
    public $timestamps = false;

    // Danh sách các trường có thể được mass assignable
    protected $fillable = [
        'quantity',
        'price',
        'discount',
        'total',
        'tableBillID',
        'menuItemID'
    ];

    // Định nghĩa quan hệ với bảng 'tableBills'
    public function tableBill()
    {
        return $this->belongsTo(TableBill::class, 'tableBillID', 'tableBillID');
    }

    // Định nghĩa quan hệ với bảng 'menuItems'
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'menuItemID', 'menuItemID');
    }
}
