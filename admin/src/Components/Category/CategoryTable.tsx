import { API_Url, API_UrlImage } from "../../../tsconfig.json"
import React, { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Swal from "sweetalert2";
import { Alert, Chip, Paper, Snackbar } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Category {
    menuID: number,
    menuName: string,
    menuImage: string | null,
    status: string,
}

const CategoryTable: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

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
        fetchCategories();
    }, []);

    //Hàm để thêm sản phẩm mới vào danh sách
    const handleAddCategory = (newCategory: Category) => {
        setCategories((prevCategories) => [newCategory, ...prevCategories]);
        setAlertMessage("Đã thêm danh mục thành công!");
        setOpenAlert(true);
    };

    const handleEditCategory = (updatedCategory: Category) => {
        setCategories((prevCategories) =>
            prevCategories.map(category =>
                category.menuID === updatedCategory.menuID ? updatedCategory : category
            )
        );
        setAlertMessage("Đã sửa danh mục thành công!");
        setOpenAlert(true)
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

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 120 },
        { field: 'menuName', headerName: 'Tên danh mục', width: 365 },
        {
            field: 'menuImage',
            headerName: 'Ảnh',
            width: 180,
            renderCell: (params) => (
                params.value ? <img src={`${API_UrlImage}/${params.value}`} alt="" width="60" /> : null
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 180,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'display' ? 'Hiện' : 'Ẩn'}
                    color={params.value === 'display' ? 'success' : 'warning'}
                    sx={{ width: 80 }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Chức năng',
            width: 120,
            renderCell: (params) => (
                <>
                    <button style={{ marginRight: '5px' }}
                        className="btn btn-danger btn-sm trash"
                        type="button"
                        title="Xóa"
                        onClick={() => deleteCategory(params.row.menuID, params.row.menuName)}
                    >
                        <i className="fas fa-trash-alt" />
                    </button>
                    <EditCategory 
                        categoryID={params.row.menuID} 
                        onEditCategory={handleEditCategory} 
                        setOpenAlert={setOpenAlert}
                        setAlertMessage={setAlertMessage}    
                    />
                </>
            )
        }
    ];

    const rows = categories.map((category, index) => ({
        id: index + 1,
        ...category
    }));

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <AddCategory 
                    onAddCategory={handleAddCategory}
                    setOpenAlert={setOpenAlert}
                    setAlertMessage={setAlertMessage} 
                />
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

            <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
                    {alertMessage} {/* Hiển thị thông điệp tương ứng */}
                </Alert>
            </Snackbar>
        </>
    )
};

export default CategoryTable;
