import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import React from 'react';
import "./header.css";

function Header({ cartCount }) {

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const user = userInfo?.user;

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" className='TopNavbar'>
        <Navbar.Brand>E-Commerce</Navbar.Brand>

        <Nav className="mr-auto nav_bar_wrapper">
          <Link to="/searchProduct">Search Product</Link>
          <Link to="/products">Product List</Link>

          {user && user.user_role === "admin" && (
            <Link to="/AddProduct">Add Product</Link>
          )}
           {user && user.user_role === "user" && (
          <Link to="/OrderHistory">OrderHistory</Link>
           )}
           {user && user.user_role === "user" && (
             <Link to="/CartView">
              View Cart
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          )}
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