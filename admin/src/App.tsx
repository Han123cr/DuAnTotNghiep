import '../public/css/sb-admin-2.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'


import Home from './Pages/Home'
import Footer from './Pages/Footer'
import ProductPage from './Pages/ProductPage'
import CategoryPage from './Pages/CategoryPage'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to ='/admin' />} />
          <Route path='/admin' element={<Home />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/category' element={<CategoryPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
