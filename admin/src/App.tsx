import '../public/css/sb-admin-2.css'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Routers from './Components/Router'
import ProtectedRoute from './Components/ProtectedRoute'

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
import LoginPage from './Pages/Login/LoginPage'
import LoginWithLink from './Components/Login/LoginWithLink'
import TablesPage from './Pages/Tables/TablesPage'
import TableProductPage from './Pages/Tables/TableProductPage'
import BillsPage from './Pages/BillPage'
import ReviewsPage from './Pages/ReviewsPage'
import LoginHomePage from './Pages/Login/LoginHomePage'
import LoginSAMPage from './Pages/Login/LoginSAMPage'

function App() {
  // Kiểm tra nếu có "isAuthenticated" trong localStorage
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <>
      <Router>
        <Routes>
          <Route path={Routers.LOGINHOME} element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoginPage><LoginHomePage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_LOGIN} element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoginPage><LoginPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_LOGINWITHLINK} element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoginPage><LoginWithLink /></ProtectedRoute>} />

          {/*------------------------------Admin------------------------------- */}
          <Route path={Routers.ADMIN_HOME} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><Home /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_BILL} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><BillsPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_REVIEWS} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><ReviewsPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_PRODUCT} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><ProductPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_CATEGORY} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><CategoryPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_CUSTOMER} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><UserPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_STAFF} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><StaffPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_TABLE} element={<ProtectedRoute isAuthenticated={isAuthenticated}><TablesPage /></ProtectedRoute>} />
          <Route path={`${Routers.ADMIN_TABLEPRODUCT}/:branchID`} element={<ProtectedRoute isAuthenticated={isAuthenticated}><TableProductPage /></ProtectedRoute>} />
          {/* Voucher */}
          <Route path={Routers.ADMIN_VOUCHER} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><VoucherPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_ADDVOUCHER} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><AddVoucherPage /></ProtectedRoute>} />
          <Route path={`${Routers.ADMIN_EDITVOUCHER}/:voucherID`} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><EditVoucherPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_ORDERS} element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'manage']}><OdersPage /></ProtectedRoute>} />
          <Route path={Routers.ADMIN_TABLEORDERS} element={<ProtectedRoute isAuthenticated={isAuthenticated}><TableOrdersPage /></ProtectedRoute>} />

          {/* -------------------------------STAFF--------------------------------------- */}
          <Route path={Routers.STAFF_LOGIN} element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoginPage><LoginSAMPage /></ProtectedRoute>} />

          {/* -------------------------------MANAGE--------------------------------------- */}
          <Route path={Routers.MANAGE_LOGIN} element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoginPage><LoginSAMPage /></ProtectedRoute>} />
        </Routes>
        <FooterWrapper/>
      </Router>
    </>
  )
}

function FooterWrapper() {
  const location = useLocation();
  const shouldHideFooter = [
    Routers.ADMIN_TABLEPRODUCT,
    Routers.ADMIN_LOGIN,
    Routers.LOGINHOME,
  ].some((path) => location.pathname.includes(path));

  return !shouldHideFooter && <Footer />;
}

export default App
