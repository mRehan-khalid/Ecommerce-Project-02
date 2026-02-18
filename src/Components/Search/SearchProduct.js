import Header from '../Header/header';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import "./searchProduct.css";

function SearchProduct () {
    const [query, setQuery] = useState([""]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false); 

    async function search(key, page = 1) {
        if (!key) return;
        setLoading(true);
        try {
            let result = await fetch(`http://localhost:8000/api/searchProduct/${key}?page=${page}`);
            result = await result.json();
            console.log(result);
            setData(result.data);          
            setCurrentPage(result.current_page);
            setTotalPages(result.last_page);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Header />
            <div className="col-sm-6 offset-sm-3 search-box">
                <h1>Search Product</h1>
                <input type="text" className="form-control"   value={query} 
                    onChange={(e) => setQuery(e.target.value)} placeholder="Search Product" /> 
                <button className="btn btn-primary search-btn" onClick={() => search(query, 1)}>Search</button>
                
                {loading && (
                    <div className="spinner-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>

            {data.length > 0 && !loading && (
            <div className="col-sm-8 offset-sm-2">
                <Table striped bordered hover>
                    <thead className='searchedProductsList'>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Product Image</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr className='searchedProductsData' key={item.id}>
                                <td>{(currentPage - 1) * 5 + index + 1}</td>
                                <td>{item.product_name}</td>
                                <td><img style={{ width: 70 }}
                                 src={"http://localhost:8000/" + item.file_path} />
                                 </td>
                                <td>{item.description}</td>
                                <td>{item.product_price} AED</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="pagination-container text-center my-3">
                    <button
                        className="btn btn-secondary me-2"
                        disabled={currentPage === 1}
                        onClick={() => search(query, currentPage - 1)}
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
                            onClick={() => search(query, page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="btn btn-secondary ms-2"
                        disabled={currentPage === totalPages}
                        onClick={() => search(query, currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
            )}

            {!loading && data.length === 0 && query !== "" && (
                <div className="col-sm-8 offset-sm-2 text-center mt-3">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export default SearchProduct;