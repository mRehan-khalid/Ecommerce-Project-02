import React, { useState } from 'react';
import Header from '../Header/header';
import { Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import "./searchProduct.css";
import { environment  } from '../../environment';

function SearchProduct() {
  const [query, setQuery] = useState('');
  const [allData, setAllData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (key, page = 1) => {
    if (!key) return;
    setLoading(true);
    try {
      let result = await fetch(`${environment.serverUrl}/api/searchProduct/${key}?page=${page}`);
      result = await result.json();
      const data = result.data || [];
      setAllData(data);
      setFilteredData(data);
      setCurrentPage(result.current_page);
      setTotalPages(result.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Local search/filter as user types
  const handleTypingSearch = (val) => {
    setQuery(val);
    if (val === '') {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(item =>
        item.product_name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div>
      <Header />
    <div className="search-product-container">

      <div className="search-box">
        <h1>Search Product</h1>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => handleTypingSearch(e.target.value)}
            placeholder="Search Product"
          />
          <button className="search-btn" onClick={() => fetchData(query, 1)}>
            <FaSearch /> Search
          </button>
        </div>

        {loading && (
          <div className="spinner-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>

      {!loading && filteredData.length > 0 && (
        <div className="table-wrapper"  style={{ minHeight: filteredData.length > 0 ? '100vh' : 'auto' }}> 
          <Table striped bordered hover>
            <thead className='searchedProductsList'>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Product Image</th>
                <th>Description</th>
                <th>Price (AED)</th>
              </tr>
            </thead>
            <tbody className='searchedProductsData'>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.product_name}</td>
                  <td>
                    <img src={`${environment.serverUrl}/${item.file_path}`} alt={item.product_name} />
                  </td>
                  <td>{item.description}</td>
                  <td>{parseFloat(item.product_price).toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {!loading && filteredData.length === 0 && query !== '' && (
        <div className="no-results">Press Search to See the Products.</div>
      )}
    </div>
    </div>
  );
}

export default SearchProduct;