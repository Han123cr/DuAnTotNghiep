<?php

namespace App\Http\Controllers;

use App\Models\Cart; // Model cho bảng carts
use App\Models\MenuItem; // Model cho bảng menuItems
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Thêm món vào giỏ hàng
    public function addToCart(Request $request)
    {
        $request->validate([
            'menuItemID' => 'required|exists:menuItems,menuItemID',
            'quantity' => 'required|integer|min:1',
            'customerID' => 'required|exists:customers,customerID'
        ]);

        $cartItem = Cart::updateOrCreate(
            [
                'menuItemID' => $request->menuItemID,
                'customerID' => $request->customerID
            ],
            ['quantity' => $request->quantity]
        );

        return response()->json($cartItem, 201);
    }

    // Lấy giỏ hàng của khách hàng
    public function getCart($customerID)
    {
        $cartItems = Cart::where('customer_id', $customerID)->get();
        $cartTotal = $cartItems->sum(function($item) {
            return $item->price * $item->quantity;
        });
    
        return view('cart', compact('cartItems', 'cartTotal'));
    }

    // Cập nhật số lượng món ăn trong giỏ hàng
    public function updateCart(Request $request, $cartItemID)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::find($cartItemID);
        if (!$cartItem) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json($cartItem);
    }

    // Xóa món ăn khỏi giỏ hàng
    public function removeFromCart($cartItemID)
    {
        $cartItem = Cart::find($cartItemID);
        if (!$cartItem) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $cartItem->delete();
        return response()->json(['message' => 'Item removed successfully']);
    }
}