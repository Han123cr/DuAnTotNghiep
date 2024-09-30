

@section('content')
<div class="container">
    <h1 class="text-center">Danh Sách Menu</h1>
    <div class="row" id="menuList">
        @foreach ($menus as $menu)
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="{{ asset($menu->menuImage) }}" class="card-img-top" alt="{{ $menu->menuName }}">
                    <div class="card-body">
                        <h5 class="card-title">{{ $menu->menuName }}</h5>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const menuList = document.querySelectorAll('#menuList .card-title');
        
        if (menuList.length > 0) {
            menuList.forEach(menu => {
                console.log(menu.textContent); // In ra tên sản phẩm trong console
            });
        } else {
            console.log("Danh sách menus không có dữ liệu.");
        }
    });
</script>
@endsection