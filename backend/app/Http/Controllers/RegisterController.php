<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\Database\Customer;
use App\Models\SendMail;

class RegisterController extends Controller
{

    public function register(Request $request)
    {
        try {
            // Xác thực dữ liệu đầu vào
            $request->validate([
                'name' => 'required|string|max:50',
                'email' => 'nullable|email|unique:customers,email|required_without:phoneNumber',
                'phoneNumber' => 'nullable|numeric|digits:10|unique:customers,phoneNumber|required_without:email',
                'password' => 'required|string|min:6|confirmed',
                
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => "Giá trị không đúng"], 422);
        }
        
        

        $name = $request->input('name');
        $email = $request->input('email');
        $phoneNumber = $request->input('phoneNumber');
        $password = $request->input('password');


        if ($email && Customer::where('Email', $email)->exists()) {
            return response()->json(['message' => 'Email đã tồn tại.'], 400);
        }
    
        if ($phoneNumber && Customer::where('PhoneNumber', $phoneNumber)->exists()) {
            return response()->json(['message' => 'Số điện thoại đã tồn tại.'], 400);
        }

        // Kiểm tra xem session đã tồn tại và còn hiệu lực hay không
        $sessionData = session('data');
        if (
            $sessionData &&
            isset($sessionData['verification_code']) &&
            $sessionData['code_time'] > now() &&
            $sessionData['name'] == $name &&
            $sessionData['password'] == $password &&
            (($sessionData['email'] == $email) || ($sessionData['phoneNumber'] == $phoneNumber))
        ) {
            return response()->json(['message' => "Success"], 200);
        }

        // Tạo mã xác thực mới nếu chưa có hoặc mã đã hết hạn
        $dataRegister = [
            'name' => $name,
            'password' => $password,
            'email' => $email,
            'phoneNumber' => $phoneNumber,
        ];

        if (!isset($sessionData['verification_code']) || $sessionData['code_time'] <= now()) {
            $expirationTime = now()->addMinutes(5);
            $verificationCode = random_int(100000, 999999);
            $dataRegister['verification_code'] = $verificationCode;
            $dataRegister['code_time'] = $expirationTime;

            // Gửi mã xác thực qua email hoặc SMS
            if ($email) {
                session()->forget('data.phoneNumber'); 
                Mail::to($email)->send(new SendMail($verificationCode));;
            } elseif ($phoneNumber) {
                session()->forget('data.email'); 
                // Gửi mã qua SMS (nếu có)
            }
        } else {
            $dataRegister['verification_code'] = $sessionData['verification_code'];
            $dataRegister['code_time'] = $sessionData['code_time'];
        }

        // Lưu dữ liệu vào session
        session(['dataRegister' => $dataRegister]);

        return response()->json(['message' => "Success"], 200);
    }

    public function verifyAndCheckCode(Request $request)
{
    try {
        // Kiểm tra hợp lệ của mã xác nhận (code)
        $request->validate([
            'code' => 'required|numeric|min:6'
        ]);

        // Lấy dữ liệu từ session
        $data = session('dataRegister');
        if (!$data) {
            return response()->json(['message' => 'Dữ liệu không tồn tại trong session.'], 400);
        }

        $code = $request->input('code');

        // So sánh mã xác nhận
        if ($data['verification_code'] == $code) {
            // Tạo khách hàng mới
            $customer = new Customer();
            $customer->name = $data['name']; 
            $customer->email = $data['email'] ?? null; 
            $customer->phoneNumber = $data['phoneNumber'] ?? null; 
            $customer->password = Hash::make($data['password']); 
            $customer->save(); // Lưu khách hàng vào cơ sở dữ liệu

            // Xóa dữ liệu session sau khi thành công
            session()->forget('dataRegister'); 

            return response()->json(['message' => "Thành công"], 200); 
        }

        // Mã xác nhận không đúng
        return response()->json(['message' => 'Mã xác nhận không hợp lệ.'], 400); 

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Xử lý lỗi validate
        return response()->json(['message' => 'Dữ liệu không hợp lệ', 'errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        // Xử lý lỗi chung
        return response()->json(['message' => 'Đã xảy ra lỗi.', 'error' => $e->getMessage()], 500);
    }
}

}
