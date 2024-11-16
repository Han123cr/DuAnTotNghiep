import { Box, Button, Chip, ChipProps, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper } from "@mui/material";
import { API_Url } from "../../../tsconfig.json"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs"; 

interface Order {
    orderID: number,
    orderDate: string,
    status: string,
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

const OrdersTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);  // Trạng thái cho ngày bắt đầu
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);   // Trạng thái cho ngày kết thúc
    const [openDialog, setOpenDialog] = useState(false);  // Trạng thái mở hộp thoại
    const [pendingOrderID, setPendingOrderID] = useState<number | null>(null);  // Đơn hàng đang chờ hủy

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_Url}/getOrders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();

            console.log(data.data);
            setOrders(data.data)

        } catch (err) {
            console.error(err);
        }
    };

    const updateOrderStatus = async (orderID: number, newStatus: string) => {
        try {
            await fetch(`${API_Url}/updateOrder/${orderID}`, {
                method: "POST",
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
        fetchOrders();
    }, []);

    const handleChipClick = (event: React.MouseEvent<HTMLElement>, order: Order) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedOrder(null);
    }

    const handleStatusChange = (newStatus: string) => {
        if(newStatus === 'cancelled'){
            setPendingOrderID(selectedOrder?.orderID || null);
            setOpenDialog(true);  // Mở hộp thoại xác nhận hủy
        }else{
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
            field: 'totalAfterVoucher',
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
    ];

    //Lọc theo ngày
    const filteredOrders = orders.filter(order => {
        const orderDate = dayjs(order.orderDate);
        const isAfterStartDate = startDate ? orderDate.isAfter(startDate, 'day') || orderDate.isSame(startDate, 'day') : true;
        const isBeforeEndDate = endDate ? orderDate.isBefore(endDate, 'day') || orderDate.isSame(endDate, 'day') : true;
        return isAfterStartDate && isBeforeEndDate;
    });

    const rows = filteredOrders.map((order) => ({
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
                    onChange={(newValue) => setStartDate(newValue)}
                    />
                    <DatePicker 
                    label="Đến ngày"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
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
                    getRowClassName={(params) => 
                        params.row.status === 'cancelled' ? 'cancelled-row' : ''
                    }
                    disableRowSelectionOnClick
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {Object.keys(statusLabels).map((key) => (
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
        </>
    )
};

export default OrdersTable;