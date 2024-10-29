import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { API_Url, API_UrlImage } from "../../../tsconfig.json"

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

interface Branch {
    branchID: string;
}

interface EditStaffProps {
    adminID: string,
    branch: string,
    onEditStaff: (updateStaff: Staff, branch: string) => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditStaff: React.FC<EditStaffProps> = ({ adminID, branch, onEditStaff }) => {

    const [openAlert, setOpenAlert] = useState(false);
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birth, setBirth] = useState('');
    const [sex, setSex] = useState('');
    const [status, setStatus] = useState('');
    const [dayStart, setDayStart] = useState('');
    const [address, setAddress] = useState('');
    const [branchID, setBranchID] = useState<string>('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchAdminDetail = async () => {
            try {
                const response = await fetch(`${API_Url}/getStaffs/${branch}/${adminID}`);
                const result = await response.json();
                const staff: Staff = result.admin
                if(staff){
                    setName(staff.name);
                    setEmail(staff.email);
                    setPassword(staff.password);
                    setPhoneNumber(staff.phoneNumber.toString());
                    setBirth(staff.birth);
                    setSex(staff.sex);
                    setDayStart(staff.dayStart)
                    setStatus(staff.status);
                    setAddress(staff.address)
                    setBranchID(staff.branchID)
                    setFile(null);

                    const avatar = staff.avatar 
                    ? staff.avatar.split('/').pop() // Only split if menuImage is a valid string
                    : '';

                    setFileName(avatar || '');
                    
                    setImageSrc(`${API_UrlImage}/${staff.avatar}`)
                }

            } catch (err) {
                console.error(err);
            }
        };

        if(open){
            fetchAdminDetail();
        }
    }, [open, adminID, branch])


    //Khi upload ảnh thì sẽ hiện tên file ảnh và hiện ảnh
    const handFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            setFileName(file.name);

            const render = new FileReader();
            render.onloadend = () => {
                setImageSrc(render.result as string);
            };
            render.readAsDataURL(file);
        }
    };

    const handChangeSex = (event: SelectChangeEvent) => {
        setSex(event.target.value as string);
    };

    //Đóng mở popup sửa nhân viên
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    //Đóng mở alert
    const handleAlertClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    //Fetch cửa hàng
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await fetch(`${API_Url}/getBranch`);
                const data = await response.json();
                setBranches(data.branches);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBranches();
    }, []);

    const handleChangeBranch = (event: SelectChangeEvent<string>) => {
        setBranchID(event.target.value);
    }

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phoneNumber', phoneNumber);
        formData.append('birth', birth);
        formData.append('sex', sex);
        formData.append('dayStart', dayStart);
        formData.append('dayEnd', '');
        formData.append('status', status);
        formData.append('address', address);
        if (branchID) formData.append('branchID', branchID.toString());
        if (file) formData.append('avatar', file);

        try {
            const response = await fetch(`${API_Url}/updateStaff/${adminID}`, {
                method: 'POST',
                body: formData,
            });


            if (!response.ok) {
                throw new Error('Thất bại khi sửa nhân viên');
            }

            //Dùng callback load nhân viên không cần reload trang

            const newStaff = await response.json();

            // const newCategory = result.data;

            onEditStaff(newStaff, branchID)
            //Show thông báo sửa nhân viên thành công
            setOpenAlert(true)

        } catch (error) {
            console.error(error);
            alert('Sửa nhân viên thất bại')
        }

        //Đóng form sau khi sửa nhân viên
        handleClose();
    };

    return (
        <>
            <button
                className="btn btn-primary btn-sm edit"
                type="button"
                title="Sửa nhân viên"
                onClick={handleClickOpen}
            >
                <i className="fas fa-edit" />
            </button>



            <React.Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Sửa nhân viên
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
                        <FormControl>
                            <div style={{ display: 'flex' }}>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Tên nhân viên"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', marginTop: '15px' }}>
                                <TextField sx={{ minWidth: '210px' }} label="Email" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <TextField sx={{ minWidth: '210px', marginLeft: '10px' }} label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            <div style={{ display: 'flex', marginTop: '15px' }}>
                                <TextField sx={{ minWidth: '210px' }} label="Phone Number" variant="outlined" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                <TextField sx={{ minWidth: '210px', marginLeft: '10px' }} label="Ngày sinh" variant="outlined" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} InputLabelProps={{ shrink: true }} />
                            </div>

                            <div style={{ display: 'flex', marginTop: '15px' }}>
                                <FormControl sx={{ minWidth: '210px' }}>
                                    <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={sex}
                                        label="Trạng thái"
                                        onChange={handChangeSex}
                                    >
                                        <MenuItem value='male'>Nam</MenuItem>
                                        <MenuItem value='female'>Nữ</MenuItem>
                                        <MenuItem value='other'>Khác</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField sx={{ minWidth: '210px', marginLeft: '10px' }} label="Ngày bắt đầu" variant="outlined" type="date" value={dayStart} onChange={(e) => setDayStart(e.target.value)} InputLabelProps={{ shrink: true }} />

                            </div>
                            <TextField sx={{ marginTop: '10px' }} label="Địa chỉ nhân viên" variant="outlined" value={address} onChange={(e) => setAddress(e.target.value)} />

                            <div style={{ display: 'flex', marginTop: '15px' }}>
                                <FormControl sx={{minWidth: '210px'}}>
                                    <InputLabel id="demo-simple-select-label">Chi Nhánh</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={branchID}
                                        label="Chi nhánh"
                                        onChange={handleChangeBranch}
                                    >
                                        {branches.map(branch => (
                                            <MenuItem key={branch.branchID} value={branch.branchID}>{branch.branchID === 'svr1' ? 'Savory I' : 'Savory II'}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{minWidth: '210px', marginLeft: '10px'}}>
                                    <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={status}
                                        label="Trạng thái"
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <MenuItem value='active'>Hoạt Động</MenuItem>
                                        <MenuItem value='blocked'>Khóa</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '10px' }}>
                                <Button
                                    sx={{ margin: '10px 10px 0 0' }}
                                    variant="contained"
                                    component="label"
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handFileChange}
                                    />
                                </Button>
                                <TextField sx={{ width: "300px" }}
                                    disabled
                                    id="outlined-disabled"
                                    label=""
                                    value={fileName}
                                />
                            </div>
                            {imageSrc && (
                                <div style={{ marginTop: '10px' }}>
                                    <img src={imageSrc} alt="" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                                </div>
                            )}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button variant='outlined' onClick={handleSubmit}>
                            Sửa nhân viên
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Sửa nhân viên thành công !
                </Alert>
            </Snackbar>
        </>
    )
};

export default EditStaff;
