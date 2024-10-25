import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { API_Url } from "../../../tsconfig.json"

interface Variant {
    variantID: number;
    price: number;
    discount: number
    size: string
    menuItemID: string;
}

interface ProductVariantProps {
    productID: number;  // Accept the product ID as a prop
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const ProductVariant: React.FC<ProductVariantProps> = ({productID}) => {
    const [open, setOpen] = React.useState(false);
    const [variants, setVariants] = useState<Variant[]>([]);

    //Đóng mở popup thêm sản phẩm
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
    const fetchProductVariants = async () => {
        try {
            const response = await fetch(`${API_Url}/getMenuItemDetails/${productID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const product = await response.json();
            setVariants(product.variants)

        } catch (err) {
            console.error(err);
        }
    };

    
        if(productID){
            fetchProductVariants();
        }
    }, [productID]);

    return (
        <>
            <button
                className="btn btn-warning btn-sm edit"
                type="button"
                title="Biến thể"
                onClick={handleClickOpen}
            >
                <i className="fa-solid fa-bars"></i>
            </button>


            <React.Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Danh sách biến thể
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
                        <table className="table table-hover table-bordered" id="sampleTable">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Kích cỡ</th>
                                    <th>Giá tiền</th>
                                    <th>GIá giảm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant, index) => (
                                    <tr key={variant.variantID}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>{variant.size}</td>
                                        <td>{variant.price}</td>
                                        <td>{variant.discount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" onClick={handleClose}>
                            Hủy
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
        </>
    )
};

export default ProductVariant;
