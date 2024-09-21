<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Database\DatBan; // Đảm bảo bạn đã tạo model DatBan
use App\Models\Database\KhachHang; // Đảm bảo bạn đã tạo model KhachHang
use App\Models\Database\ChiNhanh; // Đảm bảo bạn đã tạo model ChiNhanh
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class ControllerHome extends Controller
{
    public function index()
    {
        return view("index");
    }

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
    if ($sessionData && 
        isset($sessionData['key_email_time']) && 
        $sessionData['key_email_time'] > now() &&
        $sessionData['name'] == $name &&
        $sessionData['password'] == $password &&
        $sessionData['email_or_phone'] == $emailOrPhone) {
        
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
    }else{
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
    if($data['email_verification_code'] == $maxacthuc){
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

    

public function dangnhap()
    {
        return view('dangnhap');
    }

    public function xacthucdangnhap(Request $request)
{
    // Xác thực dữ liệu đầu vào
    $request->validate([
        'email_or_phone' => 'required',
        'password' => 'required',
    ]);

    $credentials = [
        'MatKhau' => $request->input('password'),
    ];

    // Kiểm tra xem đầu vào là email hay số điện thoại
    if (filter_var($request->input('email_or_phone'), FILTER_VALIDATE_EMAIL)) {
        $credentials['Email'] = $request->input('email_or_phone');
    } else {
        $credentials['SoDienThoai'] = $request->input('email_or_phone');
    }

    // Kiểm tra xem người dùng có tồn tại hay không
    $user = KhachHang::where('SoDienThoai', $request->input('email_or_phone'))
        ->orWhere('Email', $request->input('email_or_phone'))
        ->first();

    if ($user && Hash::check($request->input('password'), $user->MatKhau)) {
        // Đăng nhập thành công
        Auth::login($user);
        return redirect()->route('index')->with('success', 'Đăng nhập thành công!');
    }

    // Đăng nhập thất bại
    return redirect()->back()->withErrors([
        'email_or_phone' => 'Số điện thoại hoặc mật khẩu không chính xác.',
    ]);
}

    public function logout()
    {
        Auth::logout();
        return redirect()->route('index')->with('success', 'Đăng xuất thành công!');
    }


    public function editinfo(){

    }

    

    public function datbanm()
    {
        // Lấy danh sách khách hàng và chi nhánh để hiển thị trên form
        $khachHangs = KhachHang::all();
        $chiNhanhs = ChiNhanh::all();
        return view('datban', compact('khachHangs', 'chiNhanhs'));
    }

    public function datban(Request $request)
    {
        // Validate dữ liệu từ form
        $request->validate([
            'ThoiGianDen' => 'required|date',
            'SoNguoi' => 'required|integer',
            'TienCoc' => 'required|numeric',
            'YeuCauDatBiet' => 'nullable|string',
            'TrangThaiDatBan' => 'required|in:Chờ xử lý,Đã xác nhận,Đã hủy',
            'Ten' => 'required|string',
            'SoDienThoai' => 'nullable|string',
            'MaChiNhanh' => 'required|exists:chi_nhanh,MaChiNhanh',
            'MaKhachHang' => 'required|exists:khach_hang,MaKhachHang',
        ]);

        // Lưu dữ liệu vào cơ sở dữ liệu với thời gian đặt là thời gian hiện tại
        DatBan::create([
            'ThoiGianDat' => now(), // Thay thế bằng thời gian hiện tại
            'ThoiGianDen' => $request->ThoiGianDen,
            'SoNguoi' => $request->SoNguoi,
            'TienCoc' => $request->TienCoc,
            'YeuCauDatBiet' => $request->YeuCauDatBiet,
            'TrangThaiDatBan' => $request->TrangThaiDatBan,
            'Ten' => $request->Ten,
            'SoDienThoai' => $request->SoDienThoai,
            'MaChiNhanh' => $request->MaChiNhanh,
            'MaKhachHang' => $request->MaKhachHang,
        ]);

        // Chuyển hướng về trang index với thông báo thành công
        return   view("test");
    }
}
