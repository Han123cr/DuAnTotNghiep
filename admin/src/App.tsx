import '../public/css/sb-admin-2.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Routers from './Components/Router'

import Home from './Pages/Home'
import Footer from './Pages/Footer'
import ProductPage from './Pages/ProductPage'
import CategoryPage from './Pages/CategoryPage'
import UserPage from './Pages/UserPage'
import StaffPage from './Pages/StaffPage'
import OdersPage from './Pages/OdersPage'
import VoucherPage from './Pages/Voucher/VoucherPage'
import AddVoucherPage from './Pages/Voucher/AddVoucherPage'
import EditVoucherPage from './Pages/Voucher/EditVoucherPage'
import TableOrdersPage from './Pages/TableOrders/TableOrdersPage'
import LoginPage from './Pages/LoginPage'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/*------------------------------Admin------------------------------- */}
            <Route path={Routers.ADMIN_LOGIN} element={<LoginPage />} />
            <Route path={Routers.ADMIN_HOME} element={<Home />} />
            <Route path={Routers.ADMIN_PRODUCT} element={<ProductPage />} />
            <Route path={Routers.ADMIN_CATEGORY} element={<CategoryPage />} />
            <Route path={Routers.ADMIN_CUSTOMER} element={<UserPage />} />
            <Route path={Routers.ADMIN_STAFF} element={<StaffPage />} />
            {/* Voucher */}
            <Route path={Routers.ADMIN_VOUCHER} element={<VoucherPage />} />
            <Route path={Routers.ADMIN_ADDVOUCHER} element={<AddVoucherPage />} />
            <Route path={`${Routers.ADMIN_EDITVOUCHER}/:voucherID`} element={<EditVoucherPage />} />
            <Route path={Routers.ADMIN_ORDERS} element={<OdersPage />} />
            <Route path={Routers.ADMIN_TABLEORDERS} element={<TableOrdersPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
