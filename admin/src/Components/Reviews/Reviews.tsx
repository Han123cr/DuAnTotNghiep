import { Box, Paper } from "@mui/material";
import useApiUrl from '../useApiUrl'
import { Rating } from "@mui/material"; // Import Rating component
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import React, { useCallback, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

interface Review {
    serviceReviewID: number,
    rating: number,
    comment: string,
    createdAt: string,
    orderID: number | null,
    tableOrderID: number | null
}

const Reviews: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [reviews, setReviews] = useState<Review[]>([]);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);  // Trạng thái cho ngày bắt đầu
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);   // Trạng thái cho ngày kết thúc

    const fetchReviews = useCallback(async (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => {
        try {
            const currentDate = dayjs();
            // Nếu không có ngày bắt đầu, đặt thành 00:00 của ngày hiện tại
            const defaultStart = start ? start.startOf('day').format('YYYY-MM-DD') : currentDate.startOf('day').format('YYYY-MM-DD');

            // Nếu không có ngày kết thúc, đặt thành 23:59:59 của ngày ngày mai
            const defaultEnd = end ? end.endOf('day').format('YYYY-MM-DD') : currentDate.add(1, 'day').endOf('day').format('YYYY-MM-DD');

            let url = `${APIURL}/getServiceReviews`;
            url += `?startDay=${defaultStart}&endDay=${defaultEnd}`

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
            setReviews(data.data)

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    useEffect(() => {
        fetchReviews(startDate, endDate);
    }, [startDate, endDate, fetchReviews]);

    const handleDateChange = (newStartDate: dayjs.Dayjs | null, newEndDate: dayjs.Dayjs | null) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        fetchReviews(newStartDate, newEndDate);
    }

    const columns: GridColDef[] = [
        { field: 'serviceReviewID', headerName: 'STT', width: 70 },
        {
            field: 'createdAt', headerName: 'Ngày tạo', width: 200
        },
        {
            field: 'type',
            headerName: 'Loại',
            width: 180,
            renderCell: (params) => {
                const { tableID, tableOrderID } = params.row;
                if (tableID === null) {
                    return 'Đơn đặt bàn';  // If tableID is null, it's an order
                } else if (tableOrderID === null) {
                    return 'Đơn đặt hàng'; // If tableOrderID is null, it's a reservation
                }
                return 'Không xác định'; // Default case
            }
        },
        {
            field: 'rating',
            headerName: 'Đánh giá',
            width: 200,
            renderCell: (params) => (
                <Rating value={params.value} readOnly precision={0.5} />
            )
        },
        {
            field: 'comment', headerName: 'Bình luận', width: 280
        },
    ];

    const rows = reviews.map((review) => ({
        id: review.serviceReviewID,
        ...review
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
                        noRowsLabel: 'Không có đánh giá trong hôm nay',
                    }}
                />
            </Paper>
        </>
    )
};

export default Reviews;