import React, { useState, useCallback, useEffect } from "react";
import useApiUrl from '../useApiUrl'
import dayjs, { Dayjs } from "dayjs";
import { Box, FormControl, Select, MenuItem, CircularProgress, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PieChart from '../Chart/PieChart';
import LineChart from "../Chart/LineChart";
import BarChart from "../Chart/BarChart";

interface SellingItem {
    menuItem: {
        menuItemID: number;
        itemName: string;
        itemImage: string;
        menuID: number;
    };
    totalQuantity: number;
}

interface Category {
    menuID: number,
    menuName: string,
}

const Report: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const currentYear = dayjs().year();
    // const defaultStart = dayjs(`${currentYear}-01-01`);
    // const defaultEnd = dayjs(`${currentYear}-12-31`);

    // const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(defaultStart);
    // const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(defaultEnd);
    const [labels, setLabels] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);
    const [reportType, setReportType] = useState<"month" | "year">("month"); // Chọn loại báo cáo
    const [month, setMonth] = useState<number>(1); // Giá trị mặc định tháng 1
    const [year, setYear] = useState<number>(currentYear); // Năm mặc định là năm hiện tại
    const [type, setType] = useState<'order' | 'tableOrder'>('order') // Trạng thái để chọn loại thống kê trạng thái
    const [orderData, setOrderData] = useState<{ successful: number; cancelled: number }>({ successful: 0, cancelled: 0 });
    const [tableOrderData, setTableOrderData] = useState<{ successful: number; cancelled: number }>({ successful: 0, cancelled: 0 });
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading
    const [pieLabels, setPieLabels] = useState<string[]>([]);
    const [pieData, setPieData] = useState<number[]>([]); // Dữ liệu Pie Chart
    const [ordersData, setOrdersData] = useState<number[]>([]);
    const [tableOrdersData, setTableOrdersData] = useState<number[]>([]);
    const [topSellingItems, setTopSellingItems] = useState<SellingItem[]>([]);
    // const [leastSellingItems, setLeastSellingItems] = useState<SellingItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchReport = useCallback(async () => {
        try {
            setIsLoading(true);
            let current: Dayjs;
            let final: Dayjs;

            // Xử lý thời gian dựa trên loại báo cáo
            if (reportType === "month") {
                current = dayjs(`${year}-${month}-01`).startOf("day");
                final = current.endOf("month");
            } else {
                current = dayjs(`${year}-01-01`).startOf("month");
                final = dayjs(`${year}-12-31`).endOf("month");
            }

            const allLabels: string[] = [];
            const allData: number[] = [];
            const allDataOrders: number[] = [];
            const allDataTableOrders: number[] = [];

            let totalSuccessfulOrder = 0;
            let totalCancelledOrder = 0;
            let totalSuccessfulTableOrder = 0;
            let totalCancelledTableOrder = 0;

            while (current.isBefore(final) || current.isSame(final, reportType === "month" ? "day" : "month")) {
                const periodStart = current.format("YYYY-MM-DD");

                const periodEnd = reportType === "month"
                    ? current.add(1, "day").format("YYYY-MM-DD") // Nếu tháng thì lặp theo ngày
                    : current.endOf("month").format("YYYY-MM-DD"); // Nếu năm thì lặp qua các tháng

                const url = `${APIURL}/getReport?startDate=${periodStart}&endDate=${periodEnd}`;
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                console.log(url);

                if (response.status === 403) {
                    localStorage.removeItem('isAuthenticated');
                    window.location.reload();
                }

                const result = await response.json();
                console.log(result);

                //Xử lý dữ liệu LineChart
                const revenue = result.reports.revenue.totalRevenue || 0;
                allLabels.push(
                    reportType === "month"
                        ? current.format("DD/MM/YYYY") // Định dạng ngày/tháng/năm nếu báo cáo theo tháng
                        : current.format("MM/YYYY")   // Định dạng tháng/năm nếu báo cáo theo năm
                );
                allData.push(revenue);

                //Xử lý dữ liệu PieChart cho đơn hàng
                if (result.reports.orders) {
                    totalSuccessfulOrder += result.reports.orders.successful || 0;
                    totalCancelledOrder += result.reports.orders.cancelled || 0;
                    allDataOrders.push(result.reports.orders.all || 0);
                }

                //Xử lý dữ liệu PieChart cho đơn bàn
                if (result.reports.tableOrders) {
                    totalSuccessfulTableOrder += result.reports.tableOrders.successful || 0;
                    totalCancelledTableOrder += result.reports.tableOrders.cancelled || 0;
                    allDataTableOrders.push(result.reports.tableOrders.all || 0);
                }

                current = reportType === "month" ? current.add(1, "day") : current.add(1, "month");
            }

            console.log(type);


            setLabels(allLabels);
            setData(allData);

            setOrdersData(allDataOrders);
            setTableOrdersData(allDataTableOrders);

            setPieLabels(["Thành công", "Hủy"])
            setOrderData({ successful: totalSuccessfulOrder, cancelled: totalCancelledOrder });
            setTableOrderData({ successful: totalSuccessfulTableOrder, cancelled: totalCancelledTableOrder });

            // setLeastSellingItems(allLeastSellingItems);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [reportType, type, year, month, APIURL]);

    const fetchTopSellingItemsForYear = useCallback(async () => {
        try {

            const allTopSellingItems: SellingItem[] = [];

            const url = `${APIURL}/getReport?startDate=${currentYear}-01-01&endDate=${currentYear}-12-31`;
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 403) {
                localStorage.removeItem('isAuthenticated');
                window.location.reload();
            }

            const result = await response.json();
            //Xử lý dữ liệu topSellingItems
            if (result.reports.topSellingItems) {
                const mappedItemsTop = result.reports.topSellingItems.map((item: SellingItem) => ({
                    menuItem: {
                        menuItemID: item.menuItem.menuItemID,
                        itemName: item.menuItem.itemName,
                        itemImage: item.menuItem.itemImage,
                        menuID: item.menuItem.menuID,
                    },
                    totalQuantity: item.totalQuantity,
                }));
                allTopSellingItems.push(...mappedItemsTop);
            }

            setTopSellingItems(allTopSellingItems);
        } catch (err) {
            console.error(err);
        }
    }, [currentYear, APIURL]);

    const fetchCategories = useCallback( async () => {
        try {
            const response = await fetch(`${APIURL}/getMenus`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data: Category[] = await response.json();
            console.log(data);
            //Hiện danh mục
            setCategories(data)

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    const handleFetch = () => {
        fetchReport();
    };

    useEffect(() => {
        fetchCategories()
        fetchTopSellingItemsForYear()
    }, [fetchTopSellingItemsForYear, fetchCategories]);

    useEffect(() => {
        // Update pie data when type changes
        const pieChartData = type === "order" ? orderData : tableOrderData;
        setPieData([pieChartData.successful, pieChartData.cancelled]);
    }, [type, orderData, tableOrderData]);

    const MenuMap = new Map(categories.map((c) => [c.menuID, c.menuName]))

    return (
        <>
            <Box className="col-xl-7 col-lg-7" sx={{ display: "flex", gap: 2, margin: "10px 0 15px 15px" }}>
                {/* Chọn loại báo cáo */}
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <Select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as "month" | "year")}
                    >
                        <MenuItem value="month">Theo tháng</MenuItem>
                        <MenuItem value="year">Theo năm</MenuItem>
                    </Select>
                </FormControl>

                {/* Chọn tháng nếu là báo cáo theo tháng */}
                {reportType === "month" && (
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <Select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                        >
                            {[...Array(12).keys()].map((m) => (
                                <MenuItem key={m + 1} value={m + 1}>
                                    Tháng {m + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Chọn năm */}
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Nút xem báo cáo */}
                <Button variant="contained" onClick={handleFetch}>
                    Xem báo cáo
                </Button>
            </Box>

            <div className="col-xl-7 col-lg-7">
                <div className="card shadow mb-4" style={{ height: '434px' }}>
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">
                            Thống kê doanh thu
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="chart-area">
                            <LineChart
                                labels={labels}
                                data={data}
                                title={reportType === "month"
                                    ? `Doanh thu tháng ${month}/${year}`
                                    : `Doanh thu năm ${year}`} />
                        </div>
                        {isLoading && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-xl-5 col-lg-7">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">
                            Thống kê trạng thái
                        </h6>
                        <FormControl variant="outlined" sx={{ minWidth: 110 }} size="small">
                            <Select
                                labelId="report-type-label"
                                value={type}
                                onChange={(e) => setType(e.target.value as 'order' | 'tableOrder')}
                            >
                                <MenuItem value="order">Đơn hàng</MenuItem>
                                <MenuItem value="tableOrder">Đơn bàn</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="card-body">
                        <div className="chart-area">
                            <PieChart labels={pieLabels} data={pieData} title="Số lượng" />
                        </div>
                        {isLoading && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-xl-7 col-lg-7">
                <div className="card shadow mb-4" style={{ height: '510px' }}>
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">
                            Thống kê Đơn
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="chart-area" style={{ marginTop: '50px' }}>
                            <BarChart labels={labels} data={[ordersData, tableOrdersData]} titles={['Đặt hàng', 'Đặt bàn']} />
                        </div>
                        {isLoading && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-xl-5 col-lg-7">
                <div className="card shadow mb-4" style={{ height: '510px' }}>
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">
                            Thống kê sản phẩm bán chạy
                        </h6>
                    </div>
                    <div className="card-body scrollable-section">
                        <TableContainer component={Paper}>
                            <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã sản phẩm</TableCell>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        {/* <TableCell>Hình ảnh</TableCell> */}
                                        <TableCell>Danh mục</TableCell>
                                        <TableCell>Đã bán</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topSellingItems.map((item, index) => (
                                        <TableRow
                                            key={`${item.menuItem.menuItemID}-${index}`}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {item.menuItem.menuItemID}
                                            </TableCell>
                                            <TableCell>{item.menuItem.itemName}</TableCell>
                                            {/* <TableCell>
                                                <img
                                                    src={`${API_UrlImage}/${item.menuItem.itemImage}`}
                                                    alt={item.menuItem.itemName}
                                                    style={{ width: "50px", height: "50px" }}
                                                />
                                            </TableCell> */}
                                            <TableCell>{MenuMap.get(item.menuItem.menuID)}</TableCell>
                                            <TableCell>{item.totalQuantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {isLoading && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Report;