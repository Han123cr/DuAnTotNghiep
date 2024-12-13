import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom"
import { debounce } from "lodash"
import { API_UrlImage } from '../../../tsconfig.json'
import useApiUrl from '../useApiUrl'
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import Swal from "sweetalert2";
import Payment from "./Payment";
import PDFInvoice from "./PDFInvoice";

interface TableProduct {
    tableBillID: number;
    createdAt: string | null;
    totalAmount: number | null;
    totalAfterVoucher: number | null;
    receivedAmount: number | null;
    surplusAmount: number | null;
    timeOut: string | null;
    transactionCode: string | null;
    paymentMethodID: number | null;
    tableID: string;
    tableOrderID: number;
}

interface BillDetail {
    menuItemID: number;
    menuItemName: string;
    quantity: number;
    price: number;
    size: string;
    total: number;
    tableBillDetailID: number
}

interface CalculateBillResponse {
    totalAmount: number;
    totalAfterVoucher: number | null;
    deposit: number;
    timeOut: string;
    timeIn: string;
    table: string;
    finalTotal: number
    billDetails: BillDetail[];
}

interface Category {
    menuID: number,
    menuName: string,
    menuImage: string | null,
    status: string,
}

interface Product {
    menuItemID: number;
    itemName: string;
    itemImage: string | null;
    description: string;
    price: number;
    discount: number;
    size: string;
    status: string;
    menuID: number;
    variants: Variant[]
}

interface Variant {
    variantID: number;
    price: string;
    discount: string;
    size: string;
    menuItemID: number;
}

