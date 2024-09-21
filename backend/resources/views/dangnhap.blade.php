<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Nhập</title>
</head>
<body>
    <h1>Đăng Nhập</h1>
    @if ($errors->any())
        <div>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('dangnhap') }}" method="POST">
        @csrf
        <div>
            <label for="email_or_phone">Email hoặc Số Điện Thoại:</label>
            <input type="text" id="email_or_phone" name="email_or_phone" required>
        </div>
        <div>
            <label for="password">Mật Khẩu:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Đăng Nhập</button>
    </form>
</body>
</html>
