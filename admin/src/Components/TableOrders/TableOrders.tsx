import { Alert, Box, Button, Chip, ChipProps, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper, Snackbar } from "@mui/material";
import useApiUrl from '../useApiUrl'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import React, { useCallback, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

interface OrderTables {
    tableOrderID: number,
    createdAt: string,
    arrivalTime: string,
    numberOfPeople: number,
    notes: string,
    bookerName: string,
    bookerPhoneNumber: number,
    tableOrderStatus: string,
    transactionCode: string,
    deposit: number,
    branchID: string,
    paymentMethod: string,
    customerID: number,
    voucherID: null,
    tableID: string
}

const TableOrders: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [tableOrders, setTableOrders] = useState<OrderTables[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTableOrder, setSelectedTableOrder] = useState<OrderTables | null>(null);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);  // Trạng thái cho ngày bắt đầu
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);   // Trạng thái cho ngày kết thúc
    const [openDialog, setOpenDialog] = useState(false);  // Trạng thái mở hộp thoại
    const [pendingOrderID, setPendingOrderID] = useState<number | null>(null);  // Đơn hàng đang chờ hủy
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

    const fetchOrderTables = useCallback(async (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => {
        try {
            const currentDate = dayjs();
            // Nếu không có ngày bắt đầu, đặt thành 00:00 của ngày hiện tại
            const defaultStart = start ? start.startOf('day').format('YYYY-MM-DD') : currentDate.startOf('day').format('YYYY-MM-DD');

            // Nếu không có ngày kết thúc, đặt thành 23:59:59 của ngày ngày mai
            const defaultEnd = end ? end.endOf('day').format('YYYY-MM-DD') : currentDate.add(1, 'day').endOf('day').format('YYYY-MM-DD');

            let url = `${APIURL}/getTableOrders`;
            url += `?startDate=${defaultStart}&endDate=${defaultEnd}`

            console.log(url); // In ra URL đã được tạo
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
            setTableOrders(data)
        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    const updateTableOrderStatus = async (tableOrderID: number, newStatus: string) => {
        try{
            await fetch(`${APIURL}/updateTableOrderStatus/${tableOrderID}`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tableOrderStatus: newStatus }),
            })

            setTableOrders((prev) =>
                prev.map((tableOrder) =>
                    tableOrder.tableOrderID === tableOrderID
                        ? { ...tableOrder, tableOrderStatus: newStatus }
                        : tableOrder
                )
            );
        }catch(err){
            console.error(err);
            
        }
    }

    useEffect(() => {
        fetchOrderTables(startDate, endDate);
    }, [startDate, endDate, fetchOrderTables]);

    const handleDateChange = (newStartDate: dayjs.Dayjs | null, newEndDate: dayjs.Dayjs | null) => {
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            fetchOrderTables(newStartDate, newEndDate);
    }

    const handleChipClick = (event: React.MouseEvent<HTMLElement>, tableOrder: OrderTables) => {
        if (tableOrder.tableOrderStatus === 'completed') {
            // Hiển thị thông báo khi đơn đã thành công
            setAlertMessage("Đơn bàn đã thành công, bạn không có quyền sửa");
            setOpenAlert(true);
            return;
        }
        setAnchorEl(event.currentTarget);
        setSelectedTableOrder(tableOrder);
    };

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedTableOrder(null);
    }

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === 'cancelled') {
            setPendingOrderID(selectedTableOrder?.tableOrderID || null);
            setOpenDialog(true);  // Mở hộp thoại xác nhận hủy
        } else {
            if (selectedTableOrder) {
                updateTableOrderStatus(selectedTableOrder.tableOrderID, newStatus);
            }
        }
        handleMenuClose();
    }

    const handleConfirmCancel = () => {
        if (pendingOrderID) {
            updateTableOrderStatus(pendingOrderID, "cancelled");
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
        seated: { label: "Đang sử dụng", color: "info" },
        completed: { label: "Thành công", color: "success" },
        cancelled: { label: "Đã hủy", color: "error" },
        paid: {label: "Đã thanh toán", color: "success"}
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 50 },
        { field: 'bookerName', headerName: 'Tên người đặt', width: 120,},
        { field: 'arrivalTime', headerName: 'Ngày đặt bàn', width: 170},
        { field: 'bookerPhoneNumber', headerName: 'Số điện thoại', width: 115},
        { 
            field: 'numberOfPeople', 
            headerName: 'Số lượng người', 
            width: 120,
            renderCell: (params) => params.value + ' người'
        },
        { 
            field: 'deposit', 
            headerName: 'Tiền cọc', 
            width: 110,
            renderCell: (params) => {
                const formattedValue = params.value
                    ? new Intl.NumberFormat('vi-VN').format(params.value) + 'đ'
                    : '0 đ'
                return <span>{formattedValue}</span>
            }
        },
        { field: 'tableID', headerName: 'Bàn', width: 90},
        { field: 'notes', headerName: 'Ghi chú', width: 115},
        {
            field: 'tableOrderStatus',
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
                            handleChipClick(event, params.row as OrderTables)
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

    const rows = tableOrders.map((tableOrder) => ({
        id: tableOrder.tableOrderID,
        ...tableOrder
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
                    onChange={(newValue) => handleDateChange(startDate ,newValue)}
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
                        params.row.tableOrderStatus === 'cancelled' ? 'cancelled-row' : ''
                    }
                    disableRowSelectionOnClick
                    localeText={{
                        noRowsLabel: 'Không có đơn đặt bàn hôm nay',
                    }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {Object.keys(statusLabels)
                        .filter((key) => key !== 'waitConfirmation' && key !== 'waitPay' && key !== 'paid')
                        .map((key) => (
                            <MenuItem
                                key={key}
                                onClick={() => handleStatusChange(key)}
                                disabled={selectedTableOrder?.tableOrderStatus === 'cancelled'}
                            >
                                {statusLabels[key].label}
                            </MenuItem>
                        ))}
                </Menu>
            </Paper>

            <Dialog open={openDialog} onClose={handleCancelDialog}>
                    <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn hủy đơn bàn này không ?
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
}

export default TableOrders;