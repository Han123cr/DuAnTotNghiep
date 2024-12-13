import React, { useState } from "react";
import { Alert, Box, Button, Card, CardContent, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useApiUrl from "../useApiUrl";
import { useNavigate } from 'react-router-dom';

const LoginSAM: React.FC = () => {
    const { APIURL } = useApiUrl();
    const url = window.location.href;
    // Tách phần đường dẫn
    const path = new URL(url).pathname;
    // Lấy phần đầu tiên sau dấu "/"
    const admin = path.split('/')[1]; // Lấy phần đầu tiên

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginName, setLoginName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${APIURL}/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loginName, password }),
                credentials: 'include',
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đăng nhập thất bại');
            }

            if (response.status === 200) {
                setAlertMessage('Đăng nhập thành công');
                setOpenAlert(true);
            }

            const data = await response.json();
            console.log(data.message); // In thông báo thành công từ backend

            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("role", data.role);

            setTimeout(() => {
                const isAuthenticated = localStorage.getItem("isAuthenticated");
                console.log(isAuthenticated);
                if (isAuthenticated === "true") {
                    navigate(`/${admin}`);
                    window.location.reload()
                } else {
                    setAlertMessage("Đã xảy ra lỗi khi xác thực.");
                }
            }, 3000);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Box sx={{ boxShadow: 4 }} className='content-center'>
                <Card sx={{ zIndex: 1 }}>
                    <CardContent sx={{ padding: theme => `${theme.spacing(5, 9, 1)} !important` }}>
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                                className="sidebar-brand d-flex align-items-center justify-content-center"
                            >
                                <div className="sidebar-brand-text1 mx-3">Savory</div>
                            </div>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                                Chào mừng trở lại Savory! 👋🏻
                            </Typography>
                            <Typography variant='body2'>Đăng nhập để vào trang chính</Typography>
                        </Box>
                        <form onSubmit={handleLogin}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Email / Số điện thoại"
                                    value={loginName}
                                    variant="outlined"
                                    onChange={(e) => setLoginName(e.target.value)}
                                    sx={{ marginBottom: 4 }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='auth-login-password'>Mật khẩu</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword ? 'hide the password' : 'display the password'
                                                    }
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Mật khẩu"
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size='large'
                                    variant='contained'
                                    sx={{ margin: '15px 0px 7px 0px' }}
                                >
                                    Đăng nhập
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>

            <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
                    {alertMessage} {/* Hiển thị thông điệp tương ứng */}
                </Alert>
            </Snackbar>
        </>
    )
};

export default LoginSAM;
