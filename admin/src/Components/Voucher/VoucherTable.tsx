import { Button, Chip, Paper } from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid"
import useApiUrl from '../useApiUrl'
import React, { useCallback, useEffect, useState } from "react";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Routers from "../Router";
// import Swal from "sweetalert2";

interface Voucher {
    voucherID: number,
    code: string,
    discountType: string,
    reduce: number,
    type: string,
    startDate: string
    endDate: string
    content: string
    image: string | null
    status: string
    usageLimit: number
}

const VoucherTable: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const navigate = useNavigate();

    const fetchVouchers = useCallback(async () => {
        try {
            const response = await fetch(`${APIURL}/getVoucher`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();
            console.log(data);
            //Hiện sản phẩm
            setVouchers(data)

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    const handleAddVoucher = () => {
        navigate(`${Routers.ADMIN_ADDVOUCHER}`)
    }

    const handleEditVoucher = (voucherID: number) => {
        navigate(`${Routers.ADMIN_EDITVOUCHER}/${voucherID}`)
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 70 },
        { field: 'code', headerName: 'Mã ưu đãi', width: 150 },
        { 
            field: 'discountType', 
            headerName: 'Phương thức', 
            width: 150 ,
            renderCell: (params) => params.value === 'percent' ? 'Phần trăm' : 'Tiền mặt'
        },
        { 
            field: 'reduce', 
            headerName: 'Giá giảm', 
            width: 100,
            renderCell: (params) => (
                params.row.discountType === 'percent'
                ? `${params.value}%`
                : params.value
            )
        },
        { 
            field: 'type', 
            headerName: 'Loại giảm giá', 
            width: 150,
            renderCell: (params) => params.value === 'order' ? 'Đặt hàng' : 'Đặt bàn'
        },
        { field: 'startDate', headerName: 'Ngày bắt đầu', width: 150 },
        { field: 'endDate', headerName: 'Ngày kết thúc', width: 150 },
        {
            field: 'image',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => (
                params.value ? <img src={params.value} alt="" width="60" /> : null
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'active' ? 'Active' : 'Blocked'}
                    color={params.value === 'active' ? 'success' : 'warning'}
                    sx={{ width: 80 }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Chức năng',
            width: 120,
            renderCell: (params) => (
                <button
                    className="btn btn-primary btn-sm edit"
                    type="button"
                    title="Sửa ưu đãi"
                    onClick={() => handleEditVoucher(params.row.voucherID)}
                >
                    <i className="fas fa-edit" />
                </button>
            )
        }
    ];

    const rows = vouchers.map((voucher, index) => ({
        id: index + 1,
        ...voucher
    }));

    return (
        <>
            <div className="col-sm-3">
                <Button variant="contained" disableElevation sx={{ marginBottom: '10px' }} onClick={handleAddVoucher}>
                    <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faPlus} />Thêm ưu đãi
                </Button>
            </div>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    sx={{ border: 0 }}
                />
            </Paper>
        </>
    )
};

export default VoucherTable;
