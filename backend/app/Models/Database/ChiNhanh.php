<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChiNhanh extends Model
{
    use HasFactory;

    protected $table = 'ChiNhanh'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'MaChiNhanh'; // Khóa chính
    protected $fillable = ['TenChiNhanh', 'DiaChi', 'SDTChiNhanh']; // Các cột có thể được gán hàng loạt
    public $timestamps = false; // Bỏ qua timestamp

    // Quan hệ với bảng DatBan
    public function datBans()
    {
        return $this->hasMany(DatBan::class, 'MaChiNhanh', 'MaChiNhanh');
    }
}
