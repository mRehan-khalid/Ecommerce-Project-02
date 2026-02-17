import logo from './logo.svg';
import './App.css';
import {} from 'react-bootstrap';
import {BrowserRouter, Route, Routes, Switch} from 'react-router-dom';
import Header from './header';
import Login from './login';
import Register from './register';
import UpdateProduct from './UpdateProduct';
import AddProduct from './AddProduct';
import Protected from './Protected';
import ProductList from './ProductList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <h1>E-commerce Project with React and Php</h1> */}
        <Routes>
        <Route path="/UpdateProduct" element={<Protected Component={UpdateProduct} />} />
        <Route path="/AddProduct" element={<Protected Component={AddProduct} />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/" element={<Protected Component={ProductList} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
