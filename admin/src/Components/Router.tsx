const url = window.location.href;
// Tách phần đường dẫn
const path = new URL(url).pathname;
// Lấy phần đầu tiên sau dấu "/"
const admin = path.split('/')[1]; // Lấy phần đầu tiên

const basePath = `/${admin}`; // Đảm bảo luôn thêm "/" trước giá trị admin
console.log(admin);



const Routers = {
    LOGINHOME: "/",
    ADMIN_LOGIN: "/admin/login",
    STAFF_LOGIN: "/staff/login",
    MANAGE_LOGIN: "/manage/login",
    ADMIN_LOGINWITHLINK: "/admin/loginWithLink",
    // ----------------------------ADMIN---------------------//
    ADMIN_HOME: `${basePath}`,
    ADMIN_PRODUCT: `${basePath}/product`,
    ADMIN_CATEGORY: `${basePath}/category`,
    ADMIN_CUSTOMER: `${basePath}/customer`,
    ADMIN_STAFF: `${basePath}/staff`,
    ADMIN_VOUCHER: `${basePath}/voucher`,
    ADMIN_ADDVOUCHER: `${basePath}/addvoucher`,
    ADMIN_EDITVOUCHER: `${basePath}/editvoucher`,
    ADMIN_ORDERS: `${basePath}/orders`,
    ADMIN_TABLEORDERS: `${basePath}/tableorders`,
    ADMIN_TABLE: `${basePath}/tables`,
    ADMIN_TABLEPRODUCT: `${basePath}/tableproduct`,
    ADMIN_BILL: `${basePath}/bill`,
    ADMIN_REVIEWS: `${basePath}/review`,
};

export default Routers;