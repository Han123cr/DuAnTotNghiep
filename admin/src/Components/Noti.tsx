import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useApiUrl from './useApiUrl'
import { useNavigate } from 'react-router-dom';
import Routers from './Router';

interface NotiData {
    noti: {
        order: number;
        orderTable: number;
        serviceReview: number;
    }
    status: {
        order: number;
        orderTable: number;
        table: number;
    };
}

const NotificationDropdown: React.FC = () => {

    const navigate = useNavigate()

    const [notifications, setNotifications] = useState<NotiData | null>(null);
    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    useEffect(() => {

        // Lấy thông báo từ localStorage khi component mount
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            setNotifications(JSON.parse(storedNotifications));
        }

        let isMounted = true; //Kiểm tra component còn được gắn hay không

        const fetchNoti = async () => {

            try {
                console.log('try');

                const response = await fetch(`${APIURL}/getNoti`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 204) {
                    console.log("Không có thông báo");
                } else {
                    const data = await response.json();

                    if (isMounted) {
                        const newNotifications = data.data;
                        setNotifications((prev) => {
                            const updateNoti = {
                                noti: {
                                    order: prev?.noti.order + newNotifications.noti.order || newNotifications.noti.order,
                                    orderTable: prev?.noti.orderTable + newNotifications.noti.orderTable || newNotifications.noti.orderTable,
                                    serviceReview: prev?.noti.serviceReview + newNotifications.noti.serviceReview || newNotifications.noti.serviceReview,
                                },
                                status: {
                                    ...prev?.status,
                                    ...newNotifications.status, // Cập nhật trạng thái nếu cần
                                },
                            };
                            // Lưu thông báo mới vào localStorage
                            localStorage.setItem('notifications', JSON.stringify(updateNoti));
                            return updateNoti;
                        });
                    }
                }
            } catch (err) {
                console.log('catch');

                console.error(err);
            } finally {
                if (isMounted) {
                    setTimeout(fetchNoti, 1000); // Lặp lại sau 60 giây
                }
                console.log('finally');

            }
        };
        fetchNoti();

        // Dọn dẹp khi component bị unmount
        return () => {
            isMounted = false;
        };
    }, [APIURL]);

    //Hàm tắt thông báo
    const handleNotificationClick = (type: 'order' | 'orderTable' | 'serviceReview') => {
        if (!notifications) return;

        // Giảm số lượng thông báo của loại tương ứng
        setNotifications((prev) => {
            if (!prev) return null;

            // Điều hướng đến trang tương ứng
            if (type === 'order') {
                navigate(Routers.ADMIN_ORDERS); // Chuyển đến trang đơn hàng
            } else if (type === 'orderTable') {
                navigate(Routers.ADMIN_TABLEORDERS); // Chuyển đến trang đặt bàn
            } else if (type === 'serviceReview') {
                navigate(Routers.ADMIN_REVIEWS)
            }


            // Xóa thông báo khỏi localStorage
            const updatedNoti = {
                ...prev,
                noti: {
                    ...prev.noti,
                    [type]: 0
                },
            };

            // Cập nhật lại localStorage
            localStorage.setItem('notifications', JSON.stringify(updatedNoti));

            return updatedNoti;
        });
    };

    const renderNoti = () => {
        if (!notifications) return <p className="text-center">Không có thông báo mới</p>

        const alerts = [];
        // Render thông báo cho đơn hàng mới
        if (notifications.noti.order > 0) {
            alerts.push(
                <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    key="order"
                    onClick={() => handleNotificationClick('order')}
                >
                    <div className="mr-3">
                        <div className="icon-circle bg-primary">
                            <i className="fas fa-shopping-cart text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">Hôm nay</div>
                        <span className="font-weight-bold">
                            Bạn đang có {notifications.noti.order} đơn hàng mới!
                        </span>
                    </div>
                </a>
            );
        }

        // Kiểm tra và render thông báo đơn đặt bàn mới
        if (notifications.noti.orderTable > 0) {
            alerts.push(
                <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    key="orderTable"
                    onClick={() => handleNotificationClick('orderTable')}
                >
                    <div className="mr-3">
                        <div className="icon-circle bg-success">
                            <i className="fas fa-utensils text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">Hôm nay</div>
                        <span className="font-weight-bold">
                            Bạn đang có {notifications.noti.orderTable} đơn đặt bàn mới!
                        </span>
                    </div>
                </a>
            );
        }

        // Render thông báo cho đơn hàng mới
        if (notifications.noti.serviceReview > 0) {
            alerts.push(
                <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    key="serviceReview"
                    onClick={() => handleNotificationClick('serviceReview')}
                >
                    <div className="mr-3">
                        <div className="icon-circle bg-warning">
                            <i className="fa-solid fa-star"></i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">Hôm nay</div>
                        <span className="font-weight-bold">
                            Bạn đang có {notifications.noti.serviceReview} đánh giá mới!
                        </span>
                    </div>
                </a>
            );
        }

        return alerts.length > 0 ? alerts : <p className="text-center">Không có thông báo mới</p>;
    };

    return (
        <li className="nav-item dropdown no-arrow mx-1">
            <a
                className="nav-link dropdown-toggle"
                href="#"
                id="alertsDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >
                <NotificationsIcon sx={{ fontSize: 28 }} />
                {/* Hiển thị tổng số thông báo */}
                {notifications && (notifications.noti.order + notifications.noti.orderTable + notifications.noti.serviceReview > 0) && (
                    <span className="badge badge-danger badge-counter">
                        {notifications.noti.order + notifications.noti.orderTable + notifications.noti.serviceReview}
                    </span>
                )}
            </a>
            {/* Dropdown - Alerts */}
            <div
                className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="alertsDropdown"
            >
                <h6 className="dropdown-header">Trung tâm thông báo</h6>
                {/* Render danh sách thông báo */}
                {renderNoti()}
                <a
                    className="dropdown-item text-center small text-gray-500"
                    href="#"
                >
                    Xem tất cả thông báo
                </a>
            </div>
        </li>
    );
};

export default NotificationDropdown;