import { API_Url, API_UrlImage } from "../../../tsconfig.json"
import React, { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Swal from "sweetalert2";
import { Chip } from "@mui/material";

interface Category {
    menuID: number,
    menuName: string,
    menuImage: string | null,
    status: string,
}

const CategoryTable: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_Url}/getMenus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();
            //Sắp xếp sản phẩm mới thêm sẽ nằm ở đầu bảng
            const sortedData = data.sort((a: Category, b: Category) => b.menuID - a.menuID);
            console.log(data);
            //Hiện sản phẩm
            setCategories(sortedData)

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // //Hàm để thêm sản phẩm mới vào danh sách
    const handleAddCategory = (newCategory: Category) => {
        setCategories((prevCategories) => [newCategory,...prevCategories]);
    };

    const handleEditCategory= (updatedCategory: Category) => {
        setCategories((prevCategories) => 
            prevCategories.map(category => 
                category.menuID === updatedCategory.menuID ? updatedCategory : category
            )
        );
    };

    const deleteCategory = async (id: number, menuName: string) => {

        const result = await Swal.fire({
            title: 'Xóa danh mục',
            text: `Bạn có chắc chắn muốn xóa danh mục '${menuName}' không ?`,
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
                const response = await fetch(`${API_Url}/deleteMenu/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                if (response.status === 204) {
                    Swal.fire(`Xóa danh mục '${menuName}' thành công!`, 'success');
                    setCategories(categories.filter(category => category.menuID !== id)); // Update UI
                } else {
                    Swal.fire(`Xóa danh mục '${menuName}' thất bại!`, 'error');
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    return (
        <>
            <AddCategory onAddCategory={handleAddCategory} />
            <div className="row element-button">
                {/* <AddProduct onAddProduct={handleAddProduct} /> */}
            </div>
            <table className="table table-hover table-bordered" id="sampleTable">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên danh mục</th>
                        <th>Ảnh</th>
                        <th>Trạng thái</th>
                        <th style={{ width: "120px" }} >Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={category.menuID}>
                            <td>
                                {index + 1}
                            </td>
                            <td>{category.menuName}</td>
                            <td>
                                <img src={`${API_UrlImage}/${category.menuImage}`} alt="" width="100px;" />
                            </td>
                            <td>
                                <Chip sx={{ width: 100 }}
                                    label={category.status === 'display' ? 'Hiện' : 'Ẩn'}
                                    color={category.status === 'display' ? 'success' : 'warning'}
                                />
                            </td>
                            <td>
                                <button style={{ marginRight: '5px' }}
                                    className="btn btn-primary btn-sm trash"
                                    type="button"
                                    title="Xóa"
                                    onClick={() => deleteCategory(category.menuID, category.menuName)}
                                >
                                    <i className="fas fa-trash-alt" />
                                </button>
                                <EditCategory categoryID={category.menuID} onEditCategory={handleEditCategory}/>
                                {/* <EditProduct productID={product.menuItemID} onEditProduct={handleEditProduct}/> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
};

export default CategoryTable;
