// import { TextField } from "@mui/material";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, SnackbarCloseReason, TextField, Typography } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_Url } from "../../../tsconfig.json"
import { useNavigate } from "react-router-dom";
import Routers from "../Router";

const AddVoucher = () => {
    const [open, setOpen] = React.useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string>('');
    const [discountType, setDiscountType] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [code, setCode] = useState('');
    const [minimumPrice, setMinimumPrice] = useState('');
    const [reducePrice, setReducePrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [imageSrc, setImageSrc] = useState<string>('');
    const reactQuillReff = useRef<ReactQuill>(null);

    const navigate = useNavigate();

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setSuccessOpen(false);
    };

    const handleSubmit = async () => {
        const formData = {
            code,
            title,
            content,
            discountType,
            minimum: minimumPrice,
            reduce: reducePrice,
            type,
            startDate,
            endDate,
            status,
            usageLimit,
            image: imageSrc,
        };

        try {
            const response = await fetch(`${API_Url}/createVoucher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log('Tạo ưu đãi thành công');
                console.log(formData);
                setSuccessOpen(true);

                setTimeout(() => {
                    navigate(`${Routers.ADMIN_VOUCHER}`);
                }, 3000)

            } else {
                console.error('Tạo ưu đãi thất bại');
                console.log(formData);

            }

        } catch (err) {
            console.error(err);
        }
    }


    const handleChange = (value: string) => setContent(value);

    const handleChangeType = (event: SelectChangeEvent) => {
        setType(event.target.value as string)
    }

    const handleChangeStatus = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    }

    const imageHandle = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const file = input.files[0];
                const url = await uploadToCloudinary(file);
                const quill = reactQuillReff.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, "image", url);
                        const img = quill.root.querySelector(`img[src="${url}"]`);
                        if (img) {
                            img.classList.add('custom-image'); // Apply your CSS class
                        }

                    }
                }
            }
        }
    }, [])

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_upload_preset");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/dqssd2v7d/image/upload`,
            { method: "POST", body: formData }
        );

        const data = await res.json();
        const url = data.url;

        return url;
    }

    //Khi upload ảnh thì sẽ hiện tên file ảnh và hiện ảnh
    const handFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = await uploadToCloudinary(file)
            setImageSrc(url)
        }
    };

    //Nếu discountType là persent thì chỉ được nhập dưới 100
    const handleReducePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (discountType === 'percent') {
            const numericValue = parseInt(value);
            if (numericValue < 0 || numericValue > 100) {
                // alert('hihi')
                setOpen(true);
                return;
            }
            setReducePrice(value);
        }
    }

    return (
        <>
            <Button
                sx={{ marginBottom: '10px', left: '860px' }}
                variant="contained"
                onClick={handleSubmit}
            >
                Thêm ưu đãi
            </Button>
            <div className="row">
                <div className="col-xl-12 col-lg-7">
                    <div className="card shadow mb-4">
                        <div className="card-body voucher1">
                            <div className="chart-area">
                                <Typography sx={{ color: '#000' }} variant="h6">Tiêu đề</Typography>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    value={title}
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <ReactQuill
                                    style={{ marginTop: '20px', height: '200px' }}
                                    ref={reactQuillReff}
                                    theme="snow"
                                    value={content}
                                    onChange={handleChange}
                                    modules={{
                                        toolbar: {
                                            container: [
                                                [{ header: "1" }, { header: "2" }, { font: [] }],
                                                [{ size: [] }],
                                                ["bold", "italic", "underline", "strike", "blockquote"],
                                                [
                                                    { list: "ordered" },
                                                    { list: "bullet" },
                                                    { indent: "-1" },
                                                    { indent: "+1" },
                                                ],
                                                ["link", "image", "video"],
                                                ["code-block"],
                                                ["clean"],
                                            ],
                                            handlers: {
                                                image: imageHandle,
                                            }
                                        },
                                        clipboard: {
                                            matchVisual: false,
                                        },
                                    }}
                                    formats={[
                                        "header",
                                        "font",
                                        "size",
                                        "bold",
                                        "italic",
                                        "underline",
                                        "strike",
                                        "blockquote",
                                        "list",
                                        "bullet",
                                        "indent",
                                        "link",
                                        "image",
                                        "video",
                                        "code-block",
                                    ]}
                                    placeholder="nội dung..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Area Chart */}
                <div className="col-xl-8 col-lg-7">
                    <div className="card shadow mb-4">
                        {/* Card Header - Dropdown */}
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">
                                Thông tin ưu đãi
                            </h6>
                        </div>
                        {/* Card Body */}
                        <div className="voucher2">
                            <div className="chart-area">
                                <TextField
                                    fullWidth
                                    id="standard-basic"
                                    label="Mã giảm giá"
                                    variant="standard"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <FormControl variant="standard" sx={{ marginTop: '15px' }} fullWidth>
                                    <InputLabel id="demo-simple-select-label">Phương thức giảm giá</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={discountType}
                                        label="Phương thức giảm giá"
                                        onChange={(e) => setDiscountType(e.target.value)}
                                    >
                                        <MenuItem value="cash">Tiền mặt</MenuItem>
                                        <MenuItem value="percent">Phần trăm</MenuItem>
                                    </Select>
                                </FormControl>
                                <div style={{ display: 'flex', marginTop: '15px' }}>
                                    <TextField
                                        sx={{ width: '280px' }}
                                        id="standard-basic"
                                        label="Giá chi tối thiểu"
                                        variant="standard"
                                        value={minimumPrice}
                                        onChange={(e) => setMinimumPrice(e.target.value)}
                                    />
                                    <TextField
                                        sx={{ width: '280px', marginLeft: '45px' }}
                                        id="standard-basic"
                                        label={discountType === 'cash' ? 'Giá giảm' : 'Phần trăm giảm'}
                                        variant="standard"
                                        value={reducePrice}
                                        onChange={handleReducePriceChange}
                                    />
                                </div>
                                <div style={{ display: 'flex', marginTop: '15px' }}>
                                    <TextField
                                        sx={{ width: '280px' }}
                                        type="date"
                                        id="standard-basic"
                                        label="Ngày bắt đầu"
                                        variant="standard"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        sx={{ width: '280px', marginLeft: '45px' }}
                                        type="date"
                                        id="standard-basic"
                                        label="Ngày kết thúc"
                                        variant="standard"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </div>
                                <div style={{ display: 'flex', marginTop: '15px' }}>
                                    <FormControl variant="standard" sx={{ width: '280px' }}>
                                        <InputLabel id="demo-simple-select-label">Loại ưu đãi</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={type}
                                            label="Phương thức giảm giá"
                                            onChange={handleChangeType}
                                        >
                                            <MenuItem value="order">Đơn hàng</MenuItem>
                                            <MenuItem value="table">Đặt bàn</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="standard" sx={{ width: '280px', marginLeft: '45px' }}>
                                        <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={status}
                                            label="Phương thức giảm giá"
                                            onChange={handleChangeStatus}
                                        >
                                            <MenuItem value="active">Hoạt động</MenuItem>
                                            <MenuItem value="blocked">Khóa</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <TextField
                                    sx={{ marginTop: '15px' }}
                                    fullWidth
                                    id="standard-basic"
                                    label="Số lượng sử dụng giảm giá"
                                    value={usageLimit}
                                    onChange={(e) => setUsageLimit(e.target.value)}
                                    variant="standard"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Pie Chart */}
                <div className="col-xl-4 col-lg-5">
                    <div className="card shadow mb-4">
                        {/* Card Header - Dropdown */}
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">
                                Hình ảnh
                            </h6>
                        </div>
                        {/* Card Body */}
                        <div className="card-body">
                            <div className="chart-area">
                                <Button
                                    role={undefined}
                                    tabIndex={-1}
                                    sx={{ margin: '10px 10px 0 0' }}
                                    variant="contained"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handFileChange}
                                        multiple
                                    />
                                </Button>
                                {imageSrc && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={imageSrc} alt="" style={{ maxWidth: '270px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>

            </div>

            {/* Success Snackbar */}
            <Snackbar open={successOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Thêm ưu đãi thành công! Đang chuyển hướng...
                </Alert>
            </Snackbar>

            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Chỉ được phép nhập dưới hoặc bằng 100%
                </Alert>
            </Snackbar>
        </>
    )
};

export default AddVoucher;

{/* <div style={{ marginTop: '20px' }}>
                                <h3>Nội dung</h3>
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </div> */}
