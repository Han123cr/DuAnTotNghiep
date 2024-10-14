<?php

namespace App\Models\Database;

use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Authenticatable;

class Admin extends Model implements AuthenticatableContract
{
    use HasFactory, Authenticatable;

    protected $table = 'admin';
    protected $primaryKey = 'adminID';
    public $incrementing = false; // Không sử dụng auto-incrementing cho khóa chính

    protected $fillable = ['email', 'password'];

    protected $hidden = [
        'password',
    ];
}


