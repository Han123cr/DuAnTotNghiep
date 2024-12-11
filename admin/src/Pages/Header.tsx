import {useState} from 'react';
import { Avatar } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Routers from '../Components/Router';
import NotificationDropdown from '../Components/Noti';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

export const HeaderUl = () => {

  const location = useLocation();

  return (
    <>
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar - Brand */}
        <Link to="/admin"
          className="sidebar-brand d-flex align-items-center justify-content-center"
        >
          <div className="sidebar-brand-text mx-3">Savory</div>
        </Link>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Thống kê</div>
        {/* Thống kê báo cáo */}
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_HOME}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_HOME} className="nav-link">
            <i style={{fontSize: 14}} className="fas fa-fw fa-tachometer-alt" />
            <span>Thống kê báo cáo</span>
          </Link>
        </li>
        <hr className="sidebar-divider" />
        {/* Quản lý sản phẩm */}
        <div className="sidebar-heading">Sản phẩm</div>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_CATEGORY}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_CATEGORY} className="nav-link">
            <i style={{fontSize: 15}} className="fas fa-fw fa-list" />
            <span>Quản lý thực đơn</span>
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_PRODUCT}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_PRODUCT} className="nav-link">
            <i style={{fontSize: 15}} className="fas fa-fw fa-list" />
            <span>Quản lý món ăn</span>
          </Link>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Dịch vụ */}
        <div className="sidebar-heading">Dịch vụ</div>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_TABLEORDERS}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_TABLEORDERS} className="nav-link">
            <i style={{fontSize: 15}} className="fas fa-fw fa-clipboard" />
            <span>Quản lý đơn đặt bàn</span>
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_TABLE}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_TABLE} className="nav-link">
            <i style={{fontSize: 14}} className=" fas fa-fw fa-table" />
            <span>Quản lý bàn</span>
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_BILL}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_BILL} className="nav-link">
            <i style={{fontSize: 15}} className="fas fa-fw fa-receipt" />
            <span>Quản lý hóa đơn</span>
          </Link>
        </li>
        <hr className="sidebar-divider" />
        {/* Quản lý đơn hàng */}
        <div className="sidebar-heading">Đơn hàng</div>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_ORDERS}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_ORDERS} className="nav-link">
            <i style={{fontSize: 15}} className="fas fa-fw fa-bag-shopping" />
            <span>Quản lý đơn đặt hàng</span>
          </Link>
        </li>
        <hr className="sidebar-divider" />
        {/* Quản lý người dùng */}
        <div className="sidebar-heading">Người dùng</div>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_STAFF}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_STAFF} className="nav-link">
            <i style={{fontSize: 14}} className="fas fa-fw fa-address-book" />
            <span>Quản lý nhân viên</span>
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_CUSTOMER}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_CUSTOMER} className="nav-link">
            <i style={{fontSize: 14}} className="fas fa-fw fa-address-card" />
            <span>Quản lý khách hàng</span>
          </Link>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Quản lý đánh giá */}
        <div className="sidebar-heading">Đánh giá</div>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <i style={{fontSize: 14}} className="fas fa-fw fa-comments" />
            <span>Quản lý đánh giá</span>
          </a>
        </li>
        <hr className="sidebar-divider" />
        {/* Quản lý ưu đãi */}
        <div className="sidebar-heading">Ưu đãi</div>
        <li className={`nav-item ${location.pathname === `${Routers.ADMIN_VOUCHER}` ? 'active' : ''}`}>
          <Link to={Routers.ADMIN_VOUCHER} className="nav-link">
            <i style={{fontSize: 15}} className="fas fa-fw fa-tags" />
            <span>Quản lý ưu đãi</span>
          </Link>
        </li>
      </ul>
    </>
  )
}

export const HeaderNav = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    //Xóa thông tin xác thực khỏi local
    localStorage.removeItem('isAuthenticated');
    //Điều hướng người dùng đến trang đăng nhập
    navigate('/admin/login')
    //đóng hộp thoại
    setOpen(false)
  }

  const handleOpenDialog = () => {
    setOpen(true);
  }

  const handleCloseDialog = () => {
    setOpen(false);
  }

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        {/* Sidebar Toggle (Topbar) */}
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md-none rounded-circle mr-3"
        >
          <i className="fa fa-bars" />
        </button>
        {/* Topbar Search */}
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
          <NotificationDropdown/>
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
              {/* <img
                className="img-profile rounded-circle"
                src="img/images.jfif"
              /> */}
              <Avatar sx={{ width: 35, height: 35 }} src="/broken-image.jpg" />
            </a>
            {/* Dropdown - User Information */}
            <div
              className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="userDropdown"
            >
              <a
                className="dropdown-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDialog();
                }}
              >
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                Đăng xuất
              </a>

              {/* Mở hộp thoại xác nhận đăng xuất */}
              <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
              >
                <DialogTitle id="logout-dialog-title">Xác nhận đăng xuất</DialogTitle>
                <DialogContent>
                  <DialogContentText id="logout-dialog-description">
                    Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="error">
                    Hủy
                  </Button>
                  <Button onClick={handleLogout} color="primary" autoFocus>
                    Đăng xuất
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </li>
        </ul>
      </nav>
    </>
  )
}
