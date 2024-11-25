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
    setOpenAlert: (open: boolean) => void; // Nhận hàm để cập nhật trạng thái alert
    setAlertMessage: (message: string) => void; // Nhận hàm để cập nhật thông điệp
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditProduct: React.FC<EditProductProps> = ({ productID, onEditProduct, setOpenAlert, setAlertMessage }) => {

    const [open, setOpen] = React.useState(false);
    const [fileName, setFileName] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [status, setStatus] = React.useState('');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [singleSizeAlert, setSingleSizeAlert] = useState(false);
    const [menuData, setMenuData] = useState<Menu[]>([]);
    const [selectedMenu, setselectedMenu] = useState<number | string>("");

    //State lưu các size được chọn và giá trị tương ứng cho từng size
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);

    //Load danh mục
    const fetchMenus = async () => {
        try {
            const response = await fetch(`${API_Url}/getMenus`);
            const data: Menu[] = await response.json();
            console.log(data);
            setMenuData(data)
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${API_Url}/getMenuItemDetails/${productID}`);
                const product: MenuItem = await response.json();
                if (product) {
                    setItemName(product.itemName);
                    setDescription(product.description);
                    setStatus(product.status);
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

        if (size !== 'basic') {
            setVariants((prevVariants) => {
                return prevVariants.filter(variant => variant.size !== 'basic');
            });
            setSelectedSizes((prevSizes) => prevSizes.filter(s => s !== 'basic'));
        }
    };

    const shouldShowBasic = selectedSizes.length === 0;

    const handleVariantChange = (size: string, price: number, discount: number) => {
        setVariants((prevVariants) => {
            const existingVariant = prevVariants.find((variant) => variant.size === size);
            if (existingVariant) {
                return prevVariants.map((variant) =>
                    variant.size === size ? { ...variant, price, discount } : variant
                );
            } else {
                return [...prevVariants, { size, price, discount }];
            }
        });
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

    //Select status
    const handChangeStatus = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    const handChangeMenu = (event: SelectChangeEvent) => {
        setselectedMenu(Number(event.target.value));
    };

    //Đóng mở popup thêm sản phẩm
    const handleClickOpen = () => {
        setOpen(true);
        fetchMenus()
    };
    const handleClose = () => {
        setOpen(false);
        // resetForm();
    };

    const handleSubmit = async () => {
        let filteredVariants = variants;

        const hasSelectedSizes = selectedSizes.length < 0;

        // Nếu không có kích thước nào được chọn nhưng lại có biến thể 'basic'
        if (!hasSelectedSizes && variants.some(variant => variant.size === 'basic')) {
            // Nếu chỉ có biến thể 'basic', cho phép lưu và đặt filteredVariants là biến thể 'basic'
            filteredVariants = filteredVariants.filter(variant => variant.size === 'basic');
        } else if (selectedSizes.length === 1 && selectedSizes[0] !== 'S') {
            setSingleSizeAlert(true); // Show alert if only one size is selected and it's not S
            return;
        }


        setSingleSizeAlert(false);

        // Check if only size 'S' is selected
        if (selectedSizes.length === 1 && selectedSizes.includes('S')) {
            // If only size 'S' is selected, change it to 'basic'
            filteredVariants = [{ size: 'basic', price: variants.find(v => v.size === 'S')?.price || 0, discount: variants.find(v => v.size === 'S')?.discount || 0 }];
        } else {
            // Otherwise, keep the selected sizes as they are
            filteredVariants = variants.filter(variant => selectedSizes.includes(variant.size));
        }
        const formData = new FormData();
        formData.append('itemName', itemName);
        if (file) formData.append('itemImage', file);
        formData.append('description', description);
        formData.append('status', status);
        if (selectedMenu !== undefined) {
            formData.append('menuID', selectedMenu.toString());
        }
        filteredVariants.forEach((variant, index) => {
            formData.append(`variant[${index}][size]`, variant.size);
            formData.append(`variant[${index}][price]`, variant.price.toString());
            formData.append(`variant[${index}][discount]`, variant.discount.toString());
        });

        console.log(itemName, description, fileName, status, selectedMenu, filteredVariants);

        try {
            const response = await fetch(`${API_Url}/updateMenuItem/${productID}`, {
                method: 'POST',
                body: formData,
            });


            if (!response.ok) {
                throw new Error('Thất bại khi sửa sản phẩm');
            }

            const result = await response.json();
            const updatedProduct = result.data;
            onEditProduct(updatedProduct);
            //Show thông báo sửa sản phẩm thành công
            setAlertMessage("Đã sửa sản phẩm thành công!"); // Gọi hàm để cập nhật thông điệp
            setOpenAlert(true); // Mở alert khi sửa thành công


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
                                    id="outlined"
                                    label="Tên sản phẩm"
                                    variant="outlined"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                />
                            </div>
                            <FormLabel
                                sx={{ marginTop: '10px' }}
                                id="demo-row-radio-buttons-group-label"
                                style={{ cursor: 'pointer' }}
                            >
                                Chọn kích thước
                            </FormLabel>
                            <FormGroup row>
                                {['S', 'M', 'L'].map((size) => (
                                    <FormControlLabel
                                        key={size}
                                        control={<Checkbox checked={selectedSizes.includes(size)} onChange={handleSizeChange} value={size} />}
                                        label={size === 'S' ? `${size} (mặc định)` : size}
                                    />
                                ))}
                            </FormGroup>

                            {selectedSizes.map((size) => (
                                <div key={size}>
                                    <div style={{ marginTop: "10px" }}>Kích thước {size}</div>
                                    <div style={{ display: 'flex', marginTop: '10px' }}>
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
                                </div>
                            ))}
                            {/* Show basic input only if no other sizes are selected */}
                            {shouldShowBasic && (
                                <>
                                    <div style={{ marginTop: "10px" }}>Kích thước Basic</div>
                                    <div style={{ display: 'flex', marginTop: '10px' }}>
                                        <TextField
                                            sx={{ width: "50%", marginRight: '10px' }}
                                            id="outlined-basic-basic"
                                            label={`Giá tiền Basic`}
                                            variant="outlined"
                                            value={variants.find((variant) => variant.size === 'basic')?.price || 0}
                                            onChange={(e) =>
                                                handleVariantChange('basic', parseInt(e.target.value), variants.find((variant) => variant.size === 'basic')?.discount || 0)
                                            }
                                        />
                                        <TextField
                                            sx={{ width: "50%" }}
                                            id="outlined-basic-basic-discount"
                                            label={`Giá giảm Basic`}
                                            variant="outlined"
                                            value={variants.find((variant) => variant.size === 'basic')?.discount || 0}
                                            onChange={(e) =>
                                                handleVariantChange('basic', variants.find((variant) => variant.size === 'basic')?.price || 0, parseFloat(e.target.value))
                                            }
                                        />
                                    </div>
                                </>
                            )}
                            {/* Hiển thị giá tiền và giá giảm cho từng size được chọn */}




                            <FormControl sx={{ marginTop: '15px' }}>
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

                            <FormControl sx={{ marginTop: '15px' }}>
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
                            {singleSizeAlert && (
                                <Alert severity="warning" sx={{ maxWidth: '420px', marginTop: '10px' }}>
                                    Vui lòng chọn 2 size trở nên, nếu chọn 1 size thì chọn size S.
                                </Alert>
                            )}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button variant='outlined' onClick={handleSubmit}>
                            Sửa sản phẩm
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
        </>
    )
};

export default EditProduct;
