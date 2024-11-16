import '../public/css/sb-admin-2.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'


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

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to ='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/category' element={<CategoryPage />} />
          <Route path='/customer' element={<UserPage />} />
          <Route path='/staff' element={<StaffPage />} />
          {/* Voucher */}
          <Route path='/voucher' element={<VoucherPage />} />
          <Route path='/addvoucher' element={<AddVoucherPage />} />
          <Route path='/editvoucher/:voucherID' element={<EditVoucherPage />} />
          <Route path='/oders' element={<OdersPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
