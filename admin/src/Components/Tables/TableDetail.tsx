import React, { useState } from "react";
import useApiUrl from "../useApiUrl";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
} from "@mui/material";

interface OrderDetail {
    tableOrderID: number
    createdAt: string
    arrivalTime: string
    numberOfPeople: number
    notes: string
    bookerName: string
    bookerPhoneNumber: string
    tableOrderStatus: string
    deposit: string | null,
    transactionCode: string | null,
    reminderSent: number,
    customerID: number,
    tableID: string,
    paymentMethodID: number,
    voucherID: number | null
}

interface TableOrderDetailsDialogProps {
    tableID: string | null
}

const TableOrderDetailsDialog: React.FC<TableOrderDetailsDialogProps> = ({tableID}) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openOrderDialog, setOpenOrderDialog] = useState(false);

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const handleOrderDetails = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${APIURL}/getTableOrdersOrBill/${tableID}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch table order details.");

            const data = await response.json();

            // Lấy ngày hôm nay theo múi giờ địa phương (YYYY-MM-DD)
            const today = new Date();
            const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
            console.log(todayFormatted);

            // Lọc các đơn đặt bàn có ngày đến trùng với ngày hôm nay
            const filteredOrders = data.orders.filter((order: OrderDetail) => {
                const orderDate = order.arrivalTime.split(" ")[0];  // Lấy phần ngày của arrivalTime (YYYY-MM-DD)
                return orderDate === todayFormatted;
            });

            setOrderDetails(filteredOrders);
            setOpenOrderDialog(true);
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpenOrderDialog(false);
    };

    return (
        <>
            <i 
                style={{ marginLeft: '10px' }} 
                className="fa-regular fa-eye"
                onClick={handleOrderDetails}
            >
            </i>

            <Dialog open={openOrderDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết đơn đặt bàn</DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <CircularProgress />
                    ) : orderDetails.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Đặt Bàn</TableCell>
                                        <TableCell>Người Đặt</TableCell>
                                        <TableCell>Số Điện Thoại</TableCell>
                                        <TableCell>Số Người</TableCell>
                                        <TableCell>Thời Gian Đến</TableCell>
                                        <TableCell>Ghi Chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetails.map((detail) => (
                                        <TableRow key={detail.tableOrderID}>
                                            <TableCell>{detail.tableOrderID}</TableCell>
                                            <TableCell>{detail.bookerName}</TableCell>
                                            <TableCell>{detail.bookerPhoneNumber}</TableCell>
                                            <TableCell>{detail.numberOfPeople}</TableCell>
                                            <TableCell>{detail.arrivalTime}</TableCell>
                                            <TableCell>{detail.notes}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography>Không có thông tin chi tiết.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TableOrderDetailsDialog;
