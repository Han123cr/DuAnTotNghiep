<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\Database\Customer;
use App\Models\SendMail;
use App\Models\SendPhone; // Giả sử bạn đã tạo Mail này
use Illuminate\Support\Str;

class LoginController extends Controller
{
    public function login(Request $request)
{
    // Xác thực dữ liệu đầu vào
    $request->validate([
        'email_or_phone' => 'required',
        'password' => 'required',
    ]);

    $email_or_phone = $request->input('email_or_phone');
    $password = $request->input('password');

    // Kiểm tra xem đầu vào là email hay số điện thoại
    if (filter_var($email_or_phone, FILTER_VALIDATE_EMAIL)) {
        // Nếu là email, tìm người dùng theo email
        $customer = Customer::where('email', $email_or_phone)->first();
    } else {
        // Nếu là số điện thoại, tìm người dùng theo số điện thoại
        $customer = Customer::where('phoneNumber', $email_or_phone)->first();
    }

    // Kiểm tra nếu người dùng không tồn tại
    if (!$customer) {
        return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
    }

    // Kiểm tra trạng thái người dùng
    if ($customer->status == 'blocked') {
        return response()->json(['message' => 'Tài khoản của bạn đã bị khóa.'], 403); // 403: Forbidden
    }


    // Kiểm tra mật khẩu bằng Hash::check()
    if (Hash::check($password, $customer->password)) {
        // Đăng nhập thành công
        Auth::guard('customer')->login($customer);
        return response()->json(['message' => 'Đăng nhập thành công!'], 200);
    }

    // Đăng nhập thất bại
    return response()->json(['message' => 'Số điện thoại hoặc mật khẩu không chính xác.'], 401);
}

    //Quên mật khẩu
    public function forgotPassword(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'email_or_phone' => 'required',
        ]);

        $email_or_phone = $request->input('email_or_phone');

        // Kiểm tra xem đầu vào là email hay số điện thoại
        if (filter_var($email_or_phone, FILTER_VALIDATE_EMAIL)) {
            $user = Customer::where('email', $email_or_phone)->first();
        } else {
            $user = Customer::where('phoneNumber', $email_or_phone)->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        // Tạo mã xác nhận ngẫu nhiên
        $verificationCode = random_int(100000, 999999); // Tạo mã số ngẫu nhiên

        // Lưu mã xác nhận vào session
        session(['verification_code' => $verificationCode, 'customer_id' => $user->customerID]);

        // Kiểm tra nếu đầu vào là email thì gửi mã qua email
        if (filter_var($email_or_phone, FILTER_VALIDATE_EMAIL)) {
            Mail::to($user->email)->send(new SendMail($verificationCode));
            return response()->json(['message' => 'Mã xác nhận đã được gửi đến email của bạn.'], 200);
        } else {
            // Nếu là số điện thoại thì gửi mã qua SMS
            SendPhone::sendSms($user->phoneNumber, $verificationCode); 
            return response()->json(['message' => 'Mã xác nhận đã được gửi đến số điện thoại của bạn.'], 200);
        }
    }

    //Mã xác nhận
    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'verification_code' => 'required|min:6',
        ]);

        $code = $request->input('verification_code');

        if (session('verification_code') == $code) {
            return response()->json(['message' => 'Mã xác nhận chính xác.'], 200);
        }

        return response()->json(['message' => 'Mã xác nhận không chính xác.'], 422);
    }

    //Mật khẩu mới
    public function resetPassword(Request $request)
    {
        $request->validate([
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $customerId = session('customer_id');
        $user = Customer::find($customerId);

        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        // Cập nhật mật khẩu
        $user->password = Hash::make($request->input('new_password')); // Hash lại mật khẩu mới
        $user->save();

        // Xóa thông tin khỏi session
        session()->forget(['verification_code', 'customer_id']);

        return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công.'], 200);
    }

    //Đăng xuất
    public function logout()
    {
        try {
            Auth::guard('customer')->logout();
            return response()->json(['message' => 'Đăng xuất thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình đăng xuất.'], 500);
        }
    }
}
