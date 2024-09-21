<!-- resources/views/datban.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Đặt Bàn</title>
</head>
<body>
    <h1>Đặt Bàn</h1>

    @if(session('success'))
        <p>{{ session('success') }}</p>
    @endif

    <form action="/datban" method="POST">
        @csrf
      
        
        <label for="ThoiGianDen">Thời Gian Đến:</label>
        <input type="number" id="ThoiGianDen" name="ThoiGianDen" required>
        <br>
        
        <label for="SoNguoi">Số Người:</label>
        <input type="number" id="SoNguoi" name="SoNguoi" required>
        <br>
        
        <label for="TienCoc">Tiền Cọc:</label>
        <input type="number" step="0.01" id="TienCoc" name="TienCoc" required>
        <br>
        
        <label for="YeuCauDatBiet">Yêu Cầu Đặt Biệt:</label>
        <textarea id="YeuCauDatBiet" name="YeuCauDatBiet"></textarea>
        <br>
        
        <label for="TrangThaiDatBan">Trạng Thái Đặt Bàn:</label>
        <select id="TrangThaiDatBan" name="TrangThaiDatBan" required>
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đã hủy">Đã hủy</option>
        </select>
        <br>
        
        <label for="Ten">Tên:</label>
        <input type="text" id="Ten" name="Ten" required>
        <br>
        
        <label for="SoDienThoai">Số Điện Thoại:</label>
        <input type="text" id="SoDienThoai" name="SoDienThoai">
        <br>
        
        <label for="MaChiNhanh">Chi Nhánh:</label>
        <select id="MaChiNhanh" name="MaChiNhanh" required>
        <option value="1">s</option>
        </select>
        <br>
        <label for="MaKhachHang">Chi Nhánh:</label>
        <select id="MaKhachHang" name="MaKhachHang" required>
        <option value="1">s</option>
        </select>
        <br>
        
         
        <br>
        
        <button type="submit">Đặt Bàn</button>
    </form>
</body>
</html>
