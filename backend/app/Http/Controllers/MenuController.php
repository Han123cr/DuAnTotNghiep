<?php
namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // GET method to retrieve menus
    public function menus()
    {
        $menus = Menu::all(); // Lấy tất cả menu
        return response()->json($menus); // Trả về dữ liệu JSON
    }

    // POST method to create a new menu item
    public function store(Request $request)
    {
        $request->validate([
            'menuName' => 'required|string|max:255',
            'menuImage' => 'required|string|max:255',
        ]);
        
        $menu = Menu::create([
            'menuName' => $request->menuName,
            'menuImage' => $request->menuImage,
        ]);

        return response()->json($menu, 201); // Trả về menu vừa tạo với mã trạng thái 201
    }
}