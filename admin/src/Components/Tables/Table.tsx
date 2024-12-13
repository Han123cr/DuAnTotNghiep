import { useCallback, useEffect, useState } from "react";
import useApiUrl from '../useApiUrl'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableOrderDetailsDialog from "./TableDetail";

interface TableOrder {
    tableOrderID: number;
    createdAt: string;
    arrivalTime: string;
    numberOfPeople: number;
    notes: string;
    bookerName: string;
    bookerPhoneNumber: string;
    tableOrderStatus: string;
    deposit: string; // Hoặc number tùy thuộc vào cách bạn xử lý
    transactionCode: string;
    reminderSent: number; // Hoặc boolean
    customerID: number;
    tableID: string;
    paymentMethodID: number;
    voucherID: number | null;
    tableStatus: string;
}

const Tables: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl
    const navigate = useNavigate();
    const role = localStorage.getItem('role'); // Lấy role từ localStorage

    const [tables, setTables] = useState<TableOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    // const [selectedBranch, setSelectedBranch] = useState<string>('svr1');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTableID, setSelectedTableID] = useState<string | null>(null);
    const [tableDetails, setTableDetails] = useState<TableOrder[]>([]); // Thay đổi kiểu theo cấu trúc dữ liệu chi tiết bàn
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Thông điệp thông báo

    const fetchTable = useCallback(async () => {
        const response = await fetch(`${APIURL}/getTables`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
        const datas = await response.json();
        const data = datas.tables;

        // Sắp xếp tableID theo thứ tự từ thấp đến cao
        const sortedData = data.sort((a: TableOrder, b: TableOrder) => {
            return a.tableID.localeCompare(b.tableID, undefined, { numeric: true });
        });
        console.log(data);

        setTables(sortedData)
    }, [APIURL]);

    useEffect(() => {
        fetchTable()
    }, [fetchTable])

    const handleTableClick = async (tableID: string, status: string) => {
        if (status === "open") {
            try {
                const response = await fetch(`${APIURL}/getTables/${tableID}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                const datas = await response.json();
                const data = datas.table.table_orders;
                console.log(data);
                setTableDetails(data)
                setSelectedTableID(tableID);
                setOpenDialog(true)
            } catch (err) {
                console.error(err);
            }
        } else if (status === 'close') {
            // Nếu trạng thái là "close", gọi API GET bàn và điều hướng
            const response = await fetch(`${APIURL}/getTables/${tableID}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể lấy thông tin bàn');
            }

            const datas = await response.json();
            console.log('Dữ liệu bàn:', datas);

            setAlertMessage(`Đang chuyển hướng tới bàn ${tableID}...`);
            setOpenAlert(true);

            setTimeout(() => {
                navigate(`/${role}/tableproduct/${tableID}`);
            }, 2000);
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTableID(null);
    }

    const handleConfirmOpenTable = async () => {
        if (selectedTableID && tableDetails.length > 0) {
            console.log('tableID:', selectedTableID);
            console.log('tableOrderID:', tableDetails[0].tableOrderID);
            try {
                const response = await fetch(`${APIURL}/createBill`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        tableID: selectedTableID,
                        tableOrderID: tableDetails[0].tableOrderID
                    }),
                });

                if (!response.ok) {
                    throw new Error('Thất bại khi tạo bàn');
                }
                const result = await response.json();
                console.log('Tạo bàn: ', result);
                setAlertMessage(`Đã vào bàn ${selectedTableID}, Đang chuyển hướng trang gọi món..`);
                setOpenAlert(true);

                setTimeout(() => {
                    navigate(`/${role}/tableproduct/${selectedTableID}`)
                }, 3000);
            } catch (err) {
                console.error(err);
            }
        } else if (selectedTableID) {
            console.log('tableID:', selectedTableID);
            try {
                const response = await fetch(`${APIURL}/createBill`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        tableID: selectedTableID,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Thất bại khi tạo bàn');
                }
                const result = await response.json();
                console.log('Tạo bàn: ', result.billID);
                setAlertMessage(`Đã vào bàn ${selectedTableID}, Đang chuyển hướng trang gọi món..`);
                setOpenAlert(true);
                setTimeout(() => {
                    navigate(`/${role}/tableproduct/${selectedTableID}`)
                }, 3000);

            } catch (err) {
                console.error(err);
            }
        }
        handleCloseDialog();
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const displayedTables = tables.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            {/* <FormControl sx={{ bottom: '2px', marginBottom: '10px', minWidth: 130 }} size="small">
                <InputLabel id="demo-simple-select-label">Cơ sở</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedBranch}
                    label="Branch"
                    onChange={handleBranchChange}
                >
                    <MenuItem value='svr1'>Savory I</MenuItem>
                    <MenuItem value='svr2'>Savory II</MenuItem>
                </Select>
            </FormControl> */}

            <div style={{ marginTop: '20px' }} className="row">
                {displayedTables.map((table) => (
                    <div className="col-xl-2 col-lg-4">
                        <div className="card shadow mb-4 table-card">
                            <div
                                style={{
                                    background: table.tableStatus === 'open' ? '#0288D1' :
                                        table.tableStatus === 'close' ? '#D32F2F' :
                                            "#FF6600"
                                }}
                                className="card-body table-content"
                            >
                                <div className="chart-area1 text-white">
                                    <p>{table.tableID}</p>
                                </div>
                            </div>
                            <div className="hover-icons">
                                <i className="fa-solid fa-right-to-bracket" onClick={() => handleTableClick(table.tableID, table.tableStatus)}></i>
                                <TableOrderDetailsDialog tableID={table.tableID}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                count={Math.ceil(tables.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle>Xác nhận mở bàn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có muốn mở bàn "{selectedTableID}" không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmOpenTable} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openAlert} autoHideDuration={5000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
                    {alertMessage} {/* Hiển thị thông điệp tương ứng */}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Tables;