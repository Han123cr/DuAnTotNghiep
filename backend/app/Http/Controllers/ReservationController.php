<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use App\Models\Database\TableOrder;
use App\Models\Database\Table;
use App\Models\Database\Branch;
use Illuminate\Support\Facades\Auth;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\ErrorCorrectionLevel;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{


    // Lấy danh sách các đặt chỗ của người dùng hiện tại
    
  
   public function getUserReservations(Request $request)
   {
       // Lấy ID người dùng hiện tại từ Auth
       $currentCustomerId = Auth::guard('customer')->id();

       // Lấy danh sách đặt chỗ của người dùng hiện tại và thông tin chi nhánh liên quan
       $reservations = TableOrder::where('customerID', $currentCustomerId)
           ->with('branch') // Thêm quan hệ để lấy thông tin chi nhánh
           ->get();

       // Kiểm tra xem có đặt chỗ nào không
       if ($reservations->isEmpty()) {
           return response()->json([
               'message' => 'Không có đơn đặt chỗ nào.',
           ], 404);
       }

       // Trả về danh sách các đặt chỗ kèm chi nhánh
       return response()->json([
           'message' => 'Danh sách các đặt chỗ của bạn.',
           'reservations' => $reservations,
       ], 200);
   }














    public function cancelReservation(Request $request)
{
    // Xác thực dữ liệu đầu vào
    $request->validate([
        'reservationId' => 'required|exists:reservations,reservationId',
    ]);

    // Lấy reservationId từ yêu cầu
    $reservationId = $request->input('reservationId');

    // Tìm đặt chỗ theo reservationId
    $reservation = TableOrder::find($reservationId);

    if (!$reservation) {
        return response()->json([
            'message' => 'Không tìm thấy đặt chỗ với ID đã cho.',
        ], 404);
    }

    // Lấy ID người dùng hiện tại (customerID từ Auth)
    $currentCustomerId = Auth::guard('customer')->id();

    // Kiểm tra xem đặt chỗ có thuộc về người dùng hiện tại không
    if ($reservation->customerID != $currentCustomerId) {
        return response()->json([
            'message' => 'Bạn không có quyền hủy đặt chỗ này.',
        ], 403); // Forbidden
    }

    // Cập nhật trạng thái bàn thành 'Available'
    Table::where('tableID', $reservation->tableID)
        ->update(['tableStatus' => 'open']);

    // Hủy đặt chỗ
    $reservation->reservationStatus = 'cancelled';
    $reservation->save();

    return response()->json([
        'message' => 'Đặt chỗ đã được hủy thành công.',
    ], 200);
}



    // Lấy bàn trống và đặt chỗ
    public function getAvailableTables()
    {
        // Lấy danh sách các chi nhánh
        $branches = Branch::all();
        $availableTables = [];
        
        foreach ($branches as $branch) {
            // Lấy các bàn của chi nhánh này không có trạng thái 'close'
            $tables = Table::where('branchID', $branch->branchID)
                ->where('tableStatus', '!=', 'close')
                ->get();
    
            $branchTables = []; // Danh sách bàn của chi nhánh này
    
            foreach ($tables as $table) {
                // Lấy danh sách các thời gian đặt bàn cho bàn này
                $reservations = TableOrder::where('tableID', $table->tableID)->get();
                $arrivalTimes = [];
    
                foreach ($reservations as $reservation) {
                    $arrivalTime = $reservation->arrivalTime;
    
                    // Kiểm tra trạng thái bàn
                    if ($table->tableStatus === 'wait') {
                        // Log thông tin khi trạng thái là 'wait'
                       
    
                        // Cộng 3 giờ và trừ 3 giờ
                        $startTime = \Carbon\Carbon::parse($arrivalTime)
                            ->subHours(3)
                            ->format('Y-m-d H:i:s');
    
                        $endTime = \Carbon\Carbon::parse($arrivalTime)
                            ->addHours(3)
                            ->format('Y-m-d H:i:s');
    
                        // Thêm giờ ban đầu vào danh sách
                        $arrivalTimes[] = [
                            'start' => $startTime, // Giờ đã trừ 3 giờ
                            'initial' => $arrivalTime, // Giờ ban đầu
                            'end' => $endTime, // Giờ đã cộng 3 giờ
                        ];
    
                        // Log thông tin thời gian đã tính toán
                     
                    }
                }
    
                // Thêm thông tin bàn vào danh sách bàn trong chi nhánh
                $branchTables[] = [
                    'tableID' => $table->tableID,
                    'tableNumber' => $table->tableNumber,
                    'tableStatus' => $table->tableStatus,
                    'arrivalTimes' => $arrivalTimes, // Danh sách giờ có sẵn
                ];
            }
    
            // Nếu có bàn có sẵn, thêm vào danh sách chi nhánh
            if (!empty($branchTables)) {
                $availableTables[] = [
                    'branch' => [
                        'branchID' => $branch->branchID,
                        'branchName' => $branch->branchName,
                        'branchAddress' => $branch->address,
                        'tables' => $branchTables, // Danh sách bàn trong chi nhánh
                    ],
                ];
            }
        }
    
        // Trả về danh sách bàn có sẵn dưới dạng JSON
        return response()->json([
            'availableTables' => $availableTables,
        ], 200);
    }
    


    // Phương thức lưu đặt chỗ
    public function storeReservation(Request $request)
{
    $request->validate([
        'numberOfPeople' => 'required|integer|min:1',
        'arrivalTime' => 'required|date',
        'branchID' => 'required|exists:branches,branchID',
        'tableID' => 'required|exists:tables,tableID',
        'bookerName' => 'required|string|max:255',
        'bookerPhoneNumber' => 'required|numeric|digits_between:10,15',
        'notes' => 'nullable|string|max:500',
    ]);

    $numberOfPeople = $request->input('numberOfPeople');
    $arrivalTime = $request->input('arrivalTime');
    $branchID = $request->input('branchID');
    $tableID = $request->input('tableID');
    $bookerName = $request->input('bookerName');
    $bookerPhoneNumber = $request->input('bookerPhoneNumber');
    $notes = $request->input('notes', '');

    // Lấy trạng thái bàn
    $table = Table::find($tableID);
    
    // Kiểm tra trạng thái bàn và các đặt chỗ đã có
    if ($table->tableStatus === 'wait') {
        // Lấy danh sách các đặt chỗ hiện có cho bàn này
        $reservations = TableOrder::where('tableID', $tableID)->get();
        $currentArrivalTime = \Carbon\Carbon::parse($arrivalTime);
        $isInWaitTime = false;

        foreach ($reservations as $reservation) {
            $existingArrivalTime = \Carbon\Carbon::parse($reservation->arrivalTime);
            $startTime = $existingArrivalTime->subHours(3);
            $endTime = $existingArrivalTime->addHours(3);
            
            // Kiểm tra xem thời gian đến có nằm trong khoảng đã trừ và đã cộng không
            if ($currentArrivalTime->between($startTime, $endTime)) {
                $isInWaitTime = true;
                break;
            }
        }

        if ($isInWaitTime) {
            return response()->json([
                'message' => 'Thời gian đến đã bị trùng với một đặt chỗ hiện có.',
            ], 400);
        }
    }

    // Lưu thông tin vào session
    Session::put('reservation', [
        'numberOfPeople' => $numberOfPeople,
        'arrivalTime' => $arrivalTime,
        'branchID' => $branchID,
        'tableID' => $tableID,
        'bookerName' => $bookerName,
        'bookerPhoneNumber' => $bookerPhoneNumber,
        'notes' => $notes,
    ]);

    return response()->json([
        'message' => 'Thông tin đặt bàn đã được lưu vào session.',
        'reservation' => Session::get('reservation'),
    ], 200);
}

    // Xác nhận đặt chỗ sau thanh toán
    public function confirmDeposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'partnerCode' => 'required|string',
            'orderId' => 'required|string',
            'requestId' => 'required|string',
            'extraData' => 'nullable|string',
            'transId' => 'required|string',
            'resultCode' => 'required|integer',
            'message' => 'required|string',
            'responseTime' => 'required|integer',
            'signature' => 'required|string',
        ]);

        if ($request->resultCode == 0) {
            $reservationData = Session::get('reservation');
            if ($reservationData) {
                $reservation = TableOrder::create([
                    'createdAt' => now(),
                    'arrivalTime' => $reservationData['arrivalTime'],
                    'numberOfPeople' => $reservationData['numberOfPeople'],
                    'notes' => $reservationData['notes'] ?? null,
                    'bookerName' => $reservationData['bookerName'],
                    'bookerPhoneNumber' => $reservationData['bookerPhoneNumber'],
                    'tableNumber' => $reservationData['tableID'],
                    'reservationStatus' => 'pending',
                    'deposit' => $request->amount,
                    'paymentMethod' => 'MoMo',
                    'transactionID' => $request->transId,
                    'customerID' => Auth::guard('customer')->id(),
                    'branchID' => $reservationData['branchID'],
                    'tableID' => $reservationData['tableID'],
                ]);

                Table::where('tableID', $reservationData['tableID'])
                    ->update(['tableStatus' => 'Reserved']);

                Session::forget('reservation');

                return response()->json([
                    'message' => 'Giao dịch thành công và đặt chỗ đã được xác nhận!',
                    'reservation' => $reservation,
                ], 201);
            }

            return response()->json([
                'message' => 'Không tìm thấy thông tin đặt chỗ trong session.',
            ], 400);
        }

        return response()->json([
            'message' => 'Giao dịch không thành công. Vui lòng thử lại.',
            'resultCode' => $request->resultCode,
            'messageDetail' => $request->message,
        ], 400);
    }

    // Tạo yêu cầu thanh toán
    public function createPayment($numberOfPeople)
    {
        $orderId = uniqid();
        $amount = $numberOfPeople * 50;

        $requestData = [
            'partnerCode' => env('MOMO_PARTNER_CODE'),
            'accessKey' => env('MOMO_ACCESS_KEY'),
            'requestId' => $orderId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => 'Thanh toán đặt chỗ',
            'returnUrl' => url('/momo/return'),
            'notifyUrl' => url('/momo/notify'),
            'requestType' => 'captureWallet',
            'signature' => $this->generateSignature($orderId, $amount),
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post(env('MOMO_ENDPOINT'), json_encode($requestData));

        $qrCode = new QrCode($response['payUrl']);
        $qrCode->setErrorCorrectionLevel(ErrorCorrectionLevel::HIGH());
        $qrCode->setSize(300);
        $qrCodeData = $qrCode->writeString();

        $qrCodePath = public_path('qrcodes/' . $orderId . '.png');
        file_put_contents($qrCodePath, $qrCodeData);

        return response()->json([
            'message' => 'Yêu cầu thanh toán đã được gửi.',
            'qrCodeUrl' => url('qrcodes/' . $orderId . '.png'),
            'amount' => $amount,
        ], 200);
    }

    private function generateSignature($orderId, $amount)
    {
        $data = env('MOMO_PARTNER_CODE') . '|' . env('MOMO_ACCESS_KEY') . '|' . $orderId . '|' . $amount . '|captureWallet|' . env('MOMO_SECRET_KEY');
        return hash('sha256', $data);
    }
}
