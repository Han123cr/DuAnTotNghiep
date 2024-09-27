<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $table = 'reservations'; // Tên bảng
    protected $primaryKey = 'reservationID'; // Khóa chính

    protected $fillable = [
        'createdAt',
        'arrivalTime',
        'numberOfPeople',
        'notes',
        'bookerName',
        'bookerPhoneNumber',
        'reservationStatus',
        'deposit',
        'paymentMethod',
        'transactionID',
        'customerID',
        'branchID',
        'tableID',
    ];

    // Định nghĩa các mối quan hệ
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerID', 'customerID');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branchID', 'branchID');
    }

    public function table()
    {
        return $this->belongsTo(Table::class, 'tableID', 'tableID');
    }

    public function tableReservations()
    {
        return $this->hasMany(TableReservation::class, 'reservationID', 'reservationID');
    }
}
