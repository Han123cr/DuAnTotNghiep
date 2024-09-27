<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Nhập</title>
</head>
<body>
    <h1>Đăng Nhập</h1>
    <?php if($errors->any()): ?>
        <div>
            <ul>
                <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <li><?php echo e($error); ?></li>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="<?php echo e(route('dangnhap')); ?>" method="POST">
        <?php echo csrf_field(); ?>
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
<?php /**PATH /home/trungtaphack/DuAnTotNghiep/backend/resources/views/dangnhap.blade.php ENDPATH**/ ?>