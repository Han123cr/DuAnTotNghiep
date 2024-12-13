import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Routers from "./Router";

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: JSX.Element;
    isLoginPage?: boolean;
    allowedRoles?: string[]
}
const url = window.location.href;
// Tách phần đường dẫn
const path = new URL(url).pathname;
// Lấy phần đầu tiên sau dấu "/"
const admin = path.split('/')[1]; // Lấy phần đầu tiên

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
        children, 
        isLoginPage = false, 
        allowedRoles = [], // Mặc định không hạn chế nếu không truyền
    }) => {
    // Kiểm tra xem có isAuthenticated trong sessionStorage
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const location = useLocation();

    if (storedAuth) {
        //Nếu đã đăng nhập mà truy cập vào trang login
        if (isLoginPage) {
            //Chuyển hướng đến trang chính
            return <Navigate to={`/${admin}`} replace />;
        }

        // Nếu vai trò không nằm trong danh sách cho phép
        if (allowedRoles.length > 0 && !allowedRoles.includes(admin)) {
            return <Navigate to={Routers.ADMIN_TABLE} replace state={{ from: location }} />;
        }

    } else {
        //Nếu chưa đăng nhập và không phải trang login
        if (!isLoginPage) {
            //Chuyển hướng trang login
            return <Navigate to="/" replace state={{ from: location }} />;
        }
    };
    return children;
};

export default ProtectedRoute;
