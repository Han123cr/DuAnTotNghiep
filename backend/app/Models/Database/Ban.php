<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ban extends Model
{
    use HasFactory;

    protected $table = 'Ban'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'MaBan'; // Khóa chính
    protected $fillable = ['SoBan', 'TrangThaiBan', 'MaDatBan']; // Các cột có thể được gán hàng loạt
    public $timestamps = false; // Bỏ qua timestamp

    // Quan hệ với bảng DatBan
    public function datBan()
    {
        return $this->belongsTo(DatBan::class, 'MaDatBan', 'MaDatBan');
    }
}

