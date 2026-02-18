import Header from '../Header/header';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

function SearchProduct () {
    const [query, setQuery] = useState([""]);
    const [data, setData] = useState([]);

    async function search(key) {
        let result = await fetch("http://localhost:8000/api/searchProduct/"+ key);
        result = await result.json();
        console.log(result);
        setData(result);
    }
    return (
        <div>
            <Header />
            <div className="col-sm-6 offset-sm-3">
                <h1>Search Product</h1>
                <input type="text" className="form-control"   value={query} 
                    onChange={(e) => setQuery(e.target.value)}placeholder="Search Product" /> 
                <button className="btn btn-primary" onClick={() => search(query)}>Search</button>
            </div>
            <div className="col-sm-8 offset-sm-2">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Product Image</th>
                        <th>Description</th>
                        <th>Price</th>
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
                            </tr>)
                        )}

                </tbody>
            </Table>
        </div>
        </div>

        );
}

export default SearchProduct;