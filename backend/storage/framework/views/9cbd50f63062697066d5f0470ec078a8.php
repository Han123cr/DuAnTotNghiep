<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Demo</title>
</head>
<body>
    <h1>Session backend1</h1>

    <?php if(session('success')): ?>
        <p style="color: green;"><?php echo e(session('success')); ?></p>
    <?php endif; ?>

    <form action="<?php echo e(route('session.store')); ?>" method="POST">
        <?php echo csrf_field(); ?>
        <label for="data">Nhập dữ liệu:</label>
        <input type="text" name="data" id="data" value="<?php echo e(old('data', $data)); ?>" required>
        <button type="submit">Lưu vào Session</button>
    </form>

    <h2>Dữ liệu trong Session:</h2>
    <p><?php echo e($data ? $data : 'Chưa có dữ liệu'); ?></p>
</body>
</html>
<?php /**PATH /home/trungtaphack/DuAnTotNghiep/backend1/resources/views/session.blade.php ENDPATH**/ ?>