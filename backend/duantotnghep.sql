-- -------------------------
-- CƠ SỞ DỮ LIỆU QUẢN LÝ NHÀ HÀNG
-- -------------------------
CREATE DATABASE duantotnghiep;
USE duantotnghiep;

-- Bảng quản trị viên (admin)
CREATE TABLE admin (
    adminID INT AUTO_INCREMENT PRIMARY KEY,      -- ID admin
    loginName VARCHAR(255),                      -- Tên đăng nhập
    password VARCHAR(255) NOT NULL               -- Mật khẩu
);

-- Bảng nhân viên (staffs)
CREATE TABLE staffs (
    staffID INT AUTO_INCREMENT PRIMARY KEY,      -- ID nhân viên
    name VARCHAR(255) NOT NULL,                  -- Tên nhân viên
    avatar VARCHAR(255),                         -- Hình đại diện
    password VARCHAR(255) NOT NULL,              -- Mật khẩu
    status ENUM('active', 'blocked') DEFAULT 'active', -- Trạng thái làm việc
    staffAddress VARCHAR(255) NOT NULL,          -- Địa chỉ
    workingBranch VARCHAR(255) NOT NULL,         -- Chi nhánh làm việc
    staffPhone VARCHAR(15) NOT NULL,             -- Số điện thoại nhân viên
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP -- Ngày tạo tài khoản
);

-- Bảng khách hàng (customers)
CREATE TABLE customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,   -- ID khách hàng
    name VARCHAR(255) NOT NULL,                  -- Tên khách hàng
    avatar VARCHAR(255),                         -- Hình đại diện
    email VARCHAR(255) UNIQUE,                   -- Email (duy nhất)
    phoneNumber VARCHAR(15) UNIQUE,              -- Số điện thoại (duy nhất)
    password VARCHAR(255) NOT NULL,              -- Mật khẩu
    status ENUM('active', 'blocked') DEFAULT 'active', -- Trạng thái tài khoản
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo tài khoản
    CHECK (email IS NOT NULL OR phoneNumber IS NOT NULL) -- Email hoặc số điện thoại phải được cung cấp
);

-- Bảng địa chỉ (addresses)
CREATE TABLE addresses (
    addressID INT AUTO_INCREMENT PRIMARY KEY,    -- ID địa chỉ
    address TEXT NOT NULL,                       -- Địa chỉ
    recipientPhone VARCHAR(15) NOT NULL,         -- Số điện thoại người nhận
    recipientName VARCHAR(255) NOT NULL,         -- Tên người nhận
    `default` ENUM('default', 'non-default') DEFAULT 'non-default', -- Địa chỉ mặc định hay không
    customerID INT,                              -- Khóa ngoại tới bảng customers
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE
);

-- Bảng vouchers (voucher)
CREATE TABLE vouchers (
    voucherID INT AUTO_INCREMENT PRIMARY KEY,    -- ID voucher
    code VARCHAR(50) NOT NULL,                   -- Mã voucher
    discount DECIMAL(10, 2) NOT NULL,            -- Phần trăm hoặc số tiền giảm giá
    type ENUM('order', 'table') NOT NULL,        -- Loại voucher: đặt hàng ('order') hoặc đặt bàn ('table')
    startDate DATE,                              -- Ngày bắt đầu
    endDate DATE,                                -- Ngày hết hạn
    content TEXT NOT NULL,                       -- Nội dung
    image TEXT NOT NULL,                         -- Hình ảnh
    status ENUM('active', 'expired') DEFAULT 'active', -- Trạng thái (còn hiệu lực hay hết hạn)
    usageLimit INT DEFAULT 1,                    -- Giới hạn số lần sử dụng
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Ngày tạo voucher
);

-- Bảng sử dụng voucher của khách hàng (customerUseVouchers)
CREATE TABLE customerUseVouchers(
    customerID INT NOT NULL,                 -- ID khách hàng
    voucherID INT NOT NULL,                  -- ID voucher
    usedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm sử dụng
    FOREIGN KEY (customerID) REFERENCES customers(customerID),
    FOREIGN KEY (voucherID) REFERENCES vouchers(voucherID)
);

-- Bảng phương thức thanh toán (paymentMethods)
CREATE TABLE paymentMethods (
    paymentMethodID INT AUTO_INCREMENT PRIMARY KEY,   -- ID phương thức thanh toán
    methodName VARCHAR(255) NOT NULL                  -- Tên phương thức thanh toán
);

-- Bảng chi nhánh (branches)
CREATE TABLE branches (
    branchID INT AUTO_INCREMENT PRIMARY KEY,      -- ID chi nhánh
    branchName VARCHAR(255) NOT NULL,             -- Tên chi nhánh
    address VARCHAR(255),                         -- Địa chỉ chi nhánh
    branchPhone VARCHAR(15) UNIQUE                -- Số điện thoại chi nhánh (duy nhất)
);

-- Bảng menu (menus)
CREATE TABLE menus (
    menuID INT AUTO_INCREMENT PRIMARY KEY,               -- ID menu
    menuName VARCHAR(255) NOT NULL,                      -- Tên menu
    menuImage VARCHAR(255) NOT NULL,                     -- Hình ảnh menu
    `status` ENUM('display', 'hidden') DEFAULT 'display' -- Trạng thái hiển thị
);

-- Bảng món ăn (menuItems)
CREATE TABLE menuItems (
    menuItemID INT AUTO_INCREMENT PRIMARY KEY,           -- ID món ăn
    itemName VARCHAR(255) NOT NULL,                      -- Tên món ăn
    itemImage VARCHAR(255) NOT NULL,                     -- Ảnh món ăn
    description TEXT NOT NULL,                           -- Mô tả món ăn
    price DECIMAL(10, 2) NOT NULL,                       -- Giá món ăn
    discount DECIMAL(10, 2),                             -- Giá giảm (nếu có)
    size VARCHAR(255),                                   -- Kích thước món ăn
    statusToday ENUM('in-stock', 'out-of-stock') DEFAULT 'in-stock', -- Trạng thái còn hết hàng
    status ENUM('display', 'hidden') DEFAULT 'display',  -- Trạng thái hiển thị
    menuID INT,                                          -- Khóa ngoại tới bảng menus
    FOREIGN KEY (menuID) REFERENCES menus(menuID) ON DELETE CASCADE
);

-- Bảng món ăn yêu thích (favoriteFoods)
CREATE TABLE favoriteFoods (
    favoriteFoodID INT AUTO_INCREMENT PRIMARY KEY,        -- ID món ăn yêu thích
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        -- Thời gian thêm món ăn vào danh sách
    customerID INT NOT NULL,                              -- ID khách hàng
    menuItemID INT NOT NULL,                              -- ID món ăn
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE,
    FOREIGN KEY (menuItemID) REFERENCES menuItems(menuItemID) ON DELETE CASCADE
);

-- Bảng bàn (tables)
CREATE TABLE tables (
    tableID INT AUTO_INCREMENT PRIMARY KEY,               -- ID bàn
    tableName VARCHAR(15) NOT NULL,                       -- Tên bàn
    tableStatus ENUM('open', 'close', 'wait') DEFAULT 'open',  -- Trạng thái bàn
    branchID INT,                                         -- Khóa ngoại tới bảng branches
    FOREIGN KEY (branchID) REFERENCES branches(branchID)
);

-- Bảng đặt bàn (tableOrders)
CREATE TABLE tableOrders (
    tableOrderID INT AUTO_INCREMENT PRIMARY KEY,          -- ID đơn đặt bàn
    createdAt DATETIME NOT NULL,                          -- Thời gian tạo đơn đặt chỗ
    arrivalTime DATETIME NOT NULL,                        -- Thời gian đến
    numberOfPeople INT NOT NULL,                          -- Số lượng người
    notes TEXT,                                           -- Yêu cầu đặc biệt
    bookerName VARCHAR(255) NOT NULL,                     -- Tên người đặt
    bookerPhoneNumber VARCHAR(15) NOT NULL,               -- Số điện thoại người đặt
    tableOrderStatus ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending', -- Trạng thái đặt chỗ
    deposit DECIMAL(10, 2),                               -- Số tiền đặt cọc
    transactionCode TEXT,                                 -- Mã giao dịch
    customerID INT,                                       -- Khóa ngoại tới khách hàng
    tableID INT,                                          -- Khóa ngoại tới bàn
    paymentMethodID INT,                                  -- Khóa ngoại tới bảng phương thức thanh toán
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE,
    FOREIGN KEY (tableID) REFERENCES tables(tableID) ON DELETE CASCADE,
    FOREIGN KEY (paymentMethodID) REFERENCES paymentMethods(paymentMethodID) ON DELETE SET NULL
);

-- Bảng đặt bàn (tableOrders)
CREATE TABLE selectedDishs (
    tableOrderID INT,                                     -- Khóa ngoại tới đặt bàn
    menuItemID INT,                                   -- Khóa ngoại tới bảng menuItems
    FOREIGN KEY (menuItemID) REFERENCES menuItems(menuItemID) ON DELETE CASCADE,
    FOREIGN KEY (tableOrderID) REFERENCES tableOrders(tableOrderID) ON DELETE CASCADE
);

-- Bảng hóa đơn đặt bàn (tableBills)
CREATE TABLE tableBills (
    tableBillID INT AUTO_INCREMENT PRIMARY KEY,           -- ID hóa đơn
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        -- Ngày tạo hóa đơn
    updatedAt DATETIME NOT NULL,                          -- Ngày cập nhật hóa đơn
    totalAmount DECIMAL(10, 2) NOT NULL,                  -- Tổng giá trị hóa đơn
    totalAfterVoucher DECIMAL(10, 2) NOT NULL,            -- Tổng giá trị sau khi áp dụng voucher
    transactionCode TEXT,                                 -- Mã giao dịch
    paymentMethodID INT,                                  -- Khóa ngoại tới phương thức thanh toán
    tableOrderID INT,                                     -- Khóa ngoại tới đặt bàn
    voucherID INT,                                        -- Khóa ngoại tới bảng vouchers
    FOREIGN KEY (voucherID) REFERENCES vouchers(voucherID) ON DELETE CASCADE,
    FOREIGN KEY (tableOrderID) REFERENCES tableOrders(tableOrderID) ON DELETE CASCADE,
    FOREIGN KEY (paymentMethodID) REFERENCES paymentMethods(paymentMethodID) ON DELETE SET NULL
);

-- Bảng chi tiết hóa đơn (tableBillDetails)
CREATE TABLE tableBillDetails (
    tableBillDetailID INT AUTO_INCREMENT PRIMARY KEY,      -- ID chi tiết hóa đơn
    quantity INT NOT NULL,                                 -- Số lượng món ăn
    price DECIMAL(10, 2) NOT NULL,                         -- Giá món ăn
    total DECIMAL(10, 2) NOT NULL,                         -- Tổng giá trị cho món đó
    tableBillID INT NOT NULL,                              -- ID hóa đơn
    menuItemID INT NOT NULL,                               -- ID món ăn
    FOREIGN KEY (tableBillID) REFERENCES tableBills(tableBillID) ON DELETE CASCADE,
    FOREIGN KEY (menuItemID) REFERENCES menuItems(menuItemID) ON DELETE CASCADE
);

-- Bảng giỏ hàng (carts)
CREATE TABLE carts (
    cartItemID INT AUTO_INCREMENT PRIMARY KEY,        -- ID chi tiết giỏ hàng
    quantity INT NOT NULL,                            -- Số lượng món ăn
    notes  TEXT,                                        -- Ghi chú món ăn
    menuItemID INT,                                   -- Khóa ngoại tới bảng menuItems
    customerID INT,                                  -- Khóa ngoại tới bảng customers
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE,
    FOREIGN KEY (menuItemID) REFERENCES menuItems(menuItemID) ON DELETE CASCADE
);

-- Bảng đơn hàng (orders)
CREATE TABLE orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,          -- ID đơn hàng
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Ngày đặt hàng
    status VARCHAR(50) NOT NULL,                     -- Trạng thái đơn hàng
    totalAmount DECIMAL(10, 2) NOT NULL,            -- Tổng giá trị đơn hàng
    transactionCode TEXT,                            -- Mã giao dịch
    paymentMethodID INT,                             -- Khóa ngoại tới bảng paymentMethod
    customerID INT,                                  -- Khóa ngoại tới bảng customers
    addressID INT,                                   -- Khóa ngoại tới bảng addresses
    voucherID INT,                               -- Khóa ngoại tới bảng vouchers
    FOREIGN KEY (voucherID) REFERENCES vouchers(voucherID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE,
    FOREIGN KEY (addressID) REFERENCES addresses(addressID) ON DELETE SET NULL,
    FOREIGN KEY (paymentMethodID) REFERENCES paymentMethods(paymentMethodID) ON DELETE SET NULL
);

-- Bảng chi tiết đơn hàng (orderDetails)
CREATE TABLE orderDetails (
    orderDetailID INT AUTO_INCREMENT PRIMARY KEY,     -- ID chi tiết đơn hàng
    quantity INT NOT NULL,                           -- Số lượng món ăn
    price DECIMAL(10, 2) NOT NULL,                   -- Giá món ăn
    discount DECIMAL(10, 2),                         -- Giảm giá (nếu có)
    total DECIMAL(10, 2) NOT NULL,                   -- Tổng giá sau khi tính
    orderID INT,                                     -- Khóa ngoại tới bảng orders
    menuItemID INT,                                  -- Khóa ngoại tới bảng menuItems
    FOREIGN KEY (orderID) REFERENCES orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (menuItemID) REFERENCES menuItems(menuItemID) ON DELETE CASCADE
);

 
-- Bảng đánh giá dịch vụ (serviceReviews)
CREATE TABLE serviceReviews (
    serviceReviewID INT AUTO_INCREMENT PRIMARY KEY,                -- ID đánh giá
    rating INT CHECK (rating >= 1 AND rating <= 5),        -- Đánh giá từ 1 đến 5
    comment TEXT,                                          -- Nhận xét
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Ngày tạo đánh giá
    reviewType ENUM('order', 'table') NOT NULL,           -- Loại đánh giá: 'order' hoặc 'table'
    orderID INT DEFAULT NULL,                               -- Khóa ngoại tới bảng đơn hàng
    tableOrderID INT DEFAULT NULL,                          -- Khóa ngoại tới bảng đơn bàn
    customerID INT NOT NULL,                                -- Khóa ngoại tới bảng khách hàng
    FOREIGN KEY (customerID) REFERENCES customers(customerID) ON DELETE CASCADE,
    FOREIGN KEY (orderID) REFERENCES orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (tableOrderID) REFERENCES tableOrders(tableOrderID) ON DELETE CASCADE
);


-- Thêm dữ liệu mẫu vào bảng customers
-- Chèn thêm khách hàng

-- Chèn dữ liệu cho hai chi nhánh
INSERT INTO branches (branchName, address, branchPhone) 
VALUES 
('Savory I', '13 Đường Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM', '1234000000'),
('Savory II', '45/2 Đường Lê Văn Sỹ, Phường 13, Quận Phú Nhuận, TP.HCM', '1234000001');



-- Thêm bàn từ CN1-1 đến CN1-20
INSERT INTO tables (tableName, tableStatus, branchID)
VALUES 
    ('CN1-1', 'open', 1),
    ('CN1-2', 'open', 1),
    ('CN1-3', 'open', 1),
    ('CN1-4', 'open', 1),
    ('CN1-5', 'open', 1),
    ('CN1-6', 'open', 1),
    ('CN1-7', 'open', 1),
    ('CN1-8', 'open', 1),
    ('CN1-9', 'open', 1),
    ('CN1-10', 'open', 1),
    ('CN1-11', 'open', 1),
    ('CN1-12', 'open', 1),
    ('CN1-13', 'open', 1),
    ('CN1-14', 'open', 1),
    ('CN1-15', 'open', 1),
    ('CN1-16', 'open', 1),
    ('CN1-17', 'open', 1),
    ('CN1-18', 'open', 1),
    ('CN1-19', 'open', 1),
    ('CN1-20', 'open', 1);

-- Thêm bàn từ CN2-1 đến CN2-30
INSERT INTO tables (tableName, tableStatus, branchID)
VALUES 
    ('CN2-1', 'open', 2),
    ('CN2-2', 'open', 2),
    ('CN2-3', 'open', 2),
    ('CN2-4', 'open', 2),
    ('CN2-5', 'open', 2),
    ('CN2-6', 'open', 2),
    ('CN2-7', 'open', 2),
    ('CN2-8', 'open', 2),
    ('CN2-9', 'open', 2),
    ('CN2-10', 'open', 2),
    ('CN2-11', 'open', 2),
    ('CN2-12', 'open', 2),
    ('CN2-13', 'open', 2),
    ('CN2-14', 'open', 2),
    ('CN2-15', 'open', 2),
    ('CN2-16', 'open', 2),
    ('CN2-17', 'open', 2),
    ('CN2-18', 'open', 2),
    ('CN2-19', 'open', 2),
    ('CN2-20', 'open', 2);






INSERT INTO admin (loginName, password) VALUES 
('admin', '$2y$12$ekEMQRg3htHMw0QiB5j6Ue.0H0AN4fwGiVlQx0Qndwj52wpe7Z1R6');



-- Chèn dữ liệu vào bảng menu
INSERT INTO menus (menuName, menuImage) VALUES 
('Món Tráng Miệng', 'storage/menu-images/mon_trang_mieng.png'),
('Salad', 'storage/menu-images/salad.png'),
('Đồ Uống', 'storage/menu-images/do_uong.png'),
('Pizza', 'storage/menu-images/pizza.png'),
('Mì Ý', 'storage/menu-images/my_y.png'),
('Beefsteak', 'storage/menu-images/beefsteak.png');


INSERT INTO menuItems (itemName, itemImage, description, price, menuID) VALUES
-- Món tráng miệng
('Bánh flan', 'storage/menuItem-images/mon-trang-mieng/banh_flan.png', 'Món tráng miệng truyền thống với lớp kem trứng mềm mịn và lớp caramel ngọt ngào.', 25000, 1),
('Bánh Esterhazy', 'storage/menuItem-images/mon-trang-mieng/banh_esterhazy.png', 'Bánh ngọt nổi tiếng từ Hungary, với nhiều lớp kem bơ hạt dẻ và lớp bột mỏng giòn tan.', 40000, 1),
('Kem socola', 'storage/menuItem-images/mon-trang-mieng/kem_socola.png', 'Kem vị socola đậm đà, ngọt ngào và mát lạnh, thích hợp để tráng miệng.', 30000, 1),
('Kẹo cuộn', 'storage/menuItem-images/mon-trang-mieng/keo_cuon.png', 'Loại kẹo cuộn nhiều lớp, ngọt ngào, bắt mắt, là món ăn vặt phổ biến và thú vị.', 10000, 1),
('Rau câu jelly', 'storage/menuItem-images/mon-trang-mieng/rau_cau_jelly.png', 'Thạch rau câu với hương vị trái cây đa dạng, mát lạnh và dai giòn.', 15000, 1),

