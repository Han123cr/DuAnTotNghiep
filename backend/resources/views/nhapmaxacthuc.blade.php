<!DOCTYPE html>
<html>
<head>
    <title>Xác Nhận Đăng Ký</title>
</head>
<body>

    <h1>Nhập mã xác thực,</h1>
    <form action="{{ route('checkmaxacnhan') }}" method="post">
    @csrf
    <input text="number" name="maxacthuc"/>
    <button type="submit">Đăng ký</button>
    </form>
</body>
</html>
