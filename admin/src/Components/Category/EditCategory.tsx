import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import AddIcon from '@mui/icons-material/Add';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { API_Url, API_UrlImage } from "../../../tsconfig.json"

interface Menu {
    menuID: number,
    menuName: string,
    menuImage: string | null,
    status: string,
}

interface EditCategoryProps {
    categoryID: number;
    onEditCategory: (updateCategory: Menu) => void;
}


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditCategory: React.FC<EditCategoryProps> = ({ categoryID, onEditCategory }) => {

    const [openAlert, setOpenAlert] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [fileName, setFileName] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [status, setStatus] = React.useState('');
    const [menuName, setMenuName] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try{
                const response = await fetch(`${API_Url}/getMenuDetails/${categoryID}`);
                const category: Menu = await response.json();
                if(category){
                    setMenuName(category.menuName);
                    setStatus(category.status); 
                    setFile(null)

                    const imageName = category.menuImage 
                    ? category.menuImage.split('/').pop() // Only split if menuImage is a valid string
                    : '';

                    setFileName(imageName || '');
                    
                    setImageSrc(`${API_UrlImage}/${category.menuImage}`)
                }
            }catch(err){
                console.error(err);
            }
        };

        if(open){
            fetchCategoryDetails();
        };
    }, [open, categoryID]);

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

    //Select status và statusToday
    const handChangeStatus = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    //Đóng mở popup thêm danh mục
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        // resetForm();
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

    const handleSubmit = async () => {

        const formData = new FormData();
        formData.append('menuName', menuName);
        if (file) formData.append('menuImage', file);
        formData.append('status', status);

        console.log(menuName, fileName, status);

        try {
            const response = await fetch(`${API_Url}/updateMenu/${categoryID}`, {
                method: 'POST',
                body: formData,
            });


            if (!response.ok) {
                throw new Error('Thất bại khi sửa danh mục');
            }

            const updateCategory = await response.json();
            onEditCategory(updateCategory);
            // resetForm();
            //Show thông báo thêm danh mục thành công
            setOpenAlert(true)

        } catch (error) {
            console.error(error);
            alert('Sửa danh mục thất bại')
        }

        //Đóng form sau khi thêm danh mục
        handleClose();
    };

    return (
        <>
            <button
                className="btn btn-primary btn-sm edit"
                type="button"
                title="Sửa"
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
                        Sửa danh mục
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
                                    label="Tên danh mục"
                                    variant="outlined"
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', marginTop: '15px' }}>
                                <FormControl sx={{ minWidth: '210px' }}>
                                    <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={status}
                                        label="Trạng thái"
                                        onChange={handChangeStatus}
                                    >
                                        <MenuItem value='hidden'>Ẩn</MenuItem>
                                        <MenuItem value='display'>Hiện</MenuItem>
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
                            Sửa danh mục
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Cập nhật danh mục thành công !
                </Alert>
            </Snackbar>
        </>
    )
};

export default EditCategory;
