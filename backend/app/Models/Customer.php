<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class Customer extends Model
{
    use HasFactory;
    public function saveInfoSession(Request $request)
{
    // Lấy người dùng hiện tại từ phiên
    $customer = Auth::user();

    // Duyệt qua từng trường
    foreach ($request->all() as $key => $value) {
        switch ($key) {
            case 'name':
                session(['name' => $value]);
                break;
            case 'email':
                session(['email' => $value]);
                break;
            case 'phoneNumber':
                session(['phoneNumber' => $value]);
                break;
            case 'address':
                session(['address' => $value]);
                break;
                case 'avatar':
                    if ($request->hasFile('avatar')) {
                        $file = $request->file('avatar');
                        $tempPath = $file->store('temp/avatars'); // Lưu tạm thời vào thư mục temp/avatars
                        session(['avatar' => $tempPath]); // Lưu đường dẫn vào session
                    }
                    break;                
            case 'password':
                if ($request->filled('password') && Hash::check($request->input('old_password'), $customer->password)) {
                    session(['password' => Hash::make($value)]);
                } else {
                    return response()->json(['message' => 'Mật khẩu cũ không đúng.'], 422);
                }
                break;
            default:
                // Không xử lý các trường khác
                break;
        }
    }

    return response()->json(['message' => 'Thông tin đã được lưu vào session.'], 200);
}

}


