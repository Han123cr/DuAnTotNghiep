<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $table = 'tables'; // Tên bảng
    protected $primaryKey = 'tableID'; // Khóa chính

    protected $fillable = [
        'tableNumber',
        'tableStatus',
        'branchID',
    ];

    // Định nghĩa các mối quan hệ
    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branchID', 'branchID');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'tableID', 'tableID');
    }

    public function tableReservations()
    {
        return $this->hasMany(TableReservation::class, 'tableID', 'tableID');
    }
}
