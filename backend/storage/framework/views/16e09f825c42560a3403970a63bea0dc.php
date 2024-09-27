<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
</head>
<body>
    <h1>Đăng ký</h1>
    <form action="<?php echo e(route('xacthucdangky')); ?>" method="POST">
    <?php echo csrf_field(); ?>
    <div>
        <label for="name">Tên:</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div>
    <label for="email_or_phone">Email hoặc Số Điện Thoại:</label>
    <input type="text" id="email_or_phone" name="email_or_phone" required>
</div>
    <div>
        <label for="password">Mật khẩu:</label>
        <input type="password" id="password" name="password" required>
    </div>
    <div>
        <label for="password_confirmation">Xác nhận mật khẩu:</label>
        <input type="password" id="password_confirmation" name="password_confirmation" required>
    </div>
    <button type="submit">Đăng ký</button>
</form>

</body>
</html>
<?php /**PATH /home/trungtaphack/DuAnTotNghiep/backend/resources/views/dangky.blade.php ENDPATH**/ ?>