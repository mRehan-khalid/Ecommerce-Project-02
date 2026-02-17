import Header from "./header";
import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';


function ProductList() {

    const [data, setData] = useState([]);

    async function fetchData() {
        let result = await fetch("http://localhost:8000/api/productsList");
        result = await result.json();
        setData(result);
    }   
    useEffect(() => {
        fetchData();
    }, [])

    async function deleteProduct(id) {
       let result = await fetch("http://localhost:8000/api/deleteProduct/" + id, {
            method: "DELETE",   
    });
    result = await result.json();
        // console.warn("Product Deleted");
        fetchData();
        // window.location.reload();
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item) => (
                            <tr >
                                <td>{item.id}</td>
                                <td>{item.product_name}</td>
                                <td><img style={{ width: 100 }} src={"http://localhost:8000/" + item.file_path} /></td>
                                <td>{item.description}</td>
                                <td>{item.product_price}</td>
                                <td><span className="deleteProduct" onClick={()=>deleteProduct(item.id)}>Delete</span></td>
                            </tr>)
                        )}

                </tbody>
            </Table>
            </div>
        </div>
    );
}
export default ProductList;
