<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Demo</title>
</head>
<body>
    <h1>Session backend1</h1>

    @if (session('success'))
        <p style="color: green;">{{ session('success') }}</p>
    @endif

    <form action="{{ route('session.store') }}" method="POST">
        @csrf
        <label for="data">Nhập dữ liệu:</label>
        <input type="text" name="data" id="data" value="{{ old('data', $data) }}" required>
        <button type="submit">Lưu vào Session</button>
    </form>

    <h2>Dữ liệu trong Session:</h2>
    <p>{{ $data ? $data : 'Chưa có dữ liệu' }}</p>
</body>
</html>
