<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\MenuController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Database\Menu;

class MenuAdminController extends MenuController
{
    // Thêm menu mới
    public function storeMenu(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'menuName' => 'required|string|max:255',
            'menuImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'required|in:display,hidden', // Xác thực trường status
        ]);

        // Khởi tạo biến lưu đường dẫn hình ảnh
        $imagePath = null;

        // Kiểm tra nếu có file hình ảnh được tải lên
        if ($request->hasFile('menuImage')) {
            // Lấy tên gốc của file
            $originalExtension = $request->file('menuImage')->getClientOriginalExtension();
            // Tạo tên hình ảnh với định dạng "menu_randomString.extension"
            $randomString = uniqid();
            $imageName = "menu_{$randomString}.{$originalExtension}";
            $imagePath = $request->file('menuImage')->storeAs('menu-images', $imageName, 'public');
            $imagePath = 'storage/' . $imagePath; 
        }
        
        
        // Xử lý tên menu cho thư mục
        $menuName = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $request->input('menuName')))));
        Storage::makeDirectory("menuItem-images/$menuName");


        // Tạo mới một menu trong cơ sở dữ liệu
        $menu = Menu::create([
            'menuName' => $request->input('menuName'),
            'menuImage' => $imagePath,
            'status' => $request->input('status'), // Lưu trạng thái
        ]);

        // Trả về mã trạng thái 201 (Created) và thông tin menu
        return response()->json($menu, 201);
    }

    // Cập nhật menu
    public function updateMenu(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'menuID' => 'required|integer',
            'menuName' => 'required|string|max:255',
            'menuImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'required|in:display,hidden', // Xác thực trường status
        ]);

        // Tìm menu theo ID
        $id = $request->input('menuID');
        $menu = Menu::findOrFail($id);

        // Kiểm tra nếu có file hình ảnh được tải lên
        if ($request->hasFile('menuImage')) {
            // Xóa hình ảnh cũ nếu có
            if ($menu->menuImage) {
                Storage::delete(str_replace('storage/', '', $menu->menuImage)); // Xóa hình ảnh cũ
            }
            // Lấy tên gốc của file
            $originalExtension = $request->file('menuImage')->getClientOriginalExtension();
            // Tạo tên hình ảnh với định dạng "menu_randomString.extension"
            $randomString = uniqid();
            $imageName = "menu_{$randomString}.{$originalExtension}"; 
            $menuImagePath = $request->file('menuImage')->storeAs('menu-images', $imageName, 'public');
            $menu->menuImage = 'storage/' . $menuImagePath; // Gán đường dẫn mới cho hình ảnh
        }

        // Cập nhật tên menu và trạng thái
        $menu->menuName = $request->input('menuName');
        $menu->status = $request->input('status'); // Cập nhật trạng thái
        $menu->save();

        // Trả về mã trạng thái 200 (OK)
        return response()->noContent(200);
    }

    // Xóa menu
    public function destroyMenu($id)
    {
        // Tìm menu theo ID
        $menu = Menu::findOrFail($id);
    
        // Kiểm tra và xóa hình ảnh nếu có
        if ($menu->menuImage && Storage::exists(str_replace('storage/', '', $menu->menuImage))) {
            Storage::delete(str_replace('storage/', '', $menu->menuImage)); // Xóa hình ảnh
        }
    
        // Xóa thư mục chứa hình ảnh menu nếu nó tồn tại
        $menuName = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $menu->menuName))));
        $directoryPath = "menuItem-images/$menuName";
    
        if (Storage::exists($directoryPath)) {
            Storage::deleteDirectory($directoryPath); // Xóa thư mục
        }
    
        // Xóa menu khỏi cơ sở dữ liệu
        $menu->delete();
    
        // Trả về mã trạng thái 204 (No Content)
        return response()->noContent(204);
    }
    
    public function getMenus()
    {
        // Gọi phương thức getMenus từ MenuController để lấy danh sách menu
        return parent::getMenus(); 
    }
}
