import React, { useState } from "react";
import { useLogin } from "../../Services/AuthServices";
import { Alert, Box, Button, Card, CardContent, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const AdminFormLogin: React.FC = () => {
    const navigate = useNavigate()
    const { handleLoginByName, handleLoginByPassWord } = useLogin(); // Use the custom hook

    const [loginName, setLoginName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [step, setStep] = useState<number>(1);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

    const handleLoginByNameSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await handleLoginByName(loginName);
            if(res.status === 200){
                setAlertMessage('Đã gửi mã xác thực');
                setOpenAlert(true);
            }
            setStep(2);
        } catch (err) {
            console.error(err);
        }
    }

    const handlePasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await handleLoginByPassWord(password);
            if(res.status === 200){
                setAlertMessage('Đăng nhập thành công');
                setOpenAlert(true);
            }
            localStorage.setItem("isAuthenticated", "true");
            //Điều hướng trang
            setTimeout(() => {
                const isAuthenticated = localStorage.getItem("isAuthenticated");
                console.log(isAuthenticated);
                

                if (isAuthenticated === "true") {
                    navigate("/admin");
                } else {
                    setAlertMessage("Đã xảy ra lỗi khi xác thực.");
                }
            }, 1000);
        } catch (err) {
            console.error(err);
        }
    };

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
            <Box sx={{ border: '1px solid #000' }} className='content-center'>
                <Card sx={{ zIndex: 1 }}>
                    <CardContent sx={{ padding: theme => `${theme.spacing(5, 9, 1)} !important` }}>
                        <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                                className="sidebar-brand d-flex align-items-center justify-content-center"
                            >
                                <div className="sidebar-brand-text1 mx-3">Savory</div>
                            </div>
                        </Box>
                        <Box sx={{ mb: 6 }}>
                            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                                Chào mừng trở lại Savory! 👋🏻
                            </Typography>
                            <Typography variant='body2'>Đăng nhập để vào trang quản lý</Typography>
                        </Box>
                        {step === 1 && (
                            <>
                                <div style={{ display: 'flex' }}>
                                    <form onSubmit={handleLoginByNameSubmit}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Email"
                                            value={loginName}
                                            variant="outlined"
                                            onChange={(e) => setLoginName(e.target.value)}
                                            sx={{ marginBottom: 4, width: 300 }}
                                        />
                                        <Button type="submit" sx={{ marginLeft: '10px', height: '55px' }} variant="contained">
                                            <i style={{ fontSize: '20px' }} className="fa-solid fa-paper-plane"></i>
                                        </Button>
                                    </form>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <form onSubmit={handlePasswordSubmit}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='auth-login-password'>Mã xác thực</InputLabel>
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
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Mã xác thực"
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size='large'
                                    variant='contained'
                                    sx={{ margin: '15px 0px 7px 0px' }}
                                >
                                    Login
                                </Button>
                            </form>
                        )}
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

export default AdminFormLogin;
