import React, { useCallback, useEffect, useState } from "react";
import useApiUrl from "../useApiUrl"
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

interface MonthlyReport {
    customers: number;
    menuItems: number;
    totalRevenue: number
}

interface DailyReport {
    totalRevenue: number;
}

const ReportDefault: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [monthlyreports, setMonthlyReports] = useState<MonthlyReport>({
        customers: 0,
        menuItems: 0,
        totalRevenue: 0,
    });

    const [dailyReport, setDailyReport] = useState<DailyReport>({
        totalRevenue: 0,
    });


    const currentDate = dayjs();

    const defaultStartDate = currentDate.startOf('month').format('YYYY-MM-DD');
    const defaultEndDate = currentDate.endOf('month').format('YYYY-MM-DD');
    const todayStartDate = currentDate.startOf('day').format('YYYY-MM-DD'); // 00:00 hôm nay
    const todayEndDate = currentDate.add(1, 'day').endOf('day').format('YYYY-MM-DD'); // 23:59 hôm nay

    const fetchReportDefault = useCallback( async (start: string, end: string, type: "monthly" | "daily") => {
        try {
            const url = `${APIURL}/getReport?startDate=${start}&endDate=${end}`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();

            console.log(data.reports);
            console.log(url);

            if(response.status === 403){
                localStorage.removeItem('isAuthenticated');
                window.location.reload();
            }

            if (type === "monthly") {
                setMonthlyReports({...data.reports, totalRevenue: data.reports.revenue.totalRevenue})
            } else if (type === "daily") {
                setDailyReport(data.reports.revenue)
            }
        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    useEffect(() => {
        // Gọi API khi component được mount với dữ liệu tháng hiện tại
        fetchReportDefault(defaultStartDate, defaultEndDate, "monthly");
        fetchReportDefault(todayStartDate, todayEndDate, "daily");
    }, [defaultStartDate, defaultEndDate, todayStartDate, todayEndDate, fetchReportDefault]);

    return (
        <>
            <div className="col-xl-3 col-md-6 mb-4 mb-6">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="col-auto fixicon">
                        <i className="fas fa-users fa-2x text-gray-300" />
                    </div>
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                    TỔNG KHÁCH HÀNG
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    {monthlyreports ? `${monthlyreports.customers}` : 0} khách hàng
                                </div>
                                <hr />
                                <div className="text-s text-muted">
                                    Tổng số khách hàng được quản lý
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4 mb-6">
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="col-auto fixicon">
                        <i className="fas fa-database fa-2x text-gray-300" />
                    </div>
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                    TỔNG SỐ SẢN PHẨM
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    {monthlyreports ? `${monthlyreports.menuItems}` : 0} sản phẩm
                                </div>
                                <hr />
                                <div className="text-s text-muted">
                                    Tổng số sản phẩm được quản lý.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Earnings (Monthly) Card Example */}
            <div className="col-xl-3 col-md-6 mb-4 mb-6">
                <div className="card border-left-secondary shadow h-100 py-2">
                    <div className="col-auto fixicon">
                        <FontAwesomeIcon className="fa-2x" icon={faBagShopping} style={{ color: '#FF8B07' }} />
                    </div>
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                    TỔNG DANH THU THEO NGÀY
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {dailyReport ? `${dailyReport.totalRevenue.toLocaleString("vi-VN")}` : 0} tổng tiền
                                </div>
                                <hr />
                                <div className="text-s text-muted">
                                    Tổng số danh thu trong ngày.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pending Requests Card Example */}
            <div className="col-xl-3 col-md-6 mb-4 mb-6">
                <div className="card border-left-danger shadow h-100 py-2">
                    <div className="col-auto fixicon">
                        <FontAwesomeIcon className='fa-2x' icon={faCircleExclamation} style={{ color: '#DE2222' }} />
                    </div>
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                TỔNG DANH THU THEO THÁNG
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    {monthlyreports ? `${ new Intl.NumberFormat("vi-VN").format(Number(monthlyreports.totalRevenue))}` : 0} tổng tiền
                                </div>
                                <hr />
                                <div className="text-s text-muted">
                                Tổng số danh thu trong tháng.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportDefault;