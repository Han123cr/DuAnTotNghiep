import { API_UrlImage } from "../../../tsconfig.json"
import React, { useCallback, useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ProductVariant from "./ProductVariant";
import Swal from "sweetalert2";
import { Alert, Chip, Paper, Snackbar } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useApiUrl from '../useApiUrl'

interface Product {
    menuItemID: number;
    itemName: string;
    itemImage: string | null;
    description: string;
    price: number;
    discount: number;
    size: string;
    status: string;
    menuID: number;
}

const ProductTable: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [products, setProducts] = useState<Product[]>([]);
    const [editedProduct, setEditedProduct] = useState<Product>();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

    const fetchProducts = useCallback( async () => {
        try {
            const response = await fetch(`${APIURL}/getMenuItems`, {
                method: 'GET',
                credentials: 'include',
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
    }, [APIURL]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, APIURL]);

    //Hàm để thêm sản phẩm mới vào danh sách
    const handleAddProduct = (newProduct: Product) => {
        setProducts((prevProducts) => [newProduct, ...prevProducts]);
        fetchProducts()
        setAlertMessage("Đã thêm sản phẩm thành công!");
        setOpenAlert(true);
    };

    const handleEditProduct = (updatedProduct: Product) => {
        setEditedProduct(updatedProduct);
        fetchProducts()
        setProducts((prevProducts) =>
            prevProducts.map(product =>
                product.menuItemID === updatedProduct.menuItemID ? updatedProduct : product
            )
        );
        setAlertMessage("Đã sửa sản phẩm thành công!");
        setOpenAlert(true)
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
                const response = await fetch(`${APIURL}/deleteMenuItem/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
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

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 70 },
        { field: 'itemName', headerName: 'Tên sản phẩm', width: 200 },
        {
            field: 'itemImage',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => (
                params.value ? <img src={`${API_UrlImage}/${params.value}`} alt="" width="60" /> : null
            )
        },
        { 
            field: 'menuName', 
            headerName: 'Danh mục', 
            width: 100, 
        },
        { field: 'description', headerName: 'Mô tả', width: 230 },
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
                        setOpenAlert={setOpenAlert}
                        setAlertMessage={setAlertMessage} 
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

    const paginationModel = { page: 0, pageSize: 6 };

    return (
        <>
            <div style={{ display: 'flex' }} className="row element-button">
                <AddProduct 
                    onAddProduct={handleAddProduct} 
                    setOpenAlert={setOpenAlert}
                    setAlertMessage={setAlertMessage} 
                />
                {/* <TextField
                    variant="outlined"
                    size="small" // Làm cho TextField nhỏ hơn
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ width: 200, mb: 2, left: '545px' }}
                    placeholder="Tìm kiếm..."
                /> */}
            </div>



            <Paper sx={{ height: 590, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[6, 20, 50, 80, 100]}
                    sx={{ border: 0 }}
                    rowHeight={80}
                />
            </Paper>

            <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
                    {alertMessage} {/* Hiển thị thông điệp tương ứng */}
                </Alert>
            </Snackbar>
        </>
    )
};

export default ProductTable;
