import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import "./header.css"

function Header() {

  const user = JSON.parse(localStorage.getItem("user-info"));

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        
        <Navbar.Brand>E-Commerce</Navbar.Brand>

        <Nav className="mr-auto nav_bar_wrapper">

          {user ? (
            user.user_role === "admin" ? (
              <>
                <Link to="/">Product List</Link>
                <Link to="/AddProduct">Add Product</Link>
                <Link to="/searchProduct">Search Product</Link>
              </>
            ) : (
              <>
                <Link to="/">Product List</Link>
                <Link to="/searchProduct">Search Product</Link>
                <Link to="/CartView">View Cart</Link>
              </>
            )
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
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