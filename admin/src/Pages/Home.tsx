// import { useEffect } from 'react';
// import '/public/js/sb-admin-2'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBagShopping, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Clock from '../Components/Clock'

const Home = () => {
  return (
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
          <li className="nav-item active">
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
          <li className="nav-item">
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
                    {/* <a class="dropdown-item" href="#">
                              <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                              Activity Log
                          </a> */}
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
              {/* Page Heading */}
              {/* <div class="d-sm-flex align-items-center justify-content-between mb-4">
                  <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
                  <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                          class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
              </div> */}
              {/* Content Row */}
              <div className="row">
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-3 col-md-6 mb-4 mb-6">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="col-auto fixicon">
                      <i className="fas fa-users fa-2x text-gray-300" />
                    </div>
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                            TỔNG KHÁCH HÀNG
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            10 khách hàng
                          </div>
                          <hr />
                          <div className="text-s text-muted">
                            Tổng số khách hàng được quản lý
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-3 col-md-6 mb-4 mb-6">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="col-auto fixicon">
                      <i className="fas fa-database fa-2x text-gray-300" />
                    </div>
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                            TỔNG SẢN PHẨM
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            1085 sản phẩm
                          </div>
                          <hr />
                          <div className="text-s text-muted">
                            Tổng số sản phẩm được quản lý.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-3 col-md-6 mb-4 mb-6">
                  <div className="card border-left-secondary shadow h-100 py-2">
                    <div className="col-auto fixicon">
                    <FontAwesomeIcon className="fa-2x" icon={faBagShopping } style={{color: '#FF8B07'}} />
                    </div>
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                            TỔNG ĐƠN HÀNG
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            247 đơn hàng
                          </div>
                          <hr />
                          <div className="text-s text-muted">
                            Tổng số hóa đơn bán hàng trong tháng.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pending Requests Card Example */}
                <div className="col-xl-3 col-md-6 mb-4 mb-6">
                  <div className="card border-left-danger shadow h-100 py-2">
                    <div className="col-auto fixicon">
                    <FontAwesomeIcon className='fa-2x' icon={faCircleExclamation} style={{color: '#DE2222'}} />
                    </div>
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                            SẮP HẾT HÀNG
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            14 sản phẩm
                          </div>
                          <hr />
                          <div className="text-s text-muted">
                            Số sản phẩm cảnh báo hết cần nhập thêm.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Row */}
                <div className="row">
                  {/* Area Chart */}
                  <div className="col-xl-8 col-lg-7">
                    <div className="card shadow mb-4">
                      {/* Card Header - Dropdown */}
                      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">
                          Earnings Overview
                        </h6>
                        <div className="dropdown no-arrow">
                          <a
                            className="dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                          </a>
                          <div
                            className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                            aria-labelledby="dropdownMenuLink"
                          >
                            <div className="dropdown-header">Dropdown Header:</div>
                            <a className="dropdown-item" href="#">
                              Action
                            </a>
                            <a className="dropdown-item" href="#">
                              Another action
                            </a>
                            <div className="dropdown-divider" />
                            <a className="dropdown-item" href="#">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Card Body */}
                      <div className="card-body">
                        <div className="chart-area">
                          <canvas id="myAreaChart" />
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
                          Revenue Sources
                        </h6>
                        <div className="dropdown no-arrow">
                          <a
                            className="dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                          </a>
                          <div
                            className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                            aria-labelledby="dropdownMenuLink"
                          >
                            <div className="dropdown-header">Dropdown Header:</div>
                            <a className="dropdown-item" href="#">
                              Action
                            </a>
                            <a className="dropdown-item" href="#">
                              Another action
                            </a>
                            <div className="dropdown-divider" />
                            <a className="dropdown-item" href="#">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Card Body */}
                      <div className="card-body">
                        <div className="chart-pie pt-4 pb-2">
                          <canvas id="myPieChart" />
                        </div>
                        <div className="mt-4 text-center small">
                          <span className="mr-2">
                            <i className="fas fa-circle text-primary" /> Direct
                          </span>
                          <span className="mr-2">
                            <i className="fas fa-circle text-success" /> Social
                          </span>
                          <span className="mr-2">
                            <i className="fas fa-circle text-info" /> Referral
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Row */}
                <div className="row">
                  {/* Content Column */}
                  <div className="col-lg-6 mb-4">
                    {/* Project Card Example */}
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">
                          Projects
                        </h6>
                      </div>
                      <div className="card-body">
                        <h4 className="small font-weight-bold">
                          Server Migration <span className="float-right">20%</span>
                        </h4>
                        <div className="progress mb-4">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: "20%" }}
                            aria-valuenow={20}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <h4 className="small font-weight-bold">
                          Sales Tracking <span className="float-right">40%</span>
                        </h4>
                        <div className="progress mb-4">
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: "40%" }}
                            aria-valuenow={40}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <h4 className="small font-weight-bold">
                          Customer Database <span className="float-right">60%</span>
                        </h4>
                        <div className="progress mb-4">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "60%" }}
                            aria-valuenow={60}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <h4 className="small font-weight-bold">
                          Payout Details <span className="float-right">80%</span>
                        </h4>
                        <div className="progress mb-4">
                          <div
                            className="progress-bar bg-info"
                            role="progressbar"
                            style={{ width: "80%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <h4 className="small font-weight-bold">
                          Account Setup{" "}
                          <span className="float-right">Complete!</span>
                        </h4>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "100%" }}
                            aria-valuenow={100}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Color System */}
                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-primary text-white shadow">
                          <div className="card-body">
                            Primary
                            <div className="text-white-50 small">#4e73df</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-success text-white shadow">
                          <div className="card-body">
                            Success
                            <div className="text-white-50 small">#1cc88a</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-info text-white shadow">
                          <div className="card-body">
                            Info
                            <div className="text-white-50 small">#36b9cc</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-warning text-white shadow">
                          <div className="card-body">
                            Warning
                            <div className="text-white-50 small">#f6c23e</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-danger text-white shadow">
                          <div className="card-body">
                            Danger
                            <div className="text-white-50 small">#e74a3b</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-secondary text-white shadow">
                          <div className="card-body">
                            Secondary
                            <div className="text-white-50 small">#858796</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-light text-black shadow">
                          <div className="card-body">
                            Light
                            <div className="text-black-50 small">#f8f9fc</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card bg-dark text-white shadow">
                          <div className="card-body">
                            Dark
                            <div className="text-white-50 small">#5a5c69</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 mb-4">
                    {/* Illustrations */}
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">
                          Illustrations
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="text-center">
                          <img
                            className="img-fluid px-3 px-sm-4 mt-3 mb-4"
                            style={{ width: "25rem" }}
                            src="img/undraw_posting_photo.svg"
                            alt="..."
                          />
                        </div>
                        <p>
                          Add some quality, svg illustrations to your project
                          courtesy of{" "}
                          <a
                            target="_blank"
                            rel="nofollow"
                            href="https://undraw.co/"
                          >
                            unDraw
                          </a>
                          , a constantly updated collection of beautiful svg images
                          that you can use completely free and without attribution!
                        </p>
                        <a target="_blank" rel="nofollow" href="https://undraw.co/">
                          Browse Illustrations on unDraw →
                        </a>
                      </div>
                    </div>
                    {/* Approach */}
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">
                          Development Approach
                        </h6>
                      </div>
                      <div className="card-body">
                        <p>
                          SB Admin 2 makes extensive use of Bootstrap 4 utility
                          classes in order to reduce CSS bloat and poor page
                          performance. Custom CSS classes are used to create custom
                          components and custom utility classes.
                        </p>
                        <p className="mb-0">
                          Before working with this theme, you should become familiar
                          with the Bootstrap framework, especially the utility
                          classes.
                        </p>
                      </div>
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

  )
}

export default Home
