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
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { API_Url, API_UrlImage } from "../../../tsconfig.json"

interface MenuItem {
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
    variants: Variant[];
}

interface Variant {
    variantID?: number;
    price: number;
    discount: number;
    size: string;
    menuItemID?: number;
}

interface Menu {
    menuID: number;
    menuName: string;
}

interface EditProductProps {
    productID: number;
    onEditProduct: (updatedProduct: MenuItem) => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditProduct: React.FC<EditProductProps> = ({ productID, onEditProduct }) => {

    const [openAlert, setOpenAlert] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [fileName, setFileName] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [status, setStatus] = React.useState('');
    const [statusToday, setStatusToday] = React.useState('');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    // const [isSizeSelected, setIsSizeSelected] = useState(false);

    const [menuData, setMenuData] = useState<Menu[]>([]);
    const [selectedMenu, setselectedMenu] = useState<number | string>("");

    //State lưu các size được chọn và giá trị tương ứng cho từng size
    const [selectedSizes, setSelectedSizes] = useState<string[]>(['basic']);
    const [variants, setVariants] = useState<Variant[]>([{ size: 'basic', price: 0, discount: 0 }]);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await fetch(`https://savory.website/api/admin/getMenus`);
                const data: Menu[] = await response.json();
                console.log(data);
                setMenuData(data)
            } catch (err) {
                console.error(err);
            }
        };

        fetchMenus();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${API_Url}/getMenuItemDetails/${productID}`);
                const product: MenuItem = await response.json();
                if (product) {
                    setItemName(product.itemName);
                    setDescription(product.description);
                    setStatus(product.status);
                    setStatusToday(product.statusToday);
                    setselectedMenu(product.menuID);
                    setFile(null)

                    const imageName = product.itemImage
                        ? product.itemImage.split('/').pop() // Only split if itemImage is a valid string
                        : '';

                    setFileName(imageName || '');

                    setImageSrc(`${API_UrlImage}/${product.itemImage}`)

                    const fetchedSizes = product.variants.map((variant) => variant.size);
                    setSelectedSizes(fetchedSizes);

                    const fetchedVariants = product.variants.map((variant) => ({
                        variantID: variant.variantID,
                        size: variant.size,
                        price: Number(variant.price),
                        discount: Number(variant.discount),
                    }))
                    setVariants(fetchedVariants);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (open) {
            fetchProductDetails();
        };
    }, [open, productID]);

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = event.target.value;
        if (event.target.checked) {
            setSelectedSizes((prevSizes) => [...prevSizes, size]);
            setVariants((prevVariants) => [...prevVariants, { size, price: 0, discount: 0 }]);
        } else {
            setSelectedSizes((prevSizes) => prevSizes.filter((s) => s !== size));
            setVariants((prevVariants) => prevVariants.filter((variant) => variant.size !== size));
        }
    };

    const handleVariantChange = (size: string, price: number, discount: number) => {
        setVariants((prevVariants) =>
            prevVariants.map((variant) =>
                variant.size === size ? { ...variant, price, discount } : variant
            )
        );
    };

    //Chọn size 
    const handleLabelClick = () => {
        setIsDisabled(prevState => !prevState);
    }

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

    const handChangeStatusToday = (event: SelectChangeEvent) => {
        setStatusToday(event.target.value as string);
    };

    const handChangeMenu = (event: SelectChangeEvent) => {
        setselectedMenu(Number(event.target.value));
    };

    //Đóng mở popup thêm sản phẩm
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
        // let filteredVariants = variants;

        // if (selectedSizes.length > 1 && selectedSizes.includes('basic')) {
        //     filteredVariants = variants.filter(variant => variant.size !== 'basic')
        // }

        const formData = new FormData();
        formData.append('itemName', itemName);
        if (file) formData.append('itemImage', file);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('statusToday', statusToday);
        if (selectedMenu !== undefined) {
            formData.append('menuID', selectedMenu.toString());
        }
        variants.forEach((variant, index) => {
            formData.append(`variant[${index}][size]`, variant.size);
            formData.append(`variant[${index}][price]`, variant.price.toString());
            formData.append(`variant[${index}][discount]`, variant.discount.toString());
        });

        console.log(itemName, description, fileName, status, statusToday, selectedMenu, variants);

        try {
            const response = await fetch(`${API_Url}/updateMenuItem/${productID}`, {
                method: 'POST',
                body: formData,
            });


            if (!response.ok) {
                throw new Error('Thất bại khi sửa sản phẩm');
            }

            const updatedProduct = await response.json();
            // const updatedProduct = result.data;
            onEditProduct(updatedProduct);
            // resetForm();
            //Show thông báo thêm sản phẩm thành công
            setOpenAlert(true)

        } catch (error) {
            console.error(error);
            alert('Sửa sản phẩm thất bại')
        }

        //Đóng form sau khi thêm sản phẩm
        handleClose();
    };

    return (
        <>
            <button
                style={{ marginRight: '5px' }}
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
                        Sửa sản phẩm
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
                                    label="Tên sản phẩm"
                                    variant="outlined"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                />
                            </div>
                            <FormLabel
                                sx={{ marginTop: '10px' }}
                                id="demo-row-radio-buttons-group-label"
                                onClick={handleLabelClick}
                            >
                                Chọn kích thước
                            </FormLabel>
                            <FormGroup row>
                                {['S', 'M', 'L'].map((size) => (
                                    <FormControlLabel
                                        key={size}
                                        control={<Checkbox disabled={isDisabled} checked={selectedSizes.includes(size)} onChange={handleSizeChange} value={size} />}
                                        label={size}
                                    />
                                ))}
                            </FormGroup>

                            {selectedSizes.length < 2 && (
                                <div style={{ display: 'flex', marginTop: '10px' }}>
                                <TextField
                                    sx={{ width: "50%", marginRight: '10px' }}
                                    id="outlined-basic"
                                    label="Giá tiền"
                                    variant="outlined"
                                    value={variants.find((variant) => variant.size === 'basic')?.price || ''}
                                    onChange={(e) =>
                                        handleVariantChange('basic', parseInt(e.target.value), variants.find((variant) => variant.size === 'basic')?.discount || 0)
                                    }
                                />
                                <TextField
                                    sx={{ width: "50%" }}
                                    id="outlined-basic"
                                    label="Giá giảm"
                                    variant="outlined"
                                    value={variants.find((variant) => variant.size === 'basic')?.discount || ''}
                                    onChange={(e) =>
                                        handleVariantChange('basic', variants.find((variant) => variant.size === 'basic')?.price || 0, parseInt(e.target.value))
                                    }
                                />
                            </div>
                            )}

                            {selectedSizes.filter(size => size !== 'basic').map((size) => (
                                                                <>
                                    <div style={{ marginTop: "10px" }}>Kích thước {size}</div>
                                    <div key={size} style={{ display: 'flex', marginTop: '10px' }}>
                                        <TextField
                                            sx={{ width: "50%", marginRight: '10px' }}
                                            id="outlined-basic"
                                            label={`Giá tiền ${size}`}
                                            variant="outlined"
                                            value={variants.find((variant) => variant.size === size)?.price || ''}
                                            onChange={(e) =>
                                                handleVariantChange(size, parseInt(e.target.value), variants.find((variant) => variant.size === size)?.discount || 0)
                                            }
                                        />
                                        <TextField
                                            sx={{ width: "50%" }}
                                            id="outlined-basic"
                                            label={`Giá giảm ${size}`}
                                            variant="outlined"
                                            value={variants.find((variant) => variant.size === size)?.discount || ''}
                                            onChange={(e) =>
                                                handleVariantChange(size, variants.find((variant) => variant.size === size)?.price || 0, parseFloat(e.target.value))
                                            }
                                        />
                                    </div>
                                    </>
                            ))}
                            {/* Hiển danh mục được chọn */ }
                                < FormControl sx = {{ marginTop: '15px' }}>
                            <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedMenu?.toString()}
                                label="Danh mục"
                                onChange={handChangeMenu}
                            >
                                {menuData.map((menu) => (
                                    <MenuItem key={menu.menuID} value={menu.menuID}>
                                        {menu.menuName}
                                    </MenuItem>
                                ))};
                            </Select>
                        </FormControl>

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
                            <FormControl sx={{ minWidth: '210px', marginLeft: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Tình trạng</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={statusToday}
                                    label="Trạng thái"
                                    onChange={handChangeStatusToday}
                                >
                                    <MenuItem value='inStock'>Còn hàng</MenuItem>
                                    <MenuItem value='outOfStock'>Hết hàng</MenuItem>
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
                        <TextField
                            fullWidth
                            sx={{ marginTop: '10px' }}
                            multiline
                            rows={2}
                            id="outlined-basic"
                            label="Mô tả"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant='outlined' onClick={handleSubmit}>
                        Thêm sản phẩm
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment >
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Thêm sản phẩm thành công !
                </Alert>
            </Snackbar>
        </>
    )
};

export default EditProduct;
