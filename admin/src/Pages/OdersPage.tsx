import { HeaderNav, HeaderUl } from "./Header";
import Clock from "../Components/Clock"
import OrdersTable from "../Components/Oders/OrderTable";

const OdersPage = () => {
    return (
        <>
            <div id="page-top">
                {/* Page Wrapper */}
                <div id="wrapper">
                    {/* Sidebar */}
                    <HeaderUl/>
                    {/* End of Sidebar */}
                    {/* Content Wrapper */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        {/* Main Content */}
                        <div id="content">
                            {/* Topbar */}
                            <HeaderNav/>
                            {/* End of Topbar */}
                            {/* Begin Page Content */}
                            <div className="container-fluid">
                                <div className="app-title">
                                    <ul className="app-breadcrumb breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#">
                                                <b>Quản lý đơn đặt hàng</b>
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
                                                        <OrdersTable/>
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

export default OdersPage