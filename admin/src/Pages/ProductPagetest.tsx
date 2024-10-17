import { Link } from "react-router-dom"
import Clock from "../Components/Clock"
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ProductTable from "../Components/ProductTable";

const ProductPagetest = () => {
    return (
        <>
            <div id="page-top">
                {/* Page Wrapper */}
                <div id="wrapper">
                    {/* Sidebar */}
                    <ul
                        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
                        id="accordionSidebar"
                    >
                        {/* Sidebar - Brand */}
                        <a
                            className="sidebar-brand d-flex align-items-center justify-content-center"
                            href="index.html"
                        >
                            <div className="sidebar-brand-text mx-3">Savory</div>
                        </a>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Thống kê</div>
                        {/* Nav Item - Dashboard */}
                        <li className="nav-item">
                            <a className="nav-link" href="index.html">
                                <i className="fas fa-fw fa-tachometer-alt" />
                                <span>Thống kê báo cáo</span>
                            </a>
                        </li>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Sản phẩm</div>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-cog" />
                                <span>Quản lý thực đơn</span>
                            </a>
                        </li>
                        {/* Nav Item - Utilities Collapse Menu */}
                        <li className="nav-item active">
                            <Link to='/product' className="nav-link">
                                <i className="fas fa-fw fa-wrench" />
                                <span>Quản lý món ăn</span>
                            </Link>
                        </li>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Dịch vụ</div>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-folder" />
                                <span>Quản lý đơn đặt bàn</span>
                            </a>
                        </li>
                        {/* Nav Item - Charts */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-chart-area" />
                                <span>Quản lý bàn</span>
                            </a>
                        </li>
                        {/* Nav Item - Tables */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-table" />
                                <span>Quản lý hóa đơn</span>
                            </a>
                        </li>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Đơn hàng</div>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-folder" />
                                <span>Quản lý đơn đặt hàng</span>
                            </a>
                        </li>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Người dùng</div>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-folder" />
                                <span>Quản lý nhân viên</span>
                            </a>
                        </li>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-folder" />
                                <span>Quản lý khách hàng</span>
                            </a>
                        </li>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Đánh giá</div>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-folder" />
                                <span>Quản lý đánh giá</span>
                            </a>
                        </li>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Ưu đãi</div>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-folder" />
                                <span>Quản lý ưu đãi</span>
                            </a>
                        </li>
                        {/* Divider */}
                        <hr className="sidebar-divider" />
                        {/* Heading */}
                        <div className="sidebar-heading">Thông tin</div>
                        {/* Nav Item - Pages Collapse Menu */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <i className="fas fa-fw fa-folder" />
                                <span>Quản lý thông tin</span>
                            </a>
                        </li>
                    </ul>
                    {/* End of Sidebar */}
                    {/* Content Wrapper */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        {/* Main Content */}
                        <div id="content">
                            {/* Topbar */}
                            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                                {/* Sidebar Toggle (Topbar) */}
                                <button
                                    id="sidebarToggleTop"
                                    className="btn btn-link d-md-none rounded-circle mr-3"
                                >
                                    <i className="fa fa-bars" />
                                </button>
                                {/* Topbar Search */}
                                <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 small"
                                            placeholder="Search for..."
                                            aria-label="Search"
                                            aria-describedby="basic-addon2"
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="button">
                                                <i className="fas fa-search fa-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                {/* Topbar Navbar */}
                                <ul className="navbar-nav ml-auto">
                                    {/* Nav Item - Search Dropdown (Visible Only XS) */}
                                    <li className="nav-item dropdown no-arrow d-sm-none">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            href="#"
                                            id="searchDropdown"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="fas fa-search fa-fw" />
                                        </a>
                                        {/* Dropdown - Messages */}
                                        <div
                                            className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                            aria-labelledby="searchDropdown"
                                        >
                                            <form className="form-inline mr-auto w-100 navbar-search">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control bg-light border-0 small"
                                                        placeholder="Search for..."
                                                        aria-label="Search"
                                                        aria-describedby="basic-addon2"
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-primary" type="button">
                                                            <i className="fas fa-search fa-sm" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </li>
                                    {/* Nav Item - Alerts */}
                                    <li className="nav-item dropdown no-arrow mx-1">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            href="#"
                                            id="alertsDropdown"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="fas fa-bell fa-fw" />
                                            {/* Counter - Alerts */}
                                            <span className="badge badge-danger badge-counter">3+</span>
                                        </a>
                                        {/* Dropdown - Alerts */}
                                        <div
                                            className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                            aria-labelledby="alertsDropdown"
                                        >
                                            <h6 className="dropdown-header">Alerts Center</h6>
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                <div className="mr-3">
                                                    <div className="icon-circle bg-primary">
                                                        <i className="fas fa-file-alt text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="small text-gray-500">December 12, 2019</div>
                                                    <span className="font-weight-bold">
                                                        A new monthly report is ready to download!
                                                    </span>
                                                </div>
                                            </a>
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                <div className="mr-3">
                                                    <div className="icon-circle bg-success">
                                                        <i className="fas fa-donate text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="small text-gray-500">December 7, 2019</div>
                                                    $290.29 has been deposited into your account!
                                                </div>
                                            </a>
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                <div className="mr-3">
                                                    <div className="icon-circle bg-warning">
                                                        <i className="fas fa-exclamation-triangle text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="small text-gray-500">December 2, 2019</div>
                                                    Spending Alert: We've noticed unusually high spending for
                                                    your account.
                                                </div>
                                            </a>
                                            <a
                                                className="dropdown-item text-center small text-gray-500"
                                                href="#"
                                            >
                                                Show All Alerts
                                            </a>
                                        </div>
                                    </li>
                                    {/* <div class="topbar-divider d-none d-sm-block"></div> */}
                                    {/* Nav Item - User Information */}
                                    <li className="nav-item dropdown no-arrow">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            href="#"
                                            id="userDropdown"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <img
                                                className="img-profile rounded-circle"
                                                src="img/images.jfif"
                                            />
                                        </a>
                                        {/* Dropdown - User Information */}
                                        <div
                                            className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                            aria-labelledby="userDropdown"
                                        >
                                            <a className="dropdown-item" href="#">
                                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                                                Thông tin cá nhân
                                            </a>
                                            <a className="dropdown-item" href="#">
                                                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                                                Cài đặt
                                            </a>
                                            <div className="dropdown-divider" />
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                data-toggle="modal"
                                                data-target="#logoutModal"
                                            >
                                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                                                Đăng xuất
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                            {/* End of Topbar */}
                            {/* Begin Page Content */}
                            <div className="container-fluid">
                                <div className="app-title">
                                    <ul className="app-breadcrumb breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#">
                                                <b>Bảng điều khiển</b>
                                            </a>
                                        </li>
                                    </ul>
                                    < Clock />
                                </div>
                                {/* Content Row */}
                                <div className="row">
                                            <div className="col-md-12">
                                                <div className="tile">
                                                    <div className="tile-body">
                                                        <div className="row element-button">
                                                            <div className="col-sm-3">
                                                            <Button startIcon={<AddIcon/>} variant="contained" disableElevation sx={{marginBottom: '10px'}}>
                                                                Thêm sản phẩm
                                                            </Button>
                                                            </div>
                                                        </div>
                                                        <ProductTable/>
                                                    </div>
                                                </div>
                                            </div>
                                </div>
                                {/* /.container-fluid */}
                            </div>
                            {/* End of Main Content */}
                            <a className="scroll-to-top rounded" href="#page-top">
                                <i className="fas fa-angle-up"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>


        </>


    )
}

export default ProductPagetest
