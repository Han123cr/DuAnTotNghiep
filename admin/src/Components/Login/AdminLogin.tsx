import React, { useState } from "react";
import { loginByName, loginByPassword } from "../../Services/AuthServices";
import { Box, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, styled, TextField, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from "react-router-dom";

const AdminFormLogin: React.FC = () => {
    const [loginName, setLoginName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [step, setStep] = useState<number>(1);
    const [message, setMessage] = useState<string>('');

    const handleLoginByNameSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await loginByName(loginName);
            setMessage(res.message);
            setStep(2);
        } catch (err) {
            console.error(err);
        }
    }

    const handlePasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await loginByPassword(password);
            setMessage(res.message);
            //Điều hướng trang
        } catch (err) {
            console.error(err);
        }
    };

    const LinkStyled = styled('a')(({ theme }) => ({
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: theme.palette.primary.main
    }))

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
                        {message && <p>{message}</p>}
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
                                    <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
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
                                        label="Password"
                                    />
                                </FormControl>

                                <Box
                                    sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
                                >
                                    <FormControlLabel control={<Checkbox />} label='Remember Me' />
                                    <Link to='/'>
                                        <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
                                    </Link>
                                </Box>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size='large'
                                    variant='contained'
                                    sx={{ marginBottom: 7 }}
                                >
                                    Login
                                </Button>
                            </form>
                        )}



                    </CardContent>
                </Card>
            </Box>
        </>

    )
};

export default AdminFormLogin;
