import { API_Url, API_UrlImage } from "../../../tsconfig.json"
import React, { useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ProductVariant from "./ProductVariant";
import Swal from "sweetalert2";
import { Chip, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Product {
    menuItemID: number;
    itemName: string;
    itemImage: string | null;
    description: string;
    price: number;
    discount: number;
    size: string;
    statusToday: string;
    status: string;
    menuID: number;
}

interface Category {
    menuID: number,
    menuName: string,
}

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editedProduct, setEditedProduct] = useState<Product>();

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_Url}/getMenuItems`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();
            //Sắp xếp sản phẩm mới thêm sẽ nằm ở đầu bảng
            const sortedData = data.sort((a: Product, b: Product) => b.menuItemID - a.menuItemID);
            console.log(data);
            //Hiện sản phẩm
            setProducts(sortedData)

        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_Url}/getMenus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data: Category[] = await response.json();
            //Sắp xếp sản phẩm mới thêm sẽ nằm ở đầu bảng
            const sortedData = data.sort((a, b) => b.menuID - a.menuID);
            console.log(data);
            //Hiện sản phẩm
            setCategories(sortedData)

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories()
    }, []);

    //Hàm để thêm sản phẩm mới vào danh sách
    const handleAddProduct = (newProduct: Product) => {
        setProducts((prevProducts) => [newProduct, ...prevProducts]);
    };

    const handleEditProduct = (updatedProduct: Product) => {
        setEditedProduct(updatedProduct);
        setProducts((prevProducts) =>
            prevProducts.map(product =>
                product.menuItemID === updatedProduct.menuItemID ? updatedProduct : product
            )
        );
    };

    const deleteProduct = async (id: number, itemName: string) => {
        // const confirmDelete = window.confirm(`Bạn có muốn xóa '${itemName}' không ?`);
        // if (!confirmDelete) return;

        const result = await Swal.fire({
            title: 'Xóa sản phẩm',
            text: `Bạn có chắc chắn muốn xóa sản phẩm '${itemName}' không ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            customClass: {
                confirmButton: 'btn btn-danger mx-3',
                cancelButton: 'btn btn-secondary mx-3'
            },
            buttonsStyling: false,
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_Url}/deleteMenuItem/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                if (response.status === 204) {
                    Swal.fire(`Xóa sản phẩm '${itemName}' thành công!`, 'success');
                    setProducts(products.filter(product => product.menuItemID !== id)); // Update UI
                } else {
                    Swal.fire(`Xóa sản phẩm '${itemName}' thất bại!`, 'error');
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const MenuMap = new Map(categories.map((c) => [String(c.menuID), c.menuName]))

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 70 },
        { field: 'itemName', headerName: 'Tên sản phẩm', width: 150 },
        {
            field: 'itemImage',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => (
                params.value ? <img src={`${API_UrlImage}/${params.value}`} alt="" width="60" /> : null
            )
        },
        { 
            field: 'menuID', 
            headerName: 'Danh mục', 
            width: 100, 
            renderCell: (params) => MenuMap.get(params.value)
        },
        { field: 'description', headerName: 'Mô tả', width: 160 },
        {
            field: 'statusToday',
            headerName: 'Tình trạng',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'inStock' ? 'Còn hàng' : 'Hết hàng'}
                    color={params.value === 'inStock' ? 'success' : 'warning'}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 110,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'display' ? 'Hiện' : 'Ẩn'}
                    color={params.value === 'display' ? 'success' : 'warning'}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Chức năng',
            width: 150,
            renderCell: (params) => (
                <>
                    <button
                        className="btn btn-danger btn-sm trash"
                        style={{ marginRight: '8px' }}
                        onClick={() => deleteProduct(params.row.menuItemID, params.row.itemName)}
                    >
                        <i className="fas fa-trash-alt" />
                    </button>
                    <EditProduct
                        productID={params.row.menuItemID}
                        onEditProduct={handleEditProduct}
                    />
                    <ProductVariant
                        productID={params.row.menuItemID}
                        updatedProduct={editedProduct}
                    />
                </>

            )
        }
    ];

    const rows = products.map((product, index) => ({
        id: index + 1,
        ...product
    }));

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
            <div style={{ display: 'flex' }} className="row element-button">
                <AddProduct onAddProduct={handleAddProduct} />
                {/* <TextField
                    variant="outlined"
                    size="small" // Làm cho TextField nhỏ hơn
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ width: 200, mb: 2, left: '545px' }}
                    placeholder="Tìm kiếm..."
                /> */}
            </div>



            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20, 30, 100]}
                    sx={{ border: 0 }}
                    rowHeight={80}
                />
            </Paper>
        </>
    )
};

export default ProductTable;
