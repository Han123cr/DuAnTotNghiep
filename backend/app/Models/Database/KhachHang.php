<?php

namespace App\Models\Database;

use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Authenticatable;

class KhachHang extends Model implements AuthenticatableContract
{
    use HasFactory, Authenticatable;

    protected $table = 'KhachHang';
    protected $primaryKey = 'MaKhachHang';
    protected $fillable = ['Ten', 'Anh', 'Email', 'SoDienThoai', 'MatKhau', 'DiaChi', 'Role'];
    public $timestamps = false;

    public function datBans()
    {
        return $this->hasMany(DatBan::class, 'MaKhachHang', 'MaKhachHang');
    }
}
