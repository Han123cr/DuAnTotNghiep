<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Database\MenuItem;
use Illuminate\Support\Facades\Storage;
use App\Models\Database\Menu; // Đừng quên import Menu model
use App\Http\Controllers\MenuController;

class MenuItemAdminController extends MenuController
{
    // Quy tắc xác thực
    protected function menuItemValidationRules()
    {
        return [
            'itemName' => 'required|string|max:255',
            'itemImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'size' => 'nullable|string',
            'statusToday' => 'nullable|in:in-stock,out-of-stock',
            'status' => 'required|in:display,hidden',
            'menuID' => 'required|exists:menus,menuID',
        ];
    }

    // Thêm sản phẩm
    public function storeMenuItem(Request $request)
    {
        $request->validate($this->menuItemValidationRules());

        $imagePath = null;
        if ($request->hasFile('itemImage')) {
            // Lấy tên menu để tạo đường dẫn
            $menu = Menu::findOrFail($request->input('menuID'));
            $menuName = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $menu->menuName))));

            // Lấy tên gốc của hình ảnh (không bao gồm phần mở rộng)
            $originalName = pathinfo($request->file('itemImage')->getClientOriginalName(), PATHINFO_FILENAME);
            $imageName = $originalName . '_' . uniqid() . '.' . $request->file('itemImage')->getClientOriginalExtension();
            $imagePath = $request->file('itemImage')->storeAs("menuItem-images/$menuName", $imageName, 'public');
            $imagePath = 'storage/' . $imagePath; 
        }

        MenuItem::create([
            'itemName' => $request->input('itemName'),
            'itemImage' => $imagePath,
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'discount' => $request->input('discount'),
            'size' => $request->input('size'),
            'statusToday' => $request->input('statusToday'),
            'status' => $request->input('status'),
            'menuID' => $request->input('menuID'),
        ]);

        return response()->noContent(201); // Trả về mã trạng thái 201 (Created)
    }

    // Cập nhật sản phẩm
    public function updateMenuItem(Request $request, $id)
{
    $request->validate($this->menuItemValidationRules());

    $menuItem = MenuItem::findOrFail($id);

    // Xử lý hình ảnh nếu có
    if ($request->hasFile('itemImage')) {
        // Xóa hình ảnh cũ nếu có
        if ($menuItem->itemImage) {
            Storage::delete(str_replace('storage/', '', $menuItem->itemImage)); // Xóa hình ảnh cũ
        }
        // Lấy tên menu để tạo đường dẫn
        $menu = Menu::findOrFail($menuItem->menuID);
        $menuName = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $menu->menuName))));

        // Lấy tên gốc của hình ảnh (không bao gồm phần mở rộng)
        $originalName = pathinfo($request->file('itemImage')->getClientOriginalName(), PATHINFO_FILENAME);
        $imageName = $originalName . '_' . uniqid() . '.' . $request->file('itemImage')->getClientOriginalExtension();
        $menuItem->itemImage = 'storage/' . $request->file('itemImage')->storeAs("menuItem-images/$menuName", $imageName, 'public');
    }

    // Cập nhật thông tin sản phẩm sử dụng switch case
    switch (true) {
        case $request->filled('itemName'):
            $menuItem->itemName = $request->input('itemName');
            break;
        case $request->filled('description'):
            $menuItem->description = $request->input('description');
            break;
        case $request->filled('price'):
            $menuItem->price = $request->input('price');
            break;
        case $request->filled('discount'):
            $menuItem->discount = $request->input('discount');
            break;
        case $request->filled('size'):
            $menuItem->size = $request->input('size');
            break;
        case $request->filled('statusToday'):
            $menuItem->statusToday = $request->input('statusToday');
            break;
        case $request->filled('status'):
            $menuItem->status = $request->input('status');
            break;
        case $request->filled('menuID'):
            $menuItem->menuID = $request->input('menuID');
            break;
    }

    // Lưu thay đổi
    $menuItem->save();

    return response()->noContent(200); // Trả về mã trạng thái 200 (OK)
}


    // Xóa sản phẩm
    public function destroyMenuItem($id)
    {
        $menuItem = MenuItem::findOrFail($id);

        // Xóa hình ảnh nếu có
        if ($menuItem->itemImage) {
            Storage::delete(str_replace('storage/', '', $menuItem->itemImage)); // Xóa hình ảnh
        }

        $menuItem->delete();

        return response()->noContent(204); // Trả về mã trạng thái 204 (No Content)
    }

    // Lấy tất cả món ăn
    public function getMenuItems()
    {
        return parent::getMenuItems(); // Gọi phương thức getMenuItems từ MenuController
    }
}
