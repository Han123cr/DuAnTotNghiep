-- bảng customers
CREATE TABLE customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,   
    name VARCHAR(255) NOT NULL,                    
    avatar VARCHAR(255),                             
    email VARCHAR(255) UNIQUE,           -- email phải là duy nhất
    phoneNumber VARCHAR(15) UNIQUE,      -- số điện thoại phải là duy nhất
    password VARCHAR(255) NOT NULL,                 
    status ENUM('active', 'blocked') DEFAULT 'active',
    role ENUM('user', 'admin', 'staff') DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- ngày tạo tài khoản
    CHECK (email IS NOT NULL OR phoneNumber IS NOT NULL) 
);

CREATE TABLE addresses (
    addressID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT,                -- Khóa ngoại liên kết tới bảng customers
    address TEXT NOT NULL,         -- Địa chỉ
    recipientPhone VARCHAR(15) NOT NULL, -- Số điện thoại của người nhận
    recipientName VARCHAR(255) NOT NULL, -- Tên người nhận
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE
);




-- bảng branches
CREATE TABLE branches (
    branchID INT AUTO_INCREMENT PRIMARY KEY,
    branchName VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    branchPhone VARCHAR(15) UNIQUE      -- số điện thoại chi nhánh cũng phải duy nhất
);

-- bảng tables
CREATE TABLE tables (
    tableID INT AUTO_INCREMENT PRIMARY KEY,
    tableNumber INT NOT NULL,
    tableStatus ENUM('open', 'close', 'wait') NOT NULL,   -- trạng thái bàn
    branchID INT,

    -- khóa ngoại liên kết tới bảng branches
    FOREIGN KEY (branchID) REFERENCES branches(branchID)
);

-- bảng reservations
CREATE TABLE reservations (
    reservationID INT AUTO_INCREMENT PRIMARY KEY,
    createdAt DATETIME NOT NULL,            -- thời gian tạo đặt chỗ
    arrivalTime DATETIME NOT NULL,          -- thời gian đến
    numberOfPeople INT NOT NULL,            -- số lượng người
    notes TEXT,                    -- các yêu cầu đặc biệt
    bookerName VARCHAR(255) NOT NULL,       -- tên người đặt
    bookerPhoneNumber VARCHAR(15) NOT NULL, -- số điện thoại người đặt
    tableNumber INT NOT NULL,                -- số bàn
    reservationStatus ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending', -- trạng thái đặt chỗ
    deposit DECIMAL(10, 2) NOT NULL CHECK (deposit >= 0),   -- đảm bảo tiền đặt cọc không âm
    paymentMethod TEXT,                      -- phương thức thanh toán
    transactionID TEXT,                      -- mã giao dịch

    -- khóa ngoại liên kết tới bảng customers, branches và tables
    customerID INT,
    branchID INT, 
    tableID INT,                    -- liên kết tới bàn

    -- khóa ngoại
    FOREIGN KEY (branchID) REFERENCES branches(branchID),
    FOREIGN KEY (customerID) REFERENCES customers(customerID),
    FOREIGN KEY (tableID) REFERENCES tables(tableID)  -- khóa ngoại liên kết tới tables
);


CREATE TABLE tables_reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservationID INT,
    tableID INT,
    FOREIGN KEY (reservationID) REFERENCES reservations(reservationID),
    FOREIGN KEY (tableID) REFERENCES tables(tableID)
);

-- Bảng Menu
CREATE TABLE menus (
    menuID INT AUTO_INCREMENT PRIMARY KEY,
    menuName VARCHAR(255) NOT NULL               -- Tên của menu
);

-- Bảng Món ăn
CREATE TABLE menuItems (
    menuItemID INT AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL,              -- Tên của món ăn
    description TEXT,                             -- Mô tả món ăn
    price DECIMAL(10, 2) NOT NULL,               -- Giá của món ăn
    image VARCHAR(255),                           -- Hình ảnh của món ăn
    menuID INT,                                   -- Khóa ngoại liên kết tới bảng menus
    FOREIGN KEY (menuID) REFERENCES menus(menuID) ON DELETE CASCADE
);

