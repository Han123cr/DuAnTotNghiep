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
import { API_Url } from "../../../tsconfig.json"

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

interface AddStaffProps {
    onAddStaff: (newStaff: Staff, branch: string) => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddStaff: React.FC<AddStaffProps> = ({ onAddStaff }) => {

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
    const [dayStart, setDayStart] = useState('');
    const [address, setAddress] = useState('');
    const [branchID, setBranchID] = useState<string>('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [file, setFile] = useState<File | null>(null);


    const resetForm = () => {
        setFileName('');
        setImageSrc('');
        setName('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setBirth('');
        setSex('other');
        setDayStart('');
        setAddress('');
        setBranchID('');
        setFile(null);
    };

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

    //Đóng mở popup thêm danh mục
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    //Đóng mở alert
    const handleAlertClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    //Fetch chi nhánh
    useEffect(() => {
        const fetchBranches = async () => {
            try{
                const response = await fetch(`${API_Url}/getBranch`);
                const data = await response.json();
                setBranches(data.branches);
            }catch(err){
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
        formData.append('status', 'active');
        formData.append('address', address);
        if (branchID) formData.append('branchID', branchID.toString());
        if (file) formData.append('avatar', file);

        try {
            const response = await fetch(`${API_Url}/createStaff`, {
                method: 'POST',
                body: formData,
            });


            if (!response.ok) {
                throw new Error('Thất bại khi thêm nhân viên');
            }


            const newStaff = await response.json();

            // const newCategory = result.data;

            onAddStaff(newStaff, branchID)
            resetForm();
            //Show thông báo thêm danh mục thành công
            setOpenAlert(true)

        } catch (error) {
            console.error(error);
            alert('Thêm nhân viên thất bại')
        }

        //Đóng form sau khi thêm danh mục
        handleClose();
    };

    return (
        <>
            <div className="col-sm-3">
                <Button variant="contained" disableElevation sx={{ marginBottom: '10px' }} onClick={handleClickOpen}>
                    <i style={{marginRight: '10px'}} className="fa-solid fa-user-plus"></i>Thêm nhân viên
                </Button>
            </div>


            <React.Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Thêm nhân viên
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
                                <TextField sx={{ minWidth: '210px' }} label="Email" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                <TextField sx={{ minWidth: '210px', marginLeft: '10px' }} label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            <div style={{ display: 'flex', marginTop: '15px' }}>
                                <TextField sx={{ minWidth: '210px' }} label="Phone Number" variant="outlined" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                <TextField sx={{ minWidth: '210px', marginLeft: '10px' }} label="Ngày sinh" variant="outlined" type="date" value={birth} onChange={(e) => setBirth(e.target.value)}  InputLabelProps={{ shrink: true }}/>
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
                            
                            <div style={{ marginTop: '15px' }}>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Chi Nhánh</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={branchID}
                                        label="Trạng thái"
                                        onChange={handleChangeBranch}
                                    >
                                        {branches.map(branch => (
                                            <MenuItem key={branch.branchID} value={branch.branchID}>{branch.branchID === 'svr1' ? 'Savory I' : 'Savory II'}</MenuItem>
                                        ))}
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
                            Thêm nhân viên
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Thêm nhân viên thành công !
                </Alert>
            </Snackbar>
        </>
    )
};

export default AddStaff;
