import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: JSX.Element;
    isLoginPage?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isLoginPage = false }) => {
    // Kiểm tra xem có isAuthenticated trong sessionStorage
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const location = useLocation();

    if (storedAuth) {
        //Nếu đã đăng nhập mà truy cập vào trang login
        if(isLoginPage){
            //Chuyển hướng đến trang chính
            return <Navigate to="/admin" replace />;
        }
    }else{
        //Nếu chưa đăng nhập và không phải trang login
        if(!isLoginPage){
            //Chuyển hướng trang login
            return <Navigate to="/admin/login" replace state={{ from: location }} />;
        }
    };
    return children;
};

export default ProtectedRoute;