const TableProduct: React.FC = () => {

    const { APIURL } = useApiUrl(); // Lấy hàm getApiUrl

    const { branchID } = useParams<{ branchID: string }>();
    // const [data, setData] = useState<TableProduct[]>([]);
    const [billDetails, setBillDetails] = useState<BillDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedMenuID, setSelectedMenuID] = useState<number | null>(null);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState<string>("S");
    const [price, setPrice] = useState<string>("");
    const [tableBillID, setTableBillID] = useState<number | null>(null);
    const [paymentData, setPaymentData] = useState<CalculateBillResponse | null>(null);


    const fetchBill = useCallback(async () => {
        try {
            const response = await fetch(`${APIURL}/getTableOrdersOrBill/${branchID}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const datas = await response.json();
            const data = datas.bill.tableBillID
            console.log(data);
            setTableBillID(data); // Lưu vào state
            return data

        } catch (err) {
            console.error(err);
        }
    }, [branchID, APIURL]);

    const fetchBillDetail = useCallback(async () => {
        try {
            const response = await fetch(`${APIURL}/getBillDetail/${tableBillID}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const data = await response.json();

            if (data.billDetails && data.billDetails.length > 0) {
                console.log(data.billDetails);
                setBillDetails(data.billDetails); // Lưu thông tin chi tiết sản phẩm
            } else {
                // Nếu không có sản phẩm, hiển thị thông báo mặc định
                console.log("No product details available for this bill.");
                setBillDetails([]); // Hoặc lưu trạng thái rỗng tùy theo logic
            }
        } catch (err) {
            console.error("Error fetching bill details:", err);
        }
    }, [APIURL, tableBillID])

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${APIURL}/getMenus`, {
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
            setCategory(data)

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(`${APIURL}/getMenuItems`, {
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
            setProducts(data)

        } catch (err) {
            console.error(err);
        }
    }, [APIURL]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    useEffect(() => {
        if (selectedMenuID !== null) {
            // Lọc sản phẩm theo danh mục
            const filtered = products.filter(product => product.menuID === selectedMenuID);
            setFilteredProducts(filtered);
        } else {
            // Hiển thị tất cả sản phẩm nếu không có danh mục nào được chọn
            setFilteredProducts(products);
        }
    }, [selectedMenuID, products]);

    const handleCategoryClick = (menuID: number) => {
        setSelectedMenuID(menuID);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Bắt đầu trạng thái tải
            try {
                const tableBillID = await fetchBill(); // Lấy tableBillID
                if (tableBillID) {
                    await fetchBillDetail(); // Gọi API thứ hai
                }
            } catch (err) {
                console.error("Error during fetch:", err);
            } finally {
                setLoading(false); // Kết thúc trạng thái tải
            }
        };

        if (branchID) {
            fetchData();
        }
    }, [branchID, fetchBill, fetchBillDetail]);

    const handleQuantityChange = (tableBillDetailID: number, delta: number) => {

        const targetDetail = billDetails.find((detail) => detail.tableBillDetailID === tableBillDetailID);
        if (!targetDetail) return;

        if (targetDetail.quantity === 1 && delta === -1) {
                handleDeleteBillProduct(tableBillDetailID, targetDetail.menuItemName);
            return;
        }

        setBillDetails((prevDetails) =>
            prevDetails.map((detail) =>
                detail.tableBillDetailID === tableBillDetailID
                    ? { ...detail, quantity: Math.max(0, detail.quantity + delta) }
                    : detail
            )
        );

        debounceUpdateQuantity(tableBillDetailID, delta)

    };

    const debounceUpdateQuantity = debounce(async (tableBillDetailID: number, delta: number) => {
        const targetDetail = billDetails.find((detail) => detail.tableBillDetailID === tableBillDetailID);
        if (!targetDetail) return;

        const quantityUpdate = delta > 0 ? 999 : -999;

        try {
            const response = await fetch(`${APIURL}/updateBillDetail/${tableBillDetailID}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantityUpdate }),
            });

            if (response.ok) {
                const updatedDetail = await response.json();
                setBillDetails((prevDetails) =>
                    prevDetails.map((detail) =>
                        detail.tableBillDetailID === tableBillDetailID
                            ? { ...detail, ...updatedDetail.updatedDetail }
                            : detail
                    )
                );
            } else {
                console.error('Thất bị khi sửa số lượng sản phẩm', response.text());
            }
        } catch (err) {
            console.error('Thất bại khi sửa sản phẩm', err);
        }
    }, 300)

    // Set the default price based on the initial size selection (S)
    useEffect(() => {
        if (selectedProduct) {
            // Check for "basic" size in variants
            const basicVariant = selectedProduct.variants.find((variant) => variant.size === "basic");
            if (basicVariant) {
                // If there's a basic size, set the price to the basic size price
                setPrice(basicVariant.price);
                setSize("basic");
            } else {
                // Otherwise, set default to "S" size
                const selectedVariant = selectedProduct.variants.find((variant) => variant.size === "S");
                if (selectedVariant) {
                    setPrice(selectedVariant.price);
                }
            }
        }
    }, [selectedProduct]);

    // Handle the size change and set the price accordingly
    const handleSizeChange = (newSize: string) => {
        setSize(newSize);
        if (selectedProduct) {
            const selectedVariant = selectedProduct.variants.find(
                (variant) => variant.size === newSize
            );
            if (selectedVariant) {
                setPrice(selectedVariant.price);
            }
        }
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseDialog = () => {
        setSelectedProduct(null);
        setQuantity(1); // Reset quantity
        setSize("S"); // Reset size
        setPrice(""); // Reset price
    };

    const handleAddToCart = async () => {
        if (selectedProduct) {
            const selectedVariant = selectedProduct.variants.find(
                (variant) => variant.size === size
            );

            if (!selectedVariant) {
                console.error("Variant không có trong chọn size");
                return;
            }

            //Mảng dữ liệu gửi lên api
            const dataPost = {
                details: [
                    {
                        variantID: selectedVariant.variantID,
                        quantity,
                    },
                ]
            };

            try {
                const response = await fetch(`${APIURL}/createBillDetail/${tableBillID}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataPost),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('thêm sản phẩm thành công', responseData);
                    fetchBillDetail();
                } else {
                    console.log('Thêm sản phẩm thất bại', await response.text());
                }
            } catch (err) {
                console.error(err);
            } finally {
                handleCloseDialog();
            }
        }
    };

    const caculateTotalAmount = useMemo(() => {
        return billDetails.reduce((sum, detail) => sum + Number(detail.total), 0);
    }, [billDetails])

    const handleDeleteBillProduct = async (tableBillDetailID: number, menuItem: string) => {
        const result = await Swal.fire({
            title: 'Xóa sản phẩm',
            text: `Bạn có chắc chắn muốn xóa sản phẩm '${menuItem}' không ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            customClass: {
                confirmButton: 'btn btn-danger mx-3',
                cancelButton: 'btn btn-secondary mx-3'
            },
            buttonsStyling: false,
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${APIURL}/deleteBillDetail/${tableBillDetailID}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });

                if (response.ok) {
                    setBillDetails((prev) => prev.filter((item) => item.tableBillDetailID !== tableBillDetailID));
                } else {
                    const errData = response.json();
                    console.error('Thất bại khi xóa sản phẩm', errData);
                }
            } catch (err) {
                console.error('Lỗi khi xóa sản phẩm', err);
            }
        }

    }

    const handlePaymentSuccess = (data: CalculateBillResponse) => {
        setPaymentData(data)
    }

    return (
        <>
            <div>
                <div className="row min-vh-100">
                    <div className="col-2-1">
                        <div>
                            {/* Sidebar - Brand */}
                            <div
                                className="sidebar-brand d-flex align-items-center justify-content-center"
                            >
                                <div className="sidebar-brand-text2 mx-3">Danh mục</div>
                            </div>
                            {category.map((item) => (
                                <>
                                    <hr className="sidebar-divider" />
                                    <div className="nav-link1"
                                        onClick={() => handleCategoryClick(item.menuID)}
                                    >
                                        <span>{item.menuName}</span>
                                    </div>
                                </>
                            ))
                            }
                        </div>

                    </div>
                    <div className="col-6">
                        <div className="row scrollable-products">
                            {filteredProducts.map((product) => (
                                <div className="col-xl-3 col-md-6 ">
                                    <div className="card border shadow my-3" onClick={() => handleProductClick(product)}>
                                        <div className="card-body1">
                                            <img src={`${API_UrlImage}/${product.itemImage}`} alt="" style={{ width: '100%' }} />
                                            <div className="product-info">
                                                <span className="product-name">{product.itemName}</span>
                                                {/* <span className="product-price">{variants.price}</span> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="col-4 borderLeft d-flex flex-column">
                        <div className="h6tableproduct">Bàn: {branchID}</div>
                        <div className="sidebar-brand-text2">Giỏ Hàng</div>

                        {loading ? (
                            <p>Đang tải dữ liệu...</p>
                        ) : (
                            <>
                                {billDetails.length > 0 ? (
                                    <div className="scrollable-bill" style={{ fontSize: '12px' }}>
                                        <table className="table">
                                            <thead style={{ textAlign: 'center' }}>
                                                <tr>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Kích thước</th>
                                                    <th>Số lượng</th>
                                                    <th>Tổng tiền</th>
                                                    <th>Xóa</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'center' }}>
                                                {billDetails.map((detail) => (
                                                    <>
                                                        <tr key={detail.menuItemID}>
                                                            <td>{detail.menuItemName}</td>
                                                            <td>{detail.size}</td>
                                                            <td>
                                                                <div className="quantity-controls">
                                                                    <div
                                                                        className="quantity-button"
                                                                        onClick={() => handleQuantityChange(detail.tableBillDetailID, -1)}
                                                                    >
                                                                        <i style={{ fontSize: '11px' }} className="fa-solid fa-minus"></i>
                                                                    </div>
                                                                    <div className="quantity-value">{detail.quantity}</div>
                                                                    <div
                                                                        className="quantity-button"
                                                                        onClick={() => handleQuantityChange(detail.tableBillDetailID, 1)}
                                                                    >
                                                                        <i style={{ fontSize: '11px' }} className="fa-solid fa-plus"></i>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{Number(detail.total).toLocaleString()}</td>
                                                            <td>
                                                                <i
                                                                    style={{ fontSize: '11px', cursor: 'pointer' }}
                                                                    className="fa-solid fa-x"
                                                                    onClick={() => handleDeleteBillProduct(detail.tableBillDetailID, detail.menuItemName)}
                                                                >
                                                                </i>
                                                            </td>
                                                        </tr>
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>Không có chi tiết sản phẩm nào.</p>
                                )}
                                <div style={{ marginBottom: '15px' }} className="mt-auto">
                                    <div className="total-container">
                                        <span className="total-label">Tổng tiền: </span>
                                        <span className="total-amount">{caculateTotalAmount.toLocaleString()} VND</span>
                                    </div>

                                    <Payment tableBillID={tableBillID} onPaymentSucces={handlePaymentSuccess}/>
                                    {paymentData && <PDFInvoice data={paymentData}/>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Dialog */}
            <Dialog open={!!selectedProduct} onClose={handleCloseDialog} maxWidth="sm">
                <DialogContent>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Image Section (Left) */}
                        <img
                            src={`${API_UrlImage}/${selectedProduct?.itemImage}`}
                            alt={selectedProduct?.itemName}
                            style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                marginRight: "20px",
                            }}
                        />
                        {/* Text Section (Right) */}
                        <div style={{ flex: 1 }}>
                            {/* Product Name */}
                            <Typography variant="h6" gutterBottom>
                                {selectedProduct?.itemName}
                            </Typography>
                            {/* Product Price */}
                            <Typography variant="body1" color="red" gutterBottom>
                                Giá: {Number(price).toLocaleString()} VND
                            </Typography>

                            {/* Size Selection */}
                            {size !== "basic" && (
                                <FormControl fullWidth margin="normal">
                                    <FormLabel>Size</FormLabel>
                                    <RadioGroup row value={size} onChange={(e) => handleSizeChange(e.target.value)}>
                                        {selectedProduct?.variants.map((variant) => (
                                            <FormControlLabel
                                                key={variant.variantID}
                                                value={variant.size}
                                                control={<Radio />}
                                                label={variant.size}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}

                            {/* Quantity Input */}
                            <Box display="flex" alignItems="center" marginY={1}>
                                <Typography variant="body1" style={{ marginRight: "10px" }}>
                                    Số lượng:
                                </Typography>
                                <TextField
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    inputProps={{ min: 1 }}
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: "100px" }}
                                />
                            </Box>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddToCart} color="primary" variant="contained">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};

export default TableProduct;