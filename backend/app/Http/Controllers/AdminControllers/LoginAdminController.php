<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Database\Admin;
class LoginAdminController extends Controller
{
    public function login(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'loginName' => 'required',
            'password' => 'required',
        ]);

        $loginName = $request->input('loginName');
        $password = $request->input('password');


        // Nếu là số điện thoại, tìm người dùng theo số điện thoại
        $admin = Admin::where('loginName', $loginName)->first();


        // Kiểm tra nếu người dùng không tồn tại
        if (!$admin) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        // Kiểm tra trạng thái người dùng
        if ($admin->status == 'blocked') {
            return response()->json(['message' => 'Tài khoản của bạn đã bị khóa.'], 403); // 403: Forbidden
        }


        // Kiểm tra mật khẩu bằng Hash::check()
        if (Hash::check($password, $admin->password)) {
            // Đăng nhập thành công
            Auth::guard('admin')->login($admin);
            return response()->json(['message' => 'Đăng nhập thành công!'], 200);
        }

        // Đăng nhập thất bại
        return response()->json(['message' => 'Tên đăng nhập hoặc mật khẩu không chính xác.'], 401);
    }



    //Đăng xuất
    public function logout()
    {
        try {
            Auth::guard('admin')->logout();
            return response()->json(['message' => 'Đăng xuất thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình đăng xuất.'], 500);
        }
    }
}
