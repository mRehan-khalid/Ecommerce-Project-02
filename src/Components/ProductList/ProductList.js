import Header from "../Header/header";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductList.css"

function ProductList() {
    

    const [data, setData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user-info"));

    async function fetchData() {
        let response = await fetch("http://localhost:8000/api/productsList");
        let result = await response.json();
        setData(result);
    }

    useEffect(() => {
        fetchData();
    }, []);

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
            alert("Delete failed");
        }
    }

    
        async function addToCart(productId) {
            if (!user) {
                alert("Please login first!");
                return;
            }

            try {
                let response = await fetch(`http://localhost:8000/api/addToCart/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_id: user.id })
                });

                let result = await response.json();

                if (response.ok) {
                    alert(result.message);
                } else {
                    alert(result.message || "Failed to add to cart");
                }
            } catch (error) {
                console.error(error);
                alert("Error adding to cart");
            }
        }

    return (
        <div>
            <Header />

            <div className="col-sm-8 offset-sm-2">
                <h1>Product List Table</h1>

                <Table striped bordered hover>
                    <thead>
                        <tr>
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
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.product_name}</td>
                                <td>
                                    <img
                                        style={{ width: 100 }}
                                        src={"http://localhost:8000/" + item.file_path}
                                        alt="product"
                                    />
                                </td>
                                <td>{item.description}</td>
                                <td>{item.product_price}</td>

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
                                            Add to Cart
                                        </span>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>

                </Table>
            </div>
        </div>
    );
}

export default ProductList;