-- Salad
('Salad cá hồi', 'storage/menuItem-images/salad/salad_ca_houi.png', 'Cá Hồi | Rau mầm, rong biển, cà chua & rong biển tosaka đỏ-xanh kèm sốt mè rang.', 10.00, 2),
('Salad nhiệt đới', 'storage/menuItem-images/salad/salad_nhiet_doi.png', 'Rong nho, Rau mầm, rong biển, cà chua | Bạch tuộc Nhật, Cá Trích Ép Trứng, Cá Hồi kèm sốt mè rang.', 9.00, 2),
('Salad thanh cua', 'storage/menuItem-images/salad/salad_thanh_cua.png', 'Thanh cua, Rong biển tosaka xanh - đỏ, rau mầm, rong biển, cà chua kèm sốt mè rang.', 9.00, 2),
('Salad da giòn', 'storage/menuItem-images/salad/salad_da_gion.png', 'Da cá Hồi chiên giòn| Rong nho| Lolo xanh| Rau mầm, rong biển, cà chua & rong biển tosaka đỏ-xanh kèm sốt Salad.', 8.00, 2),
('Salad cá ngừ', 'storage/menuItem-images/salad/salad_ca_nguu.png', 'Rong nho| Rau mầm, rong biển, cà chua | Cá Ngừ chín trộn mayo | Bơ trái kèm sốt mè rang.', 12.00, 2),
('Salad rong nho', 'storage/menuItem-images/salad/salad_rong_nho.png', 'Rong nho| Rau mầm, rong biển, cà chua & rong biển tosaka đỏ-xanh kèm sốt mè rang.', 7.00, 2),
('Salad Cá Hồi & Bơ', 'storage/menuItem-images/salad/salad_ca_houi_va_bo.png', 'Cá hồi| Bơ trái| Xà lách búp mỹ| Rong nho tosaka| Rong nho kèm sốt mè rang.', 13.00, 2),
('Salad Mix', 'storage/menuItem-images/salad/salad_mix.png', 'Cá hồi| Cá trích ép trứng vàng & đỏ| Tôm thẻ| Bạch tuộc Nhật| Thanh cua| Sò đỏ Canada| Các loại rau mầm, rong biển, cà chua, xà lách kèm sốt mè rang.', 15.00, 2),

-- Đồ uống
('Coca', 'storage/menuItem-images/do-uong/coca.png', 'Nước giải khát có ga vị coca cola, được ưa chuộng trong các bữa tiệc hoặc dùng hàng ngày.', 15.00, 3),
('Brandy - 10th Mountain éT 2012 Vail.co', 'storage/menuItem-images/do-uong/brandy_10th_mountain.png', 'Rượu brandy cao cấp, với hương vị trái cây đậm đà, được sản xuất tại Colorado, thích hợp cho những dịp đặc biệt.', 2500000, 3),
('Nước Khoáng Vivant', 'storage/menuItem-images/do-uong/nuoc_khoang_vivant.png', 'Nước khoáng tự nhiên bổ sung khoáng chất, có ga nhẹ, mang lại cảm giác tươi mát.', 12.00, 3),
('Rượu Whisky Ballantine - G82 255', 'storage/menuItem-images/do-uong/ruou_whisky_ballantines.png', 'Rượu whisky Scotch với hương vị mạnh mẽ, nồng ấm, thích hợp cho những bữa tiệc sang trọng.', 1200000, 3),
('Rượu vang Passion - Reserva 750ml', 'storage/menuItem-images/do-uong/ruou_vang_passion.png', 'Rượu vang đậm đà với hương vị trái cây chín mọng, thích hợp khi dùng kèm các món thịt.', 500000, 3),

