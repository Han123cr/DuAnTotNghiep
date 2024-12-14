import { Alert, Box, Button, Chip, ChipProps, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper, Snackbar } from "@mui/material";
import useApiUrl from '../useApiUrl'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import React, { useCallback, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import OrderDetail from "./OrderDetail";

interface Order {
    orderID: number,
    orderDate: string,
    status: string,
    finalTotal: number,
    totalAmount: number,
    totalAfterVoucher: number,
    address: number,
    recipientPhone: number,
    recipientName: string,
    customerID: number,
    branchID: string,
    paymentMethod: string,
    voucherID: number
}

const Orders: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [orders, setOrders] = useState<Order[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);  // Trạng thái cho ngày bắt đầu
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);   // Trạng thái cho ngày kết thúc
    const [openDialog, setOpenDialog] = useState(false);  // Trạng thái mở hộp thoại
    const [pendingOrderID, setPendingOrderID] = useState<number | null>(null);  // Đơn hàng đang chờ hủy
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

    const fetchOrders = useCallback( async (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => {
        try {
            const currentDate = dayjs();
            // Nếu không có ngày bắt đầu, đặt thành 00:00 của ngày hiện tại
            const defaultStart = start ? start.startOf('day').format('YYYY-MM-DD') : currentDate.startOf('day').format('YYYY-MM-DD');

            // Nếu không có ngày kết thúc, đặt thành 23:59:59 của ngày ngày mai
            const defaultEnd = end ? end.endOf('day').format('YYYY-MM-DD') : currentDate.add(1, 'day').endOf('day').format('YYYY-MM-DD');

            let url = `${APIURL}/getOrders`;
            url += `?startDate=${defaultStart}&endDate=${defaultEnd}`

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();

            console.log(data);
            setOrders(data)

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    const updateOrderStatus = async (orderID: number, newStatus: string) => {
        try {
            await fetch(`${APIURL}/updateOrder/${orderID}`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            setOrders((prev) =>
                prev.map((order) =>
                    order.orderID === orderID
                        ? { ...order, status: newStatus }
                        : order
                )
            );
        } catch (error) {
            console.error(error);

        }
    }

    useEffect(() => {
        fetchOrders(startDate, endDate);
    }, [startDate, endDate, fetchOrders]);

    const handleChipClick = (event: React.MouseEvent<HTMLElement>, order: Order) => {
        if (order.status === 'delivered') {
            // Hiển thị thông báo khi đơn đã thành công
            setAlertMessage("Đơn hàng đã thành công, bạn không có quyền sửa");
            setOpenAlert(true);
            return;
        }
        setAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedOrder(null);
    }

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === 'cancelled') {
            setPendingOrderID(selectedOrder?.orderID || null);
            setOpenDialog(true);  // Mở hộp thoại xác nhận hủy
        } else {
            if (selectedOrder) {
                updateOrderStatus(selectedOrder.orderID, newStatus);
            }
        }
        handleMenuClose();
    }

    const handleConfirmCancel = () => {
        if (pendingOrderID) {
            updateOrderStatus(pendingOrderID, "cancelled");
            setOpenDialog(false);
            setPendingOrderID(null);
        }
    };

    const handleCancelDialog = () => {
        setOpenDialog(false);
        setPendingOrderID(null);
    };

    const handleDateChange = (newStartDate: dayjs.Dayjs | null, newEndDate: dayjs.Dayjs | null) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        fetchOrders(newStartDate, newEndDate);
    }

    const statusLabels: Record<string, { label: string; color: ChipProps["color"] }> = {
        waitConfirmation: { label: "Chờ xác nhận", color: "warning" },
        waitPay: { label: "Chờ thanh toán", color: "warning" },
        confirmed: { label: "Đã xác nhận", color: "primary" },
        shipped: { label: "Đang vận chuyển", color: "info" },
        delivered: { label: "Thành công", color: "success" },
        cancelled: { label: "Đã hủy", color: "error" },
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 70 },
        {
            field: 'branchID',
            headerName: 'Chi nhánh',
            width: 110,
            renderCell: (params) => params.value === 'svr1' ? 'Savory I' : 'Savory II'
        },
        {
            field: 'orderDate', headerName: 'Ngày đặt hàng', width: 200
        },
        { field: 'recipientName', headerName: 'Tên khách hàng', width: 150 },
        { field: 'paymentMethod', headerName: 'Phương thức', width: 110 },
        {
            field: 'finalTotal',
            headerName: 'Tổng tiền',
            width: 140,
            renderCell: (params) => {
                const formattedValue = params.value
                    ? new Intl.NumberFormat('vi-VN').format(params.value) + 'đ'
                    : '0 đ'
                return <span>{formattedValue}</span>
            }
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 204,
            renderCell: (params) => {
                const status = statusLabels[params.value] || {
                    label: "Unknown",
                    color: "default",
                };

                return (
                    <Chip
                        label={status.label}
                        color={status.color}
                        onClick={(event) => 
                            handleChipClick(event, params.row as Order)
                        }
                        sx={{
                            cursor: 'pointer',
                            width: 150,
                            opacity: params.value === 'cancelled' ? 0.7 : 1,
                        }}
                    />
                )
            }
        },
        {
            field: 'function',
            headerName: 'Chức năng',
            width: 204,
            renderCell: (params) => {
                return <OrderDetail orderID ={params.row.orderID}/>
            }
        },
    ];

    const rows = orders.map((order) => ({
        id: order.orderID,
        ...order
    }));

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Từ ngày"
                        value={startDate}
                        onChange={(newValue) => handleDateChange(newValue, endDate)}
                    />
                    <DatePicker
                        label="Đến ngày"
                        value={endDate}
                        onChange={(newValue) => handleDateChange(startDate, newValue)}
                    />
                </LocalizationProvider>
            </Box>


            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20, 30, 100]}
                    sx={{ border: 0 }}
                    // getRowClassName={(params) =>
                    //     params.row.status === 'cancelled' ? 'cancelled-row' : ''
                    // }
                    disableRowSelectionOnClick
                    localeText={{
                        noRowsLabel: 'Không có đơn đặt hàng hôm nay',
                    }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {Object.keys(statusLabels)
                        .filter((key) => key !== 'waitConfirmation' && key !== 'waitPay')
                        .map((key) => (
                            <MenuItem
                                key={key}
                                onClick={() => handleStatusChange(key)}
                                disabled={selectedOrder?.status === 'cancelled'}
                            >
                                {statusLabels[key].label}
                            </MenuItem>
                        ))}
                </Menu>
            </Paper>

            <Dialog open={openDialog} onClose={handleCancelDialog}>
                <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn hủy đơn hàng này không ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDialog} color="primary">Hủy</Button>
                    <Button onClick={handleConfirmCancel} color="error">Xác nhận</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="error" variant="filled" sx={{ width: '100%' }}>
                    {alertMessage} {/* Hiển thị thông điệp tương ứng */}
                </Alert>
            </Snackbar>
        </>
    )
};

export default Orders;