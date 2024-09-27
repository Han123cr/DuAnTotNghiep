<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SessionController extends Controller
{
    // Hiển thị form
    public function showForm()
    {
        // Lấy dữ liệu từ session nếu có
        $data = session('data', '');

        // Trả về view
        return view('session', ['data' => $data]);
    }

    // Lưu dữ liệu vào session
    public function storeData(Request $request)
    {
        // Validate input
        $request->validate([
            'data' => 'required|string|max:255',
        ]);

        // Lưu dữ liệu vào session
        session(['data' => $request->input('data')]);

        return redirect()->route('session.form')->with('success', 'Dữ liệu đã được lưu vào session!');
    }
}
