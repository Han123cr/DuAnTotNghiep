CREATE TABLE KhachHang (
    MaKhachHang INT AUTO_INCREMENT PRIMARY KEY,   
    Ten VARCHAR(255) NOT NULL,                    
    Anh VARCHAR(255),                             
    Email VARCHAR(255) UNIQUE NOT NULL,           
    SoDienThoai VARCHAR(15),                      
    MaKhau VARCHAR(255) NOT NULL,                 
    DiaChi TEXT,                                  
    Role ENUM('user', 'admin') DEFAULT 'user'  
);


CREATE TABLE DatBan (
    MaDatBan INT AUTO_INCREMENT PRIMARY KEY,
    ThoiGianDat DATETIME NOT NULL,
    ThoiGianDen DATETIME NOT NULL,
    SoNguoi INT NOT NULL,
    TienCoc DECIMAL(10, 2) NOT NULL,
    YeuCauDatBiet TEXT,
    TrangThaiDatBan ENUM('Chờ xử lý', 'Đã xác nhận', 'Đã hủy') DEFAULT 'Chờ xử lý',
    Ten VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(15),
    MaChiNhanh INT,
    MaKhachHang INT,
    FOREIGN KEY (MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh),
    FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang)
);

CREATE TABLE ChiNhanh (
    MaChiNhanh INT AUTO_INCREMENT PRIMARY KEY,
    TenChiNhanh VARCHAR(255) NOT NULL,
    DiaChi VARCHAR(255),
    SDTChiNhanh VARCHAR(15)
);


CREATE TABLE Ban (
    MaBan INT AUTO_INCREMENT PRIMARY KEY,
    SoBan INT NOT NULL,
    TrangThaiBan ENUM('Có sẵn', 'Đã đặt') NOT NULL,
    MaDatBan INT,
    FOREIGN KEY (MaDatBan) REFERENCES DatBan(MaDatBan)
);
