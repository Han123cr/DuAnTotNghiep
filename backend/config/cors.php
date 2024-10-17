<?php


return [
    'paths' => ['*'], // Đường dẫn mà bạn muốn áp dụng CORS
    'allowed_methods' => ['*'], // Các phương thức HTTP được phép (GET, POST, PUT,...)
    'allowed_origins' => ['*'], // Chỉ cho phép từ localhost:5173
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Các headers được phép
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Nếu cần cookie thì đặt thành true
];
