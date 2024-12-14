import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginWithLink: React.FC = () => {
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const verificationCode = urlParams.get('verification_code');
        const loginName = urlParams.get('loginName');

        if (verificationCode && loginName) {
            const data = {
                verification_code: verificationCode,
                loginName: loginName,
            };

            fetch('https://api.savory.website/admin/loginWithLink', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Tải thất bạii')
                    }
                    return response.json();
                })
                .then((data) => {
                    setMessage('Đăng nhập thành công! Đang chuyển hướng...');
                    setOpen(true);
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("role", "admin");
                    //Điều hướng trang
                    setTimeout(() => {
                        const isAuthenticated = localStorage.getItem("isAuthenticated");
                        console.log(isAuthenticated);


                        if (isAuthenticated === "true") {
                            navigate("/admin");
                        } else {
                            setMessage("Đã xảy ra lỗi khi xác thực.");
                        }
                    }, 1000);
                    console.log('Success:', data);
                })
                .catch((error) => {
                    setMessage('Đăng nhập thất bại!');
                    setOpen(true);
                    console.error('Error:', error);
                })
        }
    }, [navigate]);
    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity={message.includes('thất bại') ? 'error' : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default LoginWithLink;