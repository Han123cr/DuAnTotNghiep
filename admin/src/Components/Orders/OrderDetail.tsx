import React, { useState } from "react";
import useApiUrl from "../useApiUrl";
import { Box, CircularProgress, Dialog, DialogContent, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

interface Order {
    orderID: number;
    orderDate: string;
    status: string;
    totalAmount: string;
    totalAfterVoucher: string | null;
    finalTotal: string;
    address: string;
    recipientPhone: string;
    recipientName: string;
    transactionCode: string | null;
    paymentMethodID: number;
    ship: string;
    notes: string | null;
    customerID: number;
    voucherID: number | null;
    branchID: string;
    payment_method: PaymentMethod;
    voucher: string | null;
    customer: Customer;
    branch: Branch;
}

interface PaymentMethod {
    paymentMethodID: number;
    methodName: string;
}

interface Customer {
    customerID: number;
    name: string;
    avatar: string;
    email: string;
    phoneNumber: string | null;
    status: string;
    googleId: string | null;
    facebookId: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Branch {
    branchID: string;
    address: string;
    branchPhone: string;
}

interface OrderItem {
    quantity: number;
    price: string;
    discount: string;
    size: string;
    total: string;
    notes: string | null;
    orderID: number;
    menuItemID: number;
    menu_item: MenuItem;
}

interface MenuItem {
    menuItemID: number;
    itemName: string;
    itemImage: string;
    description: string;
    statusToday: string;
    status: string;
    menuID: number;
}

interface OrderResponse {
    order: Order;
    items: OrderItem[];
}

interface OrderDetailsDialogProps {
    orderID: string | null
}

const OrderDetail: React.FC<OrderDetailsDialogProps> = ({ orderID }) => {

    const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openOrderDialog, setOpenOrderDialog] = useState(false);

    const { APIURL } = useApiUrl();

    const handleOrderDetail = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${APIURL}/getOrderDetail/${orderID}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) throw new Error("Failed to fetch table order details.");

            const data = await response.json();

            setOrderDetail(data);
            setOpenOrderDialog(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false)
        }
    };

    const handleClose = () => {
        setOpenOrderDialog(false);
    };

    return (
        <>
            <button
                className="btn btn-secondary btn-icon-split"
                onClick={handleOrderDetail}
                disabled={isLoading}
            >
                <span className="icon text-white">
                    {isLoading ? <CircularProgress size={15} className="text-white" /> :
                        <i className="fa-regular fa-eye"></i>
                    }
                </span>
                <span className="text">Xem chi tiết</span>
            </button>


            {/* Dialog hiển thị chi tiết đơn hàng */}
            <Dialog open={openOrderDialog} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogContent>
                    {orderDetail ? (
                        <>
                            {/* Thông tin người nhận */}
                            <Box mb={2}>
                                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>Thông Tin Đơn Hàng</Typography>
                                <Divider />
                                <Box my={3}>
                                    <Typography><strong>Tên người nhận:</strong> {orderDetail.order.recipientName}</Typography>
                                    <Typography><strong>Địa chỉ:</strong> {orderDetail.order.address}</Typography>
                                    <Typography><strong>Số điện thoại:</strong> {orderDetail.order.recipientPhone}</Typography>
                                    <Typography><strong>Tổng tiền:</strong> {orderDetail.order.finalTotal} VND</Typography>
                                    <Typography><strong>Phí ship:</strong> {orderDetail.order.ship} VND</Typography>
                                    <Typography><strong>Phương thức thanh toán:</strong> {orderDetail.order.payment_method.methodName}</Typography>
                                    <Typography>
                                        <strong>Trạng thái:</strong>{" "}
                                        {(() => {
                                            switch (orderDetail.order.status) {
                                                case "confirmed":
                                                    return "Đã xác nhận";
                                                case "shipped":
                                                    return "Đang vận chuyển";
                                                case "delivered":
                                                    return "Thành công";
                                                case "cancelled":
                                                    return "Hủy";
                                                case "waitConfirmation":
                                                    return "Chờ xác nhận";
                                                case "waitPay":
                                                    return "Chờ thanh toán";
                                                default:
                                                    return "Không xác định";
                                            }
                                        })()}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Bảng chi tiết các món */}
                            <Box>
                                <Typography variant="h6" gutterBottom>Chi Tiết Món Ăn</Typography>
                                <Divider />
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã Món</TableCell>
                                            <TableCell>Tên Món</TableCell>
                                            <TableCell>Kích Thước</TableCell>
                                            <TableCell>Số Lượng</TableCell>
                                            <TableCell>Giá</TableCell>
                                            <TableCell>Tổng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderDetail.items.map((item) => (
                                            <TableRow key={item.menuItemID}>
                                                <TableCell>{item.menu_item.menuItemID}</TableCell>
                                                <TableCell>{item.menu_item.itemName}</TableCell>
                                                <TableCell>{item.size}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{Number(item.price).toLocaleString()}</TableCell>
                                                <TableCell>{Number(item.total).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </>
                    ) : (
                        <Box textAlign="center">
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default OrderDetail;