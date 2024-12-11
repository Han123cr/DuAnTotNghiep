import { API_UrlImage } from "../../../tsconfig.json"
import React, { useCallback } from "react";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import useApiUrl from '../useApiUrl'
import { Alert, Chip, Paper, Snackbar } from "@mui/material";
import AddStaff from "./AddStaff";
import EditStaff from "./EditStaff";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Staff {
    adminID: string,
    name: string,
    avatar: string | null,
    email: string,
    phoneNumber: number,
    birth: string
    sex: string
    password: string
    dayStart: string
    dayEnd: null
    status: string
    address: string
    branchID: string | ''
    role: string
}

const StaffTable: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [open, setOpen] = React.useState(false);
    const [admins, setAdmins] = useState<Staff[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState<Staff | null>(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

    const fetchAdmin = useCallback( async () => {
        try {
            const response = await fetch(`${APIURL}/getStaffs`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const datas = await response.json();
            const data = await datas.admins;
            //Sắp xếp sản phẩm mới thêm sẽ nằm ở đầu bảng
            console.log(data);
            //Hiện nhân viên
            setAdmins(data || [])

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    const fetchAdminDetail = async (adminID: string) => {
        try {
            const response = await fetch(`${APIURL}/getStaffs/${adminID}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();
            //Sắp xếp sản phẩm mới thêm sẽ nằm ở đầu bảng
            console.log(data);
            //Hiện sản phẩm
            setSelectedAdmin(data.admin);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, [fetchAdmin]);

    //Đóng mở popup thêm sản phẩm
    const handleClickOpen = (adminID: string) => {
        setOpen(true);
        fetchAdminDetail(adminID)
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedAdmin(null)
    };

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const handleAddStaff = (newStaff: Staff) => {
        setAdmins((prevAdmin) => [newStaff, ...prevAdmin]);
        fetchAdmin()
        setAlertMessage("Đã thêm nhân viên thành công!");
        setOpenAlert(true);
    }

    const handleEditStaff = (updateStaff: Staff) => {
        setAdmins((prevAdmin) =>
            prevAdmin.map(admin =>
                admin.adminID === updateStaff.adminID ? updateStaff : admin
            )
        );
        fetchAdmin();
        setAlertMessage("Đã sửa nhân viên thành công!");
        setOpenAlert(true);
    };

    // const handleBranchChange = (event: SelectChangeEvent) => {
    //     const branch = event.target.value;
    //     setSelectedBranch(branch);
    //     fetchAdmin();
    // };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Mã nhân viên', width: 110 },
        { field: 'name', headerName: 'Tên nhân viên', width: 160 },
        {
            field: 'avatar',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => (
                params.value ? <img src={`${API_UrlImage}/${params.value}`} alt="" width="60" /> : null
            )
        },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'phoneNumber', headerName: 'Số điện thoại', width: 120 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    color={params.value === 'active' ? 'success' : 'error'}
                    sx={{ width: 110 }}
                />
            )
        },
        { 
            field: 'role', 
            headerName: 'Chức vụ', 
            width: 100, 
            renderCell: (params) => params.value === 'staff' ? 'Nhân viên' : 'Quản lý'
        },
        { 
            field: 'branchID', 
            headerName: 'Cơ sở', 
            width: 100,
            renderCell: (params) => params.value === 'svr1' ? 'Savory I' : 'Savory II'
        },
        {
            field: 'actions',
            headerName: 'Chức năng',
            width: 120,
            renderCell: (params) => (
                <>
                    <button style={{ marginRight: 10 }}
                        className="btn btn-warning btn-sm edit"
                        type="button"
                        title="Chi tiết"
                        onClick={() => handleClickOpen(params.row.adminID)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <EditStaff 
                        adminID={params.row.adminID} 
                        branch={params.row.branchID} 
                        onEditStaff={handleEditStaff} 
                        setOpenAlert={setOpenAlert}
                        setAlertMessage={setAlertMessage} 
                    />
                </>
            )
        }
    ];

    const rows = admins.map((admin) => ({
        id: admin.adminID,
        ...admin
    }));

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <AddStaff 
                    onAddStaff={handleAddStaff} 
                    setOpenAlert={setOpenAlert}
                    setAlertMessage={setAlertMessage} 
                />
                {/* <FormControl sx={{ bottom: '2px', marginBottom: '10px', minWidth: 130 }} size="small">
                    <InputLabel id="demo-simple-select-label">Cơ sở</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedBranch}
                        label="Branch"
                        onChange={handleBranchChange}
                    >
                        <MenuItem value='svr1'>Savory I</MenuItem>
                        <MenuItem value='svr2'>Savory II</MenuItem>
                    </Select>
                </FormControl> */}
            </div>

            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20, 30, 100]}
                    sx={{ border: 0 }}
                    rowHeight={80}
                    getRowClassName={(params) => 
                        params.row.status === 'blocked' ? 'cancelled-row' : ''
                    }
                    disableRowSelectionOnClick
                />
            </Paper>

            <React.Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Chi tiết nhân viên
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ width: '100%' }} dividers>
                        {selectedAdmin ? (
                            <table className="table table-hover table-bordered" id="sampleTable">
                                <thead>
                                    <tr>
                                        <th>Giới tính</th>
                                        <th>Ngày sinh</th>
                                        <th>Địa chỉ</th>
                                        <th>Ngày bắt đầu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedAdmin.sex === 'male' ? 'Nam' : 'Nữ'}</td>
                                        <td>{selectedAdmin.birth}</td>
                                        <td>{selectedAdmin.address}</td>
                                        <td>{selectedAdmin.dayStart}</td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p>Loading...</p>
                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" onClick={handleClose}>
                            Hủy
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
                    {alertMessage} {/* Hiển thị thông điệp tương ứng */}
                </Alert>
            </Snackbar>
        </>
    )
};

export default StaffTable;
