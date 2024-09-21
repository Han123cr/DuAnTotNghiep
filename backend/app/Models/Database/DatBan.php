<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatBan extends Model
{
    use HasFactory;

    protected $table = 'DatBan'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'MaDatBan'; // Khóa chính
    protected $fillable = ['ThoiGianDat', 'ThoiGianDen', 'SoNguoi', 'TienCoc', 'YeuCauDatBiet', 'TrangThaiDatBan', 'Ten', 'SoDienThoai', 'MaChiNhanh', 'MaKhachHang']; // Các cột có thể được gán hàng loạt
    public $timestamps = false; // Bỏ qua timestamp

    // Quan hệ với bảng Ban
    public function bans()
    {
        return $this->hasMany(Ban::class, 'MaDatBan', 'MaDatBan');
    }

    // Quan hệ với bảng ChiNhanh
    public function chiNhanh()
    {
        return $this->belongsTo(ChiNhanh::class, 'MaChiNhanh', 'MaChiNhanh');
    }

    // Quan hệ với bảng KhachHang
    public function khachHang()
    {
        return $this->belongsTo(KhachHang::class, 'MaKhachHang', 'MaKhachHang');
    }
}
