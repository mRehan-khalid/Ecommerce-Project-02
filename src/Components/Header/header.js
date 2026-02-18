import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./header.css";

function Header() {
  const [cartCount, setCartCount] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const user = userInfo?.user;

  const fetchCartCount = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/userCart/${user.id}`);
      const totalItems = res.data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems > 0 ? totalItems : 0);
    } catch (err) {
      console.error("Error fetching cart count:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []); // only once on component mount

  // optional: listen to cart updates from localStorage or event bus if needed
  // eg: window.addEventListener('cartUpdated', fetchCartCount);

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" className='TopNavbar'>
        <Navbar.Brand>E-Commerce</Navbar.Brand>

        <Nav className="mr-auto nav_bar_wrapper">
          <Link to="/searchProduct">Search Product</Link>
          <Link to="/">Product List</Link>
          {user && user.user_role === "admin" && <Link to="/AddProduct">Add Product</Link>}
          <Link to="/CartView">
            View Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </Nav>

        {user && (
          <Nav>
            <NavDropdown title={user.name}>
              <NavDropdown.Item onClick={logout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
      </Navbar>
    </div>
  );
}

export default Header;