-- Bảng Hóa đơn
CREATE TABLE bills (
    billID INT AUTO_INCREMENT PRIMARY KEY,
    reservationID INT,                            -- Liên kết tới đơn đặt bàn
    customerID INT,                              -- Liên kết tới khách hàng
    totalAmount DECIMAL(10, 2) NOT NULL,         -- Tổng số tiền của hóa đơn
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- Thời gian tạo hóa đơn
    paymentStatus ENUM('paid', 'unpaid') DEFAULT 'unpaid', -- Trạng thái thanh toán
    paymentMethod VARCHAR(255),                   -- Phương thức thanh toán (tiền mặt, thẻ, ...)
    transactionID VARCHAR(255),                   -- Mã giao dịch nếu có

    -- Khóa ngoại
    FOREIGN KEY (reservationID) REFERENCES reservations(reservationID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE
);

-- Bảng Món ăn trong hóa đơn
CREATE TABLE billItems (
    billItemID INT AUTO_INCREMENT PRIMARY KEY,
    billID INT,                                   -- Liên kết tới hóa đơn
    menuItemID INT,                               -- Liên kết tới món ăn
    quantity INT NOT NULL,                        -- Số lượng món ăn
    subtotal DECIMAL(10, 2) NOT NULL,            -- Tổng tiền của món ăn (giá món ăn x số lượng)

    -- Khóa ngoại
    FOREIGN KEY (billID) REFERENCES bills(billID) ON DELETE CASCADE,
    FOREIGN KEY (menuItemID) REFERENCES menuItems(menuItemID) ON DELETE CASCADE  -- Liên kết tới món ăn
);


-- Thêm dữ liệu mẫu vào bảng customers
-- Chèn thêm khách hàng

-- Chèn dữ liệu cho hai chi nhánh
INSERT INTO branches (branchName, address, branchPhone) 
VALUES 
('Main Branch', '123 Main St, Cityville', '1234000000'),
('North Branch', '456 North St, Townsville', '1234000001');



-- Thêm 20 bàn cho Main Branch
INSERT INTO tables (tableNumber, tableStatus, branchID) 
VALUES 
(1, 'open', 1),
(2, 'open', 1),
(3, 'open', 1),
(4, 'open', 1),
(5, 'open', 1),
(6, 'open', 1),
(7, 'open', 1),
(8, 'open', 1),
(9, 'open', 1),
(10, 'open', 1),
(11, 'close', 1),
(12, 'close', 1),
(13, 'close', 1),
(14, 'wait', 1),
(15, 'wait', 1),
(16, 'open', 1),
(17, 'open', 1),
(18, 'open', 1),
(19, 'open', 1),
(20, 'open', 1);

-- Thêm 30 bàn cho North Branch
INSERT INTO tables (tableNumber, tableStatus, branchID) 
VALUES 
(1, 'open', 2),
(2, 'open', 2),
(3, 'open', 2),
(4, 'open', 2),
(5, 'open', 2),
(6, 'open', 2),
(7, 'open', 2),
(8, 'open', 2),
(9, 'open', 2),
(10, 'open', 2),
(11, 'close', 2),
(12, 'close', 2),
(13, 'wait', 2),
(14, 'wait', 2),
(15, 'open', 2),
(16, 'open', 2),
(17, 'open', 2),
(18, 'open', 2),
(19, 'open', 2),
(20, 'open', 2),
(21, 'open', 2),
(22, 'open', 2),
(23, 'open', 2),
(24, 'open', 2),
(25, 'open', 2),
(26, 'open', 2),
(27, 'open', 2),
(28, 'open', 2),
(29, 'open', 2),
(30, 'open', 2);










-- Chèn dữ liệu vào bảng menu
INSERT INTO menus (menuName) VALUES 
('Món tráng miệng'),
('Salad'),
('Đồ uống'),
('Pizza'),
('Mì Ý'),
('Beefsteak');


-- Chèn dữ liệu vào bảng món ăn
INSERT INTO menuItems (itemName, description, price, image, menuID) VALUES
-- Món tráng miệng
('Bánh flan', 'Món tráng miệng truyền thống với lớp kem trứng mềm mịn và lớp caramel ngọt ngào.', 25000, 'menu/mon_trang_mieng/banh_flan.png', 1),
('Bánh Esterhazy', 'Bánh ngọt nổi tiếng từ Hungary, với nhiều lớp kem bơ hạt dẻ và lớp bột mỏng giòn tan, trang trí với những đường kẻ tinh tế.', 40000, 'menu/mon_trang_mieng/banh_esterhazy.png', 1),
('Kem socola', 'Kem vị socola đậm đà, ngọt ngào và mát lạnh, thích hợp để tráng miệng.', 30000, 'menu/mon_trang_mieng/kem_socola.png', 1),
('Kẹo cuộn', 'Loại kẹo cuộn nhiều lớp, ngọt ngào, bắt mắt, là món ăn vặt phổ biến và thú vị.', 10000, 'menu/mon_trang_mieng/keo_cuon.png', 1),
('Rau câu jelly', 'Thạch rau câu với hương vị trái cây đa dạng, mát lạnh và dai giòn.', 15000, 'menu/mon_trang_mieng/rau_cau_jelly.png', 1),

-- Salad
('Salad cá hồi', 'Cá Hồi | Rau mầm, rong biển, cà chua & rong biển tosaka đỏ-xanh kèm sốt mè rang.', 10.00, 'menu/salad/salad_ca_houi.png', 2),
('Salad nhiệt đới', 'Rong nho, Rau mầm, rong biển, cà chua | Bạch tuộc Nhật, Cá Trích Ép Trứng, Cá Hồi kèm sốt mè rang.', 9.00, 'menu/salad/salad_nhiet_doi.png', 2),
('Salad thanh cua', 'Thanh cua, Rong biển tosaka xanh - đỏ, rau mầm, rong biển, cà chua kèm sốt mè rang.', 9.00, 'menu/salad/salad_thanh_cua.png', 2),
('Salad da giòn', 'Da cá Hồi chiên giòn| Rong nho| Lolo xanh| Rau mầm, rong biển, cà chua & rong biển tosaka đỏ-xanh kèm sốt Salad.', 8.00, 'menu/salad/salad_da_gion.png', 2),
('Salad cá ngừ', 'Rong nho| Rau mầm, rong biển, cà chua | Cá Ngừ chín trộn mayo | Bơ trái kèm sốt mè rang.', 12.00, 'menu/salad/salad_ca_ngu.png', 2),
('Salad rong nho', 'Rong nho| Rau mầm, rong biển, cà chua & rong biển tosaka đỏ-xanh kèm sốt mè rang.', 7.00, 'menu/salad/salad_rong_nho.png', 2),
('Salad Cá Hồi & Bơ', 'Cá hồi| Bơ trái| Xà lách búp mỹ| Rong nho tosaka| Rong nho kèm sốt mè rang.', 13.00, 'menu/salad/salad_ca_houi_bo.png', 2),
('Salad Mix', 'Cá hồi| Cá trích ép trứng vàng & đỏ| Tôm thẻ| Bạch tuộc Nhật| Thanh cua| Sò đỏ Canada| Các loại rau mầm, rong biển, cà chua, xà lách kèm sốt mè rang.', 15.00, 'menu/salad/salad_mix.png', 2),

-- Đồ uống
('Coca', 'Nước giải khát có ga vị coca cola, được ưa chuộng trong các bữa tiệc hoặc dùng hàng ngày.', 15.00, 'menu/do_uong/coca.png', 3),
('Brandy - 10th Mountain éT 2012 Vail.co', 'Rượu brandy cao cấp, với hương vị trái cây đậm đà, được sản xuất tại Colorado, thích hợp cho những dịp đặc biệt.', 2500000, 'menu/do_uong/brandy_10th_mountain.png', 3),
('Nước Khoáng Vivant', 'Nước khoáng tự nhiên bổ sung khoáng chất, có ga nhẹ, mang lại cảm giác tươi mát.', 12.00, 'menu/do_uong/nuoc_khoang_vivant.png', 3),
('Rượu Whisky Ballantine - G82 255', 'Rượu whisky Scotch với hương vị mạnh mẽ, nồng ấm, thích hợp cho những bữa tiệc sang trọng.', 1200000, 'menu/do_uong/ruou_whisky_ballantines.png', 3),
('Rượu vang Passion - Reserva 750ml', 'Rượu vang đậm đà với hương vị trái cây chín mọng, thích hợp khi dùng kèm các món thịt.', 500000, 'menu/do_uong/ruou_vang_passion.png', 3),

-- Pizza
('Pizza Hải Sản Nhiệt Đới', 'Tôm, nghêu, mực cua, dứa với sốt Thousand Island.', 159000, 'menu/pizza/pizza_hai_san_nhiet_doi.png', 4),
('Pizza Thịt Xông Khói', 'Thịt giăm bông, thịt xông khói và hai loại rau của ớt xanh, cà chua.', 149000, 'menu/pizza/pizza_thit_xong_khoi.png', 4),
('Pizza Xúc Xích Ý', 'Xúc xích kiểu Ý trên nền sốt cà chua.', 139000, 'menu/pizza/pizza_xuc_xich_y.png', 4),
('Pizza Thịt Nguội & Nấm', 'Pizza giăm bông và nấm đem đến cho bạn những trải nghiệm thú vị.', 139000, 'menu/pizza/pizza_thit_nguoi_nam.png', 4),
('Pizza Hawaiian', 'Giăm bông, thịt muối và dứa.', 139000, 'menu/pizza/pizza_hawaiian.png', 4),
('Pizza Rau Củ', 'Hành, ớt chuông, nấm, dứa, cà chua.', 119000, 'menu/pizza/pizza_rau_cu.png', 4),
('Pizza Hải Sản Cao Cấp', 'Tôm, cua, mực và nghêu với sốt Marinara.', 159000, 'menu/pizza/pizza_hai_san_cao_cap.png', 4),
('Pizza Đặc Biệt', 'Xúc xích bò, giăm bông, thịt xông khói và cả thế giới rau phong phú.', 149000, 'menu/pizza/pizza_dac_biet.png', 4),
('Pizza Gà Nướng', 'Gà nướng, gà bơ tỏi và gà ướp sốt nấm.', 149000, 'menu/pizza/pizza_ga_nuong.png', 4),

-- Mì Ý
('Mì Ý Cay Hải Sản', 'Mỳ Ý rán với các loại hải sản tươi ngon cùng ớt và tỏi.', 139000, 'menu/mi_y/mi_y_cay_hai_san.png', 5),
('Mì Ý chay sốt kem tươi', 'Mỳ Ý chay thơm ngon với sốt kem và nấm.', 109000, 'menu/mi_y/mi_y_chay_sot_kem_tươi.png', 5),
('Mì Ý cay xúc xích', 'Mỳ Ý rán với xúc xích cay, thảo mộc, ngò gai và húng quế Ý.', 119000, 'menu/mi_y/mi_y_cay_xuc_xich.png', 5),
('Mì Ý Giăm Bông', 'Mỳ Ý, nấm và giăm bông được nấu cùng với sốt kem trắng.', 119000, 'menu/mi_y/mi_y_giam_bong.png', 5),
('Mì Ý Bò Bằm', 'Sốt thịt bò bằm đặc trưng kết hợp cùng mỳ Ý.', 139000, 'menu/mi_y/mi_y_bo_bam.png', 5),
('Mì Ý sốt kem cà chua', 'Sự tươi ngon của tôm kết hợp với sốt kem cà chua.', 139000, 'menu/mi_y/mi_y_sot_kem_ca_chua.png', 5),
('Mì Ý truyền thống', 'Mỳ Ý sốt cà chua truyền thống, hòa quyện với hương vị bơ.', 119000, 'menu/mi_y/mi_y_truyen_thong.png', 5),

-- Beefsteak
('Beefsteak Bò Mỹ', 'Bò mỹ được chế biến đặc biệt, tẩm gia vị hoàn hảo và nướng ở nhiệt độ thích hợp.', 279000, 'menu/beefsteak/beefsteak_bo_my.png', 6),
('Beefsteak Bò Úc', 'Bò Úc chọn lọc được nướng lửa than, giữ được độ mềm ngọt.', 299000, 'menu/beefsteak/beefsteak_bo_uc.png', 6),
('Beefsteak Bò Kobe', 'Beefsteak bò Kobe thượng hạng, với độ mềm ngọt và hương vị độc đáo.', 399000, 'menu/beefsteak/beefsteak_bo_kobe.png', 6),
('Beefsteak Chén Thơm', 'Beefsteak được nấu cùng các loại thảo mộc tự nhiên.', 350000, 'menu/beefsteak/beefsteak_chen_thom.png', 6),
('Beefsteak Thượng Hạng', 'Bò thượng hạng, nướng với độ chính xác cao, cho món ăn tuyệt hảo.', 399000, 'menu/beefsteak/beefsteak_thuong_hang.png', 6);
