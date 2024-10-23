import { API_Url, API_UrlImage } from "../../../tsconfig.json"
import React, { useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import Swal from "sweetalert2";
import { Chip } from "@mui/material";

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

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

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

        useEffect(() => {
            fetchProducts();
        }, []);

    //Hàm để thêm sản phẩm mới vào danh sách
    const handleAddProduct = (newProduct: Product) => {
        setProducts((prevProducts) => [newProduct,...prevProducts]);
    };

    const handleEditProduct = (updatedProduct: Product) => {
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

        if(result.isConfirmed){
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

    return (
        <>
        <div className="row element-button">
            <AddProduct onAddProduct={handleAddProduct} />
        </div>
        <table className="table table-hover table-bordered" id="sampleTable">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Ảnh</th>
                    <th>Giá tiền</th>
                    <th>Danh mục</th>
                    <th>Mô tả</th>
                    <th style={{ width: "120px" }}>Tình trạng</th>
                    <th style={{ width: "120px" }}>Trạng thái</th>
                    <th style={{ width: "120px" }} >Chức năng</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={product.menuItemID}>
                        <td>
                            {index + 1}
                        </td>
                        <td>{product.itemName}</td>
                        <td>
                            <img src={`${API_UrlImage}/${product.itemImage}`} alt="" width="100px;" />
                        </td>
                        <td>{product.price}</td>
                        <td>{product.menuID}</td>
                        <td>{product.description}</td>
                        <td>
                            <Chip 
                                label={product.statusToday === 'inStock' ? 'Còn hàng' : 'Hết hàng'}
                                color={product.statusToday === 'inStock' ? 'success' : 'warning'}
                            />
                        </td>
                        <td>
                            <Chip 
                                label={product.status === 'display' ? 'Hiện' : 'Ẩn'}
                                color={product.status === 'display' ? 'success' : 'warning'}
                            />
                        </td>
                        <td>
                            <button style={{ marginRight: '5px' }}
                                className="btn btn-primary btn-sm trash"
                                type="button"
                                title="Xóa"
                                onClick={() => deleteProduct(product.menuItemID, product.itemName)}
                            >
                                <i className="fas fa-trash-alt" />
                            </button>
                            <EditProduct productID={product.menuItemID} onEditProduct={handleEditProduct}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    )
};

export default ProductTable;
