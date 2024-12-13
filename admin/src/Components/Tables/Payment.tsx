import React, { useState } from "react";
import useApiUrl from '../useApiUrl'
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    Stack
} from "@mui/material";

interface BillDetail {
    menuItemID: number;
    menuItemName: string;
    quantity: number;
    price: number;
    size: string;
    total: number;
    tableBillDetailID: number
}

interface CalculateBillResponse {
    totalAmount: number;
    totalAfterVoucher: number | null;
    deposit: number;
    timeOut: string;
    timeIn: string;
    table: string;
    finalTotal: number
    billDetails: BillDetail[];
}

interface PaymentProps {
    tableBillID: number | null;
    onPaymentSucces: (data: CalculateBillResponse) => void;
}

const Payment: React.FC<PaymentProps> = ({ tableBillID, onPaymentSucces }) => {
    const role = localStorage.getItem('role'); // Lấy role từ localStorage

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handlePayment = async () => {
        try {
            const response = await fetch(`${APIURL}/calculateBill/${tableBillID}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                const data = await response.json();

                await onPaymentSucces(data)

                // Đặt thời gian chờ trước khi chuyển trang
                setTimeout(() => {
                    navigate(`/${role}/tables`); // Chuyển trang sau khi xuất PDF hoặc xử lý xong
                }, 3000); // Độ trễ 1 giây, có thể thay đổi tùy theo nhu cầu
            } else {
                console.error('Không thể tính hóa đơn', response.text());
            }
        } catch (err) {
            console.error('Lỗi trong quá trình thanh toán', err);
        }
    }

    return (
        <>
            <div className="primary-btn" onClick={handleOpenDialog}>Thanh Toán</div>

            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle>Xác nhận thanh toán</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} justifyContent="center">
                        <Button onClick={handlePayment} color="primary" variant="contained" fullWidth>
                            Xác Nhận
                        </Button>
                        <Button onClick={handleCloseDialog} color="error" variant="contained" fullWidth>
                            Hủy
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
};

export default Payment;