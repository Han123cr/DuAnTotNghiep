import '../public/css/sb-admin-2.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'


import Home from './Pages/Home'
import Footer from './Pages/Footer'
import ProductPage from './Pages/ProductPage'
import CategoryPage from './Pages/CategoryPage'
import UserPage from './Pages/UserPage'
import StaffPage from './Pages/StaffPage'

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
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
