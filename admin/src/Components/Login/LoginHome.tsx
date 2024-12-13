import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginHome: React.FC = () => {
    const navigate = useNavigate()
    const [role, setRole] = useState("");

    const handleRoleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const handleLogin = () => {
        switch (role) {
            case "admin":
                navigate("/admin/login");
                break;
            case "manager":
                navigate("/manage/login");
                break;
            case "staff":
                navigate("/staff/login");
                break;
            default:
                alert("Vui lòng chọn vai trò trước khi đăng nhập!");
                break;
        }
    };

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
                        <Box sx={{ mb: 3 }}>
                            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                                Đăng nhập với vai trò:
                            </Typography>
                            <FormControl sx={{width: '300px', marginTop: '15px'}}>
                                <InputLabel id="role-select-label">Vai trò</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    id="role-select"
                                    value={role}
                                    onChange={handleRoleChange}
                                    label="Chọn vai trò"
                                >
                                    <MenuItem value="admin">Quản trị</MenuItem>
                                    <MenuItem value="manager">Quản lý</MenuItem>
                                    <MenuItem value="staff">Nhân viên</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                                disabled={!role}
                            >
                                Đăng nhập
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>

    )
};

export default LoginHome;
