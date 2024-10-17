import '../public/css/sb-admin-2.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'


import Home from './Pages/Home'
import Header from './Pages/Header'
import Footer from './Pages/Footer'
import ProductPage from './Pages/ProductPage'
import ProductPagetest from './Pages/ProductPagetest'

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Navigate to ='/admin' />} />
          <Route path='/admin' element={<Home />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/producttest' element={<ProductPagetest />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