-- Pizza
('Pizza Hải Sản Nhiệt Đới', 'storage/menuItem-images/pizza/pizza_hai_san_nhiet_doi.png', 'Tôm, nghêu, mực cua, dứa với sốt Thousand Island.', 159000, 4),
('Pizza Thịt Xông Khói', 'storage/menuItem-images/pizza/pizza_thit_xong_khoi.png', 'Thịt giăm bông, thịt xông khói và hai loại rau của ớt xanh, cà chua.', 149000, 4),
('Pizza Xúc Xích Ý', 'storage/menuItem-images/pizza/pizza_xuc_xich_y.png', 'Xúc xích kiểu Ý trên nền sốt cà chua.', 139000, 4),
('Pizza Thịt Nguội & Nấm', 'storage/menuItem-images/pizza/pizza_thit_nguoi_va_nam.png', 'Pizza giăm bông và nấm đem đến cho bạn những trải nghiệm thú vị.', 139000, 4),
('Pizza Hawaiian', 'storage/menuItem-images/pizza/pizza_hawaiian.png', 'Giăm bông, thịt muối và dứa.', 139000, 4),
('Pizza Rau Củ', 'storage/menuItem-images/pizza/pizza_rau_cu.png', 'Hành, ớt chuông, nấm, dứa, cà chua.', 119000, 4),
('Pizza Hải Sản Cao Cấp', 'storage/menuItem-images/pizza/pizza_hai_san_cao_cap.png', 'Tôm, cua, mực và nghêu với sốt Marinara.', 159000, 4),
('Pizza Đặc Biệt', 'storage/menuItem-images/pizza/pizza_dac_biet.png', 'Xúc xích bò, giăm bông, thịt xông khói và cả thế giới rau phong phú.', 149000, 4),
('Pizza Gà Nướng', 'storage/menuItem-images/pizza/pizza_ga_nuong.png', 'Gà nướng, gà bơ tỏi và gà ướp sốt nấm.', 149000, 4),

-- Mì Ý
('Mì Ý Cay Hải Sản', 'storage/menuItem-images/mi-y/mi_y_cay_hai_san.png', 'Mỳ Ý rán với các loại hải sản tươi ngon cùng ớt và tỏi.', 139000, 5),
('Mì Ý chay sốt kem tươi', 'storage/menuItem-images/mi-y/mi_y_chay_sot_kem_tươi.png', 'Mỳ Ý chay thơm ngon với sốt kem và nấm.', 109000, 5),
('Mì Ý cay xúc xích', 'storage/menuItem-images/mi-y/mi_y_cay_xuc_xich.png', 'Mỳ Ý rán với xúc xích cay, thảo mộc, ngò gai và húng quế Ý.', 119000, 5),
('Mì Ý Giăm Bông', 'storage/menuItem-images/mi-y/mi_y_giam_bong.png', 'Mỳ Ý, nấm và giăm bông được nấu cùng với sốt kem trắng.', 119000, 5),
('Mì Ý Bò Bằm', 'storage/menuItem-images/mi-y/mi_y_bo_bam.png', 'Sốt thịt bò bằm đặc trưng kết hợp cùng mỳ Ý.', 139000, 5),
('Mì Ý sốt kem cà chua', 'storage/menuItem-images/mi-y/mi_y_sot_kem_ca_tom.png', 'Sự tươi ngon của tôm kết hợp với sốt kem cà chua.', 139000, 5),
('Mì Ý truyền thống', 'storage/menuItem-images/mi-y/mi_y_truyen_thong.png', 'Mỳ Ý sốt cà chua truyền thống, hòa quyện với hương vị bơ.', 119000, 5),

