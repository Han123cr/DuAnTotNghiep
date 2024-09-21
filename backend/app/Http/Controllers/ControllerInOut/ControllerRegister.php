<?php

namespace App\Http\Controllers\ControllerInOut;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\Database\KhachHang;

class ControllerRegister extends Controller
{
    public function dangky()
    {
        return view('dangky');
    }
    public function xacthucdangky(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'name' => 'required|string|max:255',
            'email_or_phone' => 'required',
            'password' => 'required|confirmed|min:6',
        ]);

        $name = $request->input('name');
        $emailOrPhone = $request->input('email_or_phone');
        $password = $request->input('password');

        // Kiểm tra xem session đã tồn tại và còn hiệu lực hay không
        $sessionData = session('data');
        if (
            $sessionData &&
            isset($sessionData['key_email_time']) &&
            $sessionData['key_email_time'] > now() &&
            $sessionData['name'] == $name &&
            $sessionData['password'] == $password &&
            $sessionData['email_or_phone'] == $emailOrPhone
        ) {

            // Nếu không có thay đổi, giữ nguyên session
            return view('nhapmaxacthuc');
        }

        // Nếu không tồn tại session hoặc đã hết hạn, tạo mới mã xác thực
        $data_dangky['name'] = $name;
        $data_dangky['password'] = $password;
        $data_dangky['email_or_phone'] = $emailOrPhone;

        // Tạo mã xác thực mới nếu chưa có hoặc mã đã hết hạn
        if (!isset($sessionData['email_verification_code']) || $sessionData['key_email_time'] <= now()) {
            $expirationTime = now()->addMinutes(5);
            $verificationCode = random_int(100000, 999999);
            $data_dangky['email_verification_code'] = $verificationCode;
            $data_dangky['key_email_time'] = $expirationTime;
            echo 'ttttttttt';
            // Gửi mã xác thực qua email
            if (filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL)) {
                $request->validate([
                    'email_or_phone' => 'unique:KhachHang,Email',
                ]);
                $data_dangky['Email'] = $emailOrPhone;
                Mail::send('az', ['code' => $verificationCode], function ($message) use ($emailOrPhone) {
                    $message->to($emailOrPhone)->subject('Mã xác thực đăng ký');
                });
            } else {
                // Kiểm tra nếu là số điện thoại
                $request->validate([
                    'email_or_phone' => 'numeric|digits_between:10,15|unique:KhachHang,SoDienThoai',
                ]);
                $data_dangky['SoDienThoai'] = $emailOrPhone;

                // Gửi mã qua SMS (nếu có)
            }
        } else {
            $data_dangky['email_verification_code'] = $sessionData['email_verification_code'];
            $data_dangky['key_email_time'] = $sessionData['key_email_time'];
        }

        // Lưu dữ liệu vào session
        session(['data' => $data_dangky]);
        return view('nhapmaxacthuc');
    }





    public function nhapmaxacthuc()
    {

        route('nhapmaxacthuc');
    }
    public function checkmaxacnhan(Request $request)
    {
        $request->validate([
            'maxacthuc' => 'required|numeric|min:6'
        ]);

        $data = session('data'); // Kiểm tra dữ liệu trong session
        $maxacthuc = $request->input('maxacthuc');
        if ($data['email_verification_code'] == $maxacthuc) {
            $khachHang = new KhachHang();
            $khachHang->Ten = $data['name']; // Lưu tên
            $khachHang->Email = $data['Email'] ?? null; // Gán Email nếu có
            $khachHang->SoDienThoai = $data['SoDienThoai'] ?? null; // Gán Số Điện Thoại nếu có
            $khachHang->MatKhau = Hash::make($data['password']); // Mã hóa mật khẩu
            $khachHang->save(); // Lưu vào cơ sở dữ liệu
            session()->forget('data'); // Thay 'key_name' bằng tên khóa bạn muốn xóa

            return redirect()->route('index')->with('success', 'Đăng ký thành công!');
        }

        // $data = [];

        // $emailOrPhone = $request->input('email_or_phone');

        // Tạo người dùng mới



        // // Chuyển hướng sau khi đăng ký thành công
        return redirect()->route('index')->with('success', 'thất bại');

    }
}
