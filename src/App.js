import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';  // BrowserRouter import already hai
import React, { useState, useEffect } from 'react';
import Header from './Components/Header/header';
import Login from './Components/Login/login';
import Register from './Components/Register/register';
import UpdateProduct from './Components/UpdateProduct/UpdateProduct';
import AddProduct from './Components/AddProduct/AddProduct';
import Protected from './Protected';
import ProductList from './Components/ProductList/ProductList';
import SearchProduct from './Components/SearchProduct/searchProduct';
import CartView from './Components/CartView/CartView';
import CartInvoicePage from './Components/CartInvoice/CartInvoice';
import OrderHistory from './Components/OrderHistory/OrderHistory';
import { useLocation, useNavigate } from "react-router-dom"; 

function App() {
  function CartInvoicePageWrapper() {
    const location = useLocation();
    const { orderData, cartItems } = location.state || {};
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    
    const handleBackHome = () => {
      navigate("/");
    };

    return <CartInvoicePage orderData={orderData} cartItems={cartItems} onBackToHome={handleBackHome} />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/UpdateProduct/:id" element={<Protected Component={UpdateProduct} />} />
          <Route path="/AddProduct" element={<Protected Component={AddProduct} />} />
          <Route path="/products" element={<Protected Component={ProductList} />} />
          <Route path="/CartView" element={<Protected Component={CartView} />} />
          <Route path="/searchProduct" element={<Protected Component={SearchProduct} />} />
          <Route path="/OrderHistory" element={<Protected Component={OrderHistory} />} />
          
          <Route path="/invoice/:orderId" element={<CartInvoicePageWrapper />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
