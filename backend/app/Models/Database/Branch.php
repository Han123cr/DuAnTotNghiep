<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $table = 'branches'; // Tên bảng
    protected $primaryKey = 'branchID'; // Khóa chính

    protected $fillable = [
        'branchName',
        'address',
        'branchPhone',
    ];

    // Định nghĩa các mối quan hệ
    public function tables()
    {
        return $this->hasMany(Table::class, 'branchID', 'branchID');
    }
}
