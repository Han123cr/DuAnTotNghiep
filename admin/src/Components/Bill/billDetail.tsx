import React, { useState } from "react";
import useApiUrl from "../useApiUrl";
import { Box, CircularProgress, Dialog, DialogContent, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

interface BillDetail {
    tableBillDetailID: number;
    menuItemName: string;
    itemImage: string;
    quantity: number;
    total: string;
}

interface Bill {
    totalAmount: string;
    totalAfterVoucher: string;
    deposit: string;
    timeOut: string;
    timeIn: string;
    table: string;
    billDetails: BillDetail[];
}

interface BillDetailsDialogProps {
    tableBillID: string | null
}

const BillDetail: React.FC<BillDetailsDialogProps> = ({ tableBillID }) => {

    const [billDetail, setBillDetail] = useState<Bill | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openBillDialog, setOpenBillDialog] = useState(false);

    const { APIURL } = useApiUrl();

    const handleBillDetail = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${APIURL}/getBill/${tableBillID}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) throw new Error("Failed to fetch table bill details.");

            const data = await response.json();

            setBillDetail(data);
            setOpenBillDialog(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false)
        }
    };

    const handleClose = () => {
        setOpenBillDialog(false);
    };

    return (
        <>
            <button
                className="btn btn-secondary btn-icon-split"
                onClick={handleBillDetail}
                disabled={isLoading}
            >
                <span className="icon text-white">
                    {isLoading ? <CircularProgress size={15} className="text-white" /> :
                        <i className="fa-regular fa-eye"></i>
                    }
                </span>
                <span className="text">Xem chi tiết</span>
            </button>

            {/* Dialog hiển thị chi tiết đơn hàng */}
            <Dialog open={openBillDialog} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogContent>
                    {billDetail ? (
                        <>
                            {/* Thông tin người nhận */}
                            <Box mb={2}>
                                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>Thông Tin Hóa Đơn</Typography>
                                <Divider />
                                <Box my={3}>
                                    <Typography><strong>Số bàn:</strong> {billDetail.table}</Typography>
                                    <Typography><strong>Thời gian vào:</strong> {billDetail.timeIn}</Typography>
                                    <Typography><strong>Thời gian ra:</strong> {billDetail.timeOut}</Typography>
                                    <Typography><strong>Tổng tiền:</strong> {Number(billDetail.totalAmount).toLocaleString()}</Typography>
                                    <Typography><strong>Đặt cọc:</strong> {Number(billDetail.deposit).toLocaleString()}</Typography>
                                </Box>
                            </Box>

                            {/* Bảng chi tiết các món */}
                            <Box>
                                <Typography variant="h6" gutterBottom>Chi Tiết Món Ăn</Typography>
                                <Divider />
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Tên Món</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            {/* <TableCell>Giá</TableCell> */}
                                            <TableCell>Tổng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {billDetail.billDetails.map((item, index) => (
                                            <TableRow key={item.tableBillDetailID}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.menuItemName}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                {/* <TableCell>{item.quantity}</TableCell> */}
                                                {/* <TableCell>{Number(item.price).toLocaleString()}</TableCell> */}
                                                <TableCell>{Number(item.total).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </>
                    ) : (
                        <Box textAlign="center">
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default BillDetail;