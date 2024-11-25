import { API_Url, API_UrlImage } from "../../../tsconfig.json"
import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
import { Alert, Chip, Paper, Snackbar, SnackbarCloseReason } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Customer {
    customerID: number,
    name: string,
    avatar: string | null,
    email: string,
    phoneNumber: number,
    status: string
    googleId: string
    facebookId: string
    createdAt: string
    updatedAt: string
}

const UserTable: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [openAlert, setOpenAlert] = useState(false)

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_Url}/getCustomers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const datas = await response.json();
            const data = await datas.customers;
            //Sắp xếp sản phẩm mới thêm sẽ nằm ở đầu bảng
            const sortedData = data.sort((a: Customer, b: Customer) => b.customerID - a.customerID);
            console.log(data);
            //Hiện sản phẩm
            setCustomers(sortedData)

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    //Đóng mở Alert
    const handleAlertClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const toggleStatus = async (customer: Customer) => {
        const newStatus = customer.status === 'active' ? 'blocked' : 'active';
        try {
            const response = await fetch(`${API_Url}/updateCustomer/${customer.customerID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setCustomers(customers.map(cust => cust.customerID === customer.customerID
                    ? { ...cust, status: newStatus }
                    : cust
                ));

                setOpenAlert(true);
            } else {
                alert('thất bại');
            }
        } catch (err) {
            console.error(err);

        }
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 120 },
        { field: 'name', headerName: 'Tên khách hàng', width: 180 },
        {
            field: 'avatar',
            headerName: 'Ảnh',
            width: 110,
            renderCell: (params) => (
                params.value ? <img src={`${API_UrlImage}/${params.value}`} alt="" width="60" /> : null
            )
        },
        { field: 'email', headerName: 'Email', width: 160 },
        { field: 'phoneNumber', headerName: 'Số điện thoại', width: 110 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 160,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'active' ? 'Hoạt động' : 'Bị Khóa'}
                    color={params.value === 'active' ? 'success' : 'warning'}
                    sx={{ width: 110 }}
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
                        className={params.row.status === 'active' ? 'btn btn-primary btn-sm trash' : 'btn btn-danger btn-sm trash'}
                        type="button"
                        title={params.row.status === 'active' ? 'Mở Khóa' : 'Đóng Khóa'}
                        onClick={() => toggleStatus(params.row)}
                    >
                        {params.row.status === 'active' ? <LockOpenIcon /> : <LockIcon />}
                    </button>
                </>
            )
        }
    ];

    const rows = customers.map((customer, index) => ({
        id: index + 1,
        ...customer
    }));

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
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
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Đổi trạng thái thành công !
                </Alert>
            </Snackbar>
        </>
    )
};

export default UserTable;
