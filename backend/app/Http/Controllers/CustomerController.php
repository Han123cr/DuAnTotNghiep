<?php

namespace App\Http\Controllers;

use App\Models\Database\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\SendMail;
use App\Models\Sendphone;
class CustomerController extends Controller
{
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'email' => 'required|email|unique:customers,email',
    //         'phoneNumber' => 'required|string|max:15|unique:customers,phoneNumber',
    //         'password' => 'required|string|min:6',
    //         'address' => 'nullable|string|max:255',
    //     ]);

    //     $customer = new Customer();
    //     $customer->name = $request->input('name');
    //     $customer->email = $request->input('email');
    //     $customer->phoneNumber = $request->input('phoneNumber');
    //     $customer->address = $request->input('address');
    //     $customer->password = Hash::make($request->input('password'));

    //     // Xử lý tải lên avatar
    //     if ($request->hasFile('avatar')) {
    //         $file = $request->file('avatar');
    //         $path = $file->store('avatars', 'public');
    //         $customer->avatar = $path;
    //     }

    //     $customer->save();

    //     return response()->json(['message' => 'Người dùng đã được tạo thành công!'], 201);
    // }

    public function showInfo()
    {
        // Lấy thông tin khách hàng hiện tại từ phiên (session)
        $customer = Auth::guard('customer')->user(); 
        // Kiểm tra nếu có khách hàng đăng nhập
        if ($customer) {
            // Chuẩn bị dữ liệu công khai để trả về
            $publicData = [
                'name' => $customer->name,
                'avatar' => $customer->avatar,
                'email' => $customer->email,
                'phoneNumber' => $customer->phoneNumber,
                'addresses' => $customer->addresses()->get(), // Lấy tất cả địa chỉ từ bảng addresses
            ];

            return response()->json($publicData, 200);
        }

        return response()->json(['message' => 'Chưa đăng nhập.'], 401);
    }


    public function update(Request $request)
{
    // Validate dữ liệu đầu vào
    $request->validate([
        'name' => 'nullable|string|max:255',
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'email' => 'nullable|email|unique:customers,email,' .  Auth::guard('customer')->id(), // Kiểm tra tính duy nhất của email
        'phoneNumber' => 'nullable|numeric|digits:10|unique:customers,phoneNumber,' .  Auth::guard('customer')->id(), // Kiểm tra tính duy nhất của số điện thoại
        'old_password' => 'nullable|string|min:6', // Trường xác nhận mật khẩu cũ
        'password' => 'nullable|string|min:6|confirmed',
        'addresses' => 'nullable|array', // Địa chỉ là một mảng
        'addresses.*.id' => 'nullable|integer|exists:addresses,id', // ID địa chỉ (nếu có)
        'addresses.*.address' => 'nullable|string|max:255', // Địa chỉ
        'addresses.*.recipientName' => 'nullable|string|max:255', // Tên người nhận
        'addresses.*.recipientPhone' => 'nullable|string|max:15', // Số điện thoại người nhận
    ]);

    if (session()->has('email') || session()->has('phoneNumber')) {
        session()->forget(['email', 'phoneNumber']);
    }

    // Lấy người dùng hiện tại từ phiên
    $customer = Auth::guard('customer')->user();

    // Duyệt qua từng trường
    foreach ($request->all() as $key => $value) {
        switch ($key) {
            case 'name':
                $customer->name = $value; // Gán giá trị vào thuộc tính
                break;

            case 'email':
                if ($value && $value !== $customer->email) {
                    session([$key => $value]);
                    $this->sendVerification($value, 'email'); // Gửi mã xác nhận qua email
                }
                break;

            case 'phoneNumber':
                if ($value && $value !== $customer->phoneNumber) {
                    session([$key => $value]);
                    $this->sendVerification($value, 'phoneNumber'); // Gửi mã xác nhận qua số điện thoại
                }
                break;

            case 'avatar':
                if ($request->hasFile('avatar')) {
                    $file = $request->file('avatar');
                    $path = $file->store('avatars', 'public'); // Lưu vào thư mục public/avatars
                    $customer->avatar = $path; // Lưu đường dẫn vào database
                }
                break;

            case 'password':
                if ($request->filled('password') && Hash::check($request->input('old_password'), $customer->password)) {
                    $customer->password = Hash::make($value); // Lưu mật khẩu đã mã hóa
                } else {
                    return response()->json(['message' => 'Mật khẩu cũ không đúng.'], 422);
                }
                break;

            case 'addresses':
                // Xử lý cập nhật địa chỉ
                if (is_array($value)) {
                    foreach ($value as $addressData) {
                        if (isset($addressData['id'])) {
                            // Cập nhật địa chỉ đã tồn tại
                            $address = $customer->addresses()->find($addressData['id']);
                            if ($address) {
                                $address->update($addressData);
                            }
                        } else {
                            // Tạo địa chỉ mới nếu không có id
                            $customer->addresses()->create($addressData);
                        }
                    }
                }
                break;

            default:
                // Không xử lý các trường khác
                break;
        }
    }

    // Lưu thay đổi vào database
    $customer->save();

    return response()->json(['message' => 'Thông tin đã được lưu thành công.'], 200);
}





    private function sendVerification($recipient, $type)
    {
        // Tạo mã xác nhận ngẫu nhiên 6 chữ số
        $verificationCode = rand(100000, 999999);

        // Lưu mã xác nhận vào session
        session(['verification_code' => $verificationCode]);

        // Gửi mã qua email hoặc số điện thoại
        if ($type === 'email') {
            Mail::to($recipient)->send(new SendMail($verificationCode));
        } elseif ($type === 'phoneNumber') {
            SendPhone::sendSms($recipient, $verificationCode); 
        }
    }





    public function verifyAndCheckCode(Request $request)
    {
        // Validate dữ liệu đầu vào
        $request->validate([
            'verification_code' => 'required|numeric|digits:6',
        ]);

        $code = $request->input('verification_code');

        // Kiểm tra mã xác nhận có khớp với mã trong session hay không
        if (session('verification_code') === $code) {
            // Lấy thông tin email hoặc số điện thoại từ session
            $email = session('email');
            $phoneNumber = session('phoneNumber');
            $customer = Auth::guard('customer')->user();

            // Cập nhật email hoặc số điện thoại vào database nếu có
            if ($email && $email !== $customer->email) {
                $customer->email = $email;
            }

            if ($phoneNumber && $phoneNumber !== $customer->phoneNumber) {
                $customer->phoneNumber = $phoneNumber;
            }

            // Lưu thay đổi vào database
            $customer->save();

            // Xóa thông tin khỏi session sau khi đã lưu
            session()->forget(['verification_code', 'email', 'phoneNumber']);

            return response()->json(['message' => 'Mã xác nhận chính xác. Thông tin đã được cập nhật.'], 200); // Mã khớp
        } else {
            return response()->json(['message' => 'Mã xác nhận không chính xác.'], 422); // Mã không khớp
        }
    }







    //xóa tài khoản nguời dùng
    public function destroy()
    {
        // Lấy người dùng hiện tại từ phiên
        $customer = Auth::guard('customer')->user();

        $customer->delete();
        return response()->json(['message' => 'Người dùng đã bị xóa.'], 200);
    }
}
