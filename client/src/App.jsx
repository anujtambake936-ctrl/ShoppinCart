import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { setUser } from './app/slices/authSlice'
import { setCart } from './app/slices/cartSlice'
import getUserFromServer from './helpers/getUserFromServer'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddProduct from './pages/AddProduct'
import OrderHistory from './pages/OrderHistory'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import NotFound from './pages/NotFound'
import './App.css'

const App = () => {
  const dispatch = useDispatch()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const getUser = () => {
    getUserFromServer()
      .then((data) => {
        if (data.success) {
          dispatch(setUser(data.user))
          dispatch(setCart(data.user.cart || []))
        } else {
          dispatch(setUser(null))
          dispatch(setCart([]))
        }
      })
      .catch(() => {
        dispatch(setUser(null))
        dispatch(setCart([]))
      })
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <BrowserRouter>
        <Toaster />
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login getUser={getUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success getUser={getUser} />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
