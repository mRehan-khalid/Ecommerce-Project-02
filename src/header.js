import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';


function Header() {
  // const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-info"));
    console.warn(user);

    function logout(){
        localStorage.clear();
        window.location.href = "/register";
    }

    return (
        <div>

      <Navbar bg="dark" data-bs-theme="dark">
        
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="mr-auto nav_bar_wrapper">
            {
              localStorage.getItem("user-info") ?
              <>
                <Link to="/">Product List</Link>
                <Link to="/AddProduct">Add Product</Link>
                <Link to="/UpdateProduct">Update Product</Link>
              </>
              :
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            }
          </Nav>

          {localStorage.getItem("user-info") ?

            <Nav>
              <NavDropdown title={user && user.name} >
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                <NavDropdown.Item> Profile </NavDropdown.Item>

              </NavDropdown>
            </Nav>
            : null
          }

      </Navbar>

        </div>
    );
}  

export default Header;