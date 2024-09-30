<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giỏ Hàng</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div class="container">
        <h1>Giỏ Hàng Của Bạn</h1>

        @if($cartItems->isEmpty())
            <p>Giỏ hàng của bạn trống.</p>
        @else
            <table class="table">
                <thead>
                    <tr>
                        <th>Tên Món</th>
                        <th>Số Lượng</th>
                        <th>Giá</th>
                        <th>Tổng</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($cartItems as $item)
                        <tr>
                            <td>{{ $item->product_name }}</td>
                            <td>{{ $item->quantity }}</td>
                            <td>{{ number_format($item->price, 2) }} VNĐ</td>
                            <td>{{ number_format($item->quantity * $item->price, 2) }} VNĐ</td>
                            <td>
                                <form action="{{ route('cart.remove', $item->id) }}" method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger">Xóa</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>