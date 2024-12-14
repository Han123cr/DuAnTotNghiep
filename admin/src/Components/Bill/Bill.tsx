import { Box, Paper } from "@mui/material";
import useApiUrl from '../useApiUrl'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import React, { useCallback, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import BillDetail from "./billDetail";

interface Branch {
    branchID: string;
    address: string;
    branchPhone: string;
}

interface TableBill {
    tableBillID: number;
    totalAmount: string;
    totalAfterVoucher: number | null;
    timeOut: string;
    tableID: string;
    tableOrderID: string | null;
    branch: Branch;
    createdAt: string;
    updatedAt: string | null;
}

const Bills: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [bills, setBills] = useState<TableBill[]>([]);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);  // Trạng thái cho ngày bắt đầu
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);   // Trạng thái cho ngày kết thúc

    const fetchBills = useCallback( async (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => {
        try {
            const currentDate = dayjs();
            // Nếu không có ngày bắt đầu, đặt thành 00:00 của ngày hiện tại
            const defaultStart = start ? start.startOf('day').format('YYYY-MM-DD') : currentDate.startOf('day').format('YYYY-MM-DD');

            // Nếu không có ngày kết thúc, đặt thành 23:59:59 của ngày ngày mai
            const defaultEnd = end ? end.endOf('day').format('YYYY-MM-DD') : currentDate.add(1, 'day').endOf('day').format('YYYY-MM-DD');

            let url = `${APIURL}/getAllBills`;
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
            setBills(data)

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    useEffect(() => {
        fetchBills(startDate, endDate);
    }, [startDate, endDate, fetchBills]);

    const handleDateChange = (newStartDate: dayjs.Dayjs | null, newEndDate: dayjs.Dayjs | null) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        fetchBills(newStartDate, newEndDate);
    }

    const columns: GridColDef[] = [
        { field: 'tableBillID', headerName: 'STT', width: 70 },
        {
            field: 'branchID',
            headerName: 'Chi nhánh',
            width: 110,
            renderCell: (params) => params.value === 'svr1' ? 'Savory I' : 'Savory II'
        },
        {
            field: 'tableID', headerName: 'Bàn', width: 90
        },
        {
            field: 'totalAmount',
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
            field: 'createdAt', headerName: 'Giờ vào', width: 180
        },
        {
            field: 'timeOut', headerName: 'Giờ ra', width: 180
        },
        {
            field: 'function',
            headerName: 'Chức năng',
            width: 200,
            renderCell: (params) => {
                return <BillDetail tableBillID ={params.row.tableBillID}/>
            }
        },
    ];

    const rows = bills.map((bill) => ({
        id: bill.tableBillID,
        branchID: bill.branch.branchID,
        ...bill
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
                    getRowClassName={(params) =>
                        params.row.status === 'cancelled' ? 'cancelled-row' : ''
                    }
                    disableRowSelectionOnClick
                    localeText={{
                        noRowsLabel: 'Không có hóa đơn hôm nay',
                    }}
                />
            </Paper>
        </>
    )
};

export default Bills;