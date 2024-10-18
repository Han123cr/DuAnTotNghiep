<?php

namespace App\Http\Controllers\AdminControllers;

use App\Models\Database\TableOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class TableOrderAdminController extends Controller
{
    // Lấy danh sách tất cả đơn đặt bàn kèm thông tin khóa ngoại
    public function getTableOrders()
    {
        // Eager load các quan hệ khách hàng, bàn, và phương thức thanh toán
        $tableOrders = TableOrder::with(['customer', 'table', 'paymentMethod'])->get();

        return response()->json($tableOrders, 200);
    }

    // Tạo đơn đặt bàn mới
    public function createTableOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'arrivalTime' => 'required|date',
            'numberOfPeople' => 'required|integer',
            'bookerName' => 'required|string|max:255',
            'bookerPhoneNumber' => 'required|string|max:15',
            'tableOrderStatus' => 'in:pending,confirmed,cancelled,completed',
            'deposit' => 'nullable|numeric',
            'customerID' => 'nullable|integer|exists:customers,customerID',
            'tableID' => 'nullable|integer|exists:tables,tableID',
            'paymentMethodID' => 'nullable|integer|exists:paymentMethods,paymentMethodID',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tạo đơn đặt bàn mới
        $tableOrder = TableOrder::create([
            'createdAt' => now(),
            'arrivalTime' => $request->input('arrivalTime'),
            'numberOfPeople' => $request->input('numberOfPeople'),
            'notes' => $request->input('notes'),
            'bookerName' => $request->input('bookerName'),
            'bookerPhoneNumber' => $request->input('bookerPhoneNumber'),
            'tableOrderStatus' => $request->input('tableOrderStatus', 'pending'),
            'deposit' => $request->input('deposit'),
            'transactionCode' => $request->input('transactionCode'),
            'customerID' => $request->input('customerID'),
            'tableID' => $request->input('tableID'),
            'paymentMethodID' => $request->input('paymentMethodID'),
        ]);

        // Trả về đơn đặt bàn vừa tạo kèm theo thông tin khóa ngoại
        $tableOrder = TableOrder::with(['customer', 'table', 'paymentMethod'])
            ->find($tableOrder->tableOrderID);

        return response()->noContent(201);
    }

    // Cập nhật đơn đặt bàn
    public function updateTableOrder(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tableOrderStatus' => 'in:pending,confirmed,cancelled,completed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tìm đơn đặt bàn theo ID
        $tableOrder = TableOrder::findOrFail($id);

        // Cập nhật thông tin đơn đặt bàn
        $tableOrder->update([
            'tableOrderStatus' => $request->input('tableOrderStatus'),
        ]);

        // Trả về đơn đặt bàn đã cập nhật kèm theo thông tin khóa ngoại
        $tableOrder = TableOrder::with(['customer', 'table', 'paymentMethod'])->find($id);

        return response()->json($tableOrder, 200);
    }

    // Xóa đơn đặt bàn
    public function deleteTableOrder($id)
    {
        $tableOrder = TableOrder::findOrFail($id);
        $tableOrder->delete();

        return response()->noContent(204);
    }
}
