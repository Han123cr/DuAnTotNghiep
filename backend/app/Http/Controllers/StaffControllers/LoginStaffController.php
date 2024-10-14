<?php

namespace App\Http\Controllers\StaffControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Database\Staff;
class LoginStaffController extends Controller
{
    public function login(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'staffID' => 'required',
            'password' => 'required',
        ]);

        $staffID = $request->input('staffID');
        $password = $request->input('password');


        
        $staff = Staff::where('staffID', $staffID);


        // Kiểm tra nếu người dùng không tồn tại
        if (!$staff) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        // Kiểm tra trạng thái người dùng
        if ($staff->status == 'blocked') {
            return response()->json(['message' => 'Tài khoản của bạn đã bị khóa.'], 403); // 403: Forbidden
        }


        // Kiểm tra mật khẩu bằng Hash::check()
        if (Hash::check($password, $staff->password)) {
            // Đăng nhập thành công
            Auth::guard('staff')->login($staff);
            return response()->json(['message' => 'Đăng nhập thành công!'], 200);
        }

        // Đăng nhập thất bại
        return response()->json(['message' => 'Tên đăng nhập hoặc mật khẩu không chính xác.'], 401);
    }



    //Đăng xuất
    public function logout()
    {
        try {
            Auth::guard('staff')->logout();
            return response()->json(['message' => 'Đăng xuất thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình đăng xuất.'], 500);
        }
    }
}
