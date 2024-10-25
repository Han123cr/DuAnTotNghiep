import { API_Url, API_UrlImage } from "../../../tsconfig.json"
import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
import { Alert, Chip, Snackbar, SnackbarCloseReason } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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
            const response = await fetch(`${API_Url}/getAllCustomers`, {
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
        event?: React.SyntheticEvent | Event,
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

    return (
        <>
            <div className="row element-button">
                {/* <AddProduct onAddProduct={handleAddProduct} /> */}
            </div>
            <table className="table table-hover table-bordered" id="sampleTable">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên khách hàng</th>
                        <th>Ảnh</th>
                        <th>Email</th>
                        <th>SDT</th>
                        <th>Trạng thái</th>
                        <th style={{ width: "120px" }} >Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index) => (
                        <tr key={customer.customerID}>
                            <td>
                                {index + 1}
                            </td>
                            <td>{customer.name}</td>
                            <td>
                                <img src={`${API_UrlImage}/${customer.avatar}`} alt="" width="100px;" />
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.phoneNumber}</td>
                            <td>
                                <Chip sx={{ width: 100 }}
                                    label={customer.status === 'active' ? 'Active' : 'Blocked'}
                                    color={customer.status === 'active' ? 'success' : 'warning'}
                                />
                            </td>
                            <td>
                                <button style={{ marginRight: '5px' }}
                                    className={customer.status === 'active' ? 'btn btn-primary btn-sm trash' : 'btn btn-danger btn-sm trash'}
                                    type="button"
                                    title={customer.status === 'active' ? 'Mở Khóa' : 'Đóng Khóa'}
                                    onClick={() => toggleStatus(customer)}
                                >
                                    {customer.status === 'active' ? <LockOpenIcon /> : <LockIcon />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Đổi trạng thái thành công !
                </Alert>
            </Snackbar>
        </>
    )
};

export default UserTable;
