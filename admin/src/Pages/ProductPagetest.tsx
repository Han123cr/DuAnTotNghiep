import { HeaderNav, HeaderUl } from "./Header";
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
