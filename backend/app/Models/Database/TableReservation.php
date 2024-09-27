<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Model;

class TableReservation extends Model
{
    protected $table = 'tables_reservations'; // Tên bảng
    protected $primaryKey = 'id'; // Khóa chính

    protected $fillable = [
        'reservationID',
        'tableID',
    ];

    // Định nghĩa mối quan hệ với bảng reservations
    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservationID', 'reservationID');
    }

    // Định nghĩa mối quan hệ với bảng tables
    public function table()
    {
        return $this->belongsTo(Table::class, 'tableID', 'tableID');
    }
}
