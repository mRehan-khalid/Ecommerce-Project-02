import Header from "../Header/header";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductList.css";
import Spinner from 'react-bootstrap/Spinner';
import { FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ProductList() {


    const [data, setData] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const user = userInfo.user;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    async function fetchData(page = 1) {
        setLoading(true);
        let response = await fetch(`http://localhost:8000/api/productsList?page=${page}`);
        let result = await response.json();

        setData(result.data);
        setCurrentPage(result.current_page);
        setTotalPages(result.last_page);
        setLoading(false);
    }
    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    async function deleteProduct(id) {

        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        let response = await fetch("http://localhost:8000/api/deleteProduct/" + id, {
            method: "DELETE",
        });

        if (response.ok) {
            fetchData();
        } else {
            toast.error("Delete failed");
        }
    }
const [cartCount, setCartCount] = useState(0);

const fetchCartCount = async () => {
  if (!user) return;
  try {
    const res = await fetch(`http://localhost:8000/api/cartCount/${user.id}`);
    const data = await res.json();
    setCartCount(data.count);
  } catch (err) {
    console.error(err);
    setCartCount(0);
  }
};

async function addToCart(productId) {
    if (!user) {
        alert("Please login first!");
        return;
    }

    try {
        let response = await fetch(`http://localhost:8000/api/addToCart/${productId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id })
        });

        let result = await response.json();

        if (response.ok) {
            toast.success(result.message); 
            fetchCartCount(); 
        } else {
            toast.error(result.message || "Failed to add to cart");
        }
    } catch (error) {
        console.error(error);
        toast.error("Error adding to cart");
    }
}

    return (
        <div>
            <Header  cartCount={cartCount} />
            <ToastContainer position="top-right" autoClose={1500} hideProgressBar />    
            {loading ? (
                <Spinner animation="border" size="md" variant="light" className="loadingSpinner" />
            ) : (
                <div className="col-sm-8 offset-sm-2 displayProductsList">
                    <h1>Our Products</h1>
                    <Table striped bordered hover>
                        <thead>
                            <tr className="tableHeadingRow">
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                                <th>Description</th>
                                <th>Price</th>
                                <>
                                    <th colSpan={2}>Actions</th>
                                </>

                            </tr>
                        </thead>

<tbody>
    {data.map((item, index) => (
        <tr key={item.id}>
            <td>{(currentPage - 1) * 5 + index + 1}</td>
            <td>{item.product_name}</td>
            <td>
                <img className="productImage"
                     style={{ width: 70 }}
                     src={"http://localhost:8000/" + item.file_path}
                     alt="product"
                />
            </td>
            <td>{item.description}</td>
            <td>{item.product_price} AED</td>

            {user && user.user_role === "admin" && (
                <>
                    <td>
                        <span
                            className="deleteProduct"
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => deleteProduct(item.id)}
                        >
                            Delete
                        </span>
                    </td>

                    <td>
                        <Link to={"/updateProduct/" + item.id}>
                            <span
                                className="updateProduct"
                                style={{ cursor: "pointer", color: "blue" }}
                            >
                                Update
                            </span>
                        </Link>
                    </td>
                </>
            )}
            {user && user.user_role === "user" && (
                <td>
                    <span
                        className="addToCart"
                        style={{ cursor: "pointer", color: "green" }}
                        onClick={()=>addToCart(item.id)}
                    >
                        <FaShoppingCart /> Add to Cart
                    </span>
                </td>
            )}
        </tr>
    ))}
</tbody>

                    </Table>
                    <div className="pagination-container text-center my-3">
                        <button
                            className="btn btn-secondary me-2"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`btn ${page === currentPage ? "btn-primary" : "btn-light"} me-1`}
                                style={{ 
                                    width: page === currentPage ? '20%' : '40px', 
                                }}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="btn btn-secondary ms-2"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductList;