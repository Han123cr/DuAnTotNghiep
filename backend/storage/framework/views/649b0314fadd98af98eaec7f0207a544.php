<!DOCTYPE html>
<html>
<head>
    <title>Xác Nhận Đăng Ký</title>
</head>
<body>

    <h1>Nhập mã xác thực,</h1>
    <form action="<?php echo e(route('checkmaxacnhan')); ?>" method="post">
    <?php echo csrf_field(); ?>
    <input text="number" name="maxacthuc"/>
    <button type="submit">Đăng ký</button>
    </form>
</body>
</html>
<?php /**PATH /home/trungtaphack/DuAnTotNghiep/backend/resources/views/nhapmaxacthuc.blade.php ENDPATH**/ ?>