-- Beefsteak
('Beefsteak Bò Mỹ', 'storage/menuItem-images/beefsteak/beef_wellington.png', 'Bò mỹ được chế biến đặc biệt, tẩm gia vị hoàn hảo và nướng ở nhiệt độ thích hợp.', 279000, 6),
('Beefsteak Bò Úc', 'storage/menuItem-images/beefsteak/beefsteak_bang.png', 'Bò Úc nướng trên than hồng, dậy hương thơm và đậm đà.', 289000, 6),
('Beefsteak BBQ', 'storage/menuItem-images/beefsteak/beefsteak_bbq.png', 'Bò nướng BBQ với sốt cà chua và ngò tươi.', 299000, 6),
('Beefsteak Phomai', 'storage/menuItem-images/beefsteak/beefsteak_phomai.png', 'Sự kết hợp hoàn hảo giữa bò và phô mai thơm ngon, béo ngậy.', 299000, 6),
('Beefsteak Tiêu Đen', 'storage/menuItem-images/beefsteak/beefsteak_tieu_den.png', 'Bò nướng với sốt tiêu đen, thơm phức, béo ngậy.', 279000, 6),
('Beefsteak Khoai Tây Nghiền', 'storage/menuItem-images/beefsteak/beefsteak_khoai_tay_nghien.png', 'Bò hảo hạng ăn kèm khoai tây nghiền, rất hấp dẫn.', 289000, 6);


-- Insert dữ liệu vào bảng paymentMethods
INSERT INTO paymentMethods (methodName) VALUES 
('Tiền mặt'), 
('Ví điện tử VNPAY'), 
('Ví điện tử Momo');


-- Insert dữ liệu vào bảng customers
INSERT INTO customers (createdAt, name, avatar, email, phoneNumber, password, status) VALUES 
('2024-10-13 12:30:00', 'Nguyễn Văn A', 'avatar_a.png', 'trung1@gmail.com', '0901234567', '$2y$12$ekEMQRg3htHMw0QiB5j6Ue.0H0AN4fwGiVlQx0Qndwj52wpe7Z1R6', 'active'),
('2024-10-13 12:30:00', 'Trần Thị B', 'avatar_b.png', 'trung2@gmail.com', '0907654321', '$2y$12$ekEMQRg3htHMw0QiB5j6Ue.0H0AN4fwGiVlQx0Qndwj52wpe7Z1R6', 'active'),
('2024-10-13 12:30:00', 'Lê Văn C', 'avatar_c.png', 'trung3@gmail.com', '0912345678', '$2y$12$ekEMQRg3htHMw0QiB5j6Ue.0H0AN4fwGiVlQx0Qndwj52wpe7Z1R6', 'active'),
('2024-10-13 12:30:00', 'Phạm Thị D', 'avatar_d.png', 'trung4@gmail.com', '0919876543', '$2y$12$ekEMQRg3htHMw0QiB5j6Ue.0H0AN4fwGiVlQx0Qndwj52wpe7Z1R6', 'active'),
('2024-10-13 12:30:00', 'Ngô Văn E', 'avatar_e.png', 'trung5@gmail.com', '0923456789', '$2y$12$ekEMQRg3htHMw0QiB5j6Ue.0H0AN4fwGiVlQx0Qndwj52wpe7Z1R6', 'active');


-- Insert dữ liệu vào bảng tableOrders
INSERT INTO tableOrders (createdAt, arrivalTime, numberOfPeople, notes, bookerName, bookerPhoneNumber, tableOrderStatus, deposit, transactionCode, customerID, tableID, paymentMethodID)
VALUES 
('2024-10-13 12:30:00', '2024-10-14 18:00:00', 4, 'Yêu cầu không hút thuốc', 'Nguyễn Văn A', '0912345678', 'confirmed', 500000.00, 'TX123456', 1, 1, 2),
('2024-10-12 09:15:00', '2024-10-15 20:00:00', 2, 'Góc ngồi cạnh cửa sổ', 'Trần Thị B', '0934567890', 'pending', 200000.00, 'TX654321', 2, 2, 2),
('2024-10-11 14:45:00', '2024-10-16 12:30:00', 6, 'Bàn lớn cho gia đình', 'Lê Văn C', '0909876543', 'cancelled', 0.00, '', 3, 3, 3),
('2024-10-10 10:00:00', '2024-10-18 19:00:00', 3, NULL, 'Phạm Thị D', '0911122233', 'completed', 300000.00, 'TX111222', 4, 4, 3);
