<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Database\Menu;
use App\Models\Database\MenuItem;

class MenuController extends Controller
{
    public function getMenus()
    {
        $menus = Menu::all(); // Lấy tất cả dữ liệu từ bảng menus
        return response()->json($menus); // Trả về dữ liệu dưới dạng JSON
    }

    // Hàm lấy tất cả món ăn
    public function getMenuItems()
    {
        $menuItems = MenuItem::all(); // Lấy tất cả dữ liệu từ bảng menuItems
        return response()->json($menuItems); // Trả về dữ liệu dưới dạng JSON
    }

    public function getMenusWithItems()
    {
        $menus = Menu::with('menuItems')->get();

        // Tạo một mảng để chứa kết quả
        $result = [];

        foreach ($menus as $menu) {
            $menuData = [
                'menuID' => $menu->menuID,
                'menuName' => $menu->menuName,
                'menuImage' => $menu->menuImage,
                'status' => $menu->status,
                'menuItems' => $menu->menuItems->map(function ($item) {
                    return [
                        'menuItemID' => $item->menuItemID,
                        'itemName' => $item->itemName,
                        'itemImage' => $item->itemImage,
                        'description' => $item->description,
                        'price' => $item->price,
                        'discount' => $item->discount,
                        'size' => $item->size,
                        'statusToday' => $item->statusToday,
                        'status' => $item->status,
                    ];
                }),
            ];

            $result[] = $menuData; // Thêm menu đã xử lý vào kết quả
        }

        return response()->json($result); // Trả về dữ liệu dưới dạng JSON
    }

    // Hàm lấy chi tiết món ăn
    public function getMenuItemDetails($id)
    {
        $menuItem = MenuItem::find($id); // Tìm món ăn theo ID

        if (!$menuItem) {
            return response()->json(['message' => 'Menu item not found'], 404); // Trả về lỗi 404 nếu không tìm thấy
        }

        return response()->json($menuItem); // Trả về dữ liệu món ăn dưới dạng JSON
    }
}
