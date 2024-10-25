import { API_Url, API_UrlImage } from "../../../tsconfig.json"
import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
import { Alert, Chip, Snackbar, SnackbarCloseReason } from "@mui/material";
// import LockIcon from '@mui/icons-material/Lock';
// import LockOpenIcon from '@mui/icons-material/LockOpen';
interface Staff {
    adminID: string,
    name: string,
    avatar: string | null,
    email: string,
    phoneNumber: number,
    birth: string
    sex: string
    position: string
    dayStart: string
    dayEnd: string
    status: string
    role: string
    address: string
    branchID: string
}

const AdminTable: React.FC = () => {
    const [admins, setAdmins] = useState<Staff[]>([]);
    const [openAlert, setOpenAlert] = useState(false)

    const fetchAdmin = async () => {
        try {
            const response = await fetch(`${API_Url}/getAllStaffs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const datas = await response.json();
            const data = await datas.admins;
            //Sắp xếp sản phẩm mới thêm sẽ nằm ở đầu bảng
            console.log(data);
            //Hiện sản phẩm
            setAdmins(data)

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAdmin();
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

    return (
        <>
            <div className="row element-button">
                {/* <AddProduct onAddProduct={handleAddProduct} /> */}
            </div>
            <table className="table table-hover table-bordered" id="sampleTable">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên nhân viên</th>
                        <th>Ảnh</th>
                        <th>Email & SDT</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Trạng thái</th>
                        <th>Chức vụ</th>
                        <th>Địa chỉ</th>
                        <th>Cơ sở</th>
                        <th style={{ width: "120px" }} >Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin, index) => (
                        <tr key={admin.adminID}>
                            <td>
                                {index + 1}
                            </td>
                            <td>{admin.name}</td>
                            <td>
                                <img src={`${API_UrlImage}/${admin.avatar}`} alt="" width="100px;" />
                            </td>
                            <td>
                                {admin.email} <br />
                                {admin.phoneNumber}
                            </td>
                            <td>{admin.birth}</td>
                            <td>{admin.sex}</td>
                            <td>
                                <Chip sx={{ width: 100 }}
                                    label={admin.status === 'active' ? 'Active' : 'Blocked'}
                                    color={admin.status === 'active' ? 'success' : 'warning'}
                                />
                            </td>
                            <td>{admin.role}</td>
                            <td>{admin.address}</td>
                            <td>{admin.branchID}</td>
                            <td>
                                {/* <button style={{ marginRight: '5px' }}
                                    className={customer.status === 'active' ? 'btn btn-primary btn-sm trash' : 'btn btn-danger btn-sm trash'}
                                    type="button"
                                    title={customer.status === 'active' ? 'Mở Khóa' : 'Đóng Khóa'}
                                    onClick={() => toggleStatus(customer)}
                                >
                                    {customer.status === 'active' ? <LockOpenIcon /> : <LockIcon />}
                                </button> */}
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

export default AdminTable;
