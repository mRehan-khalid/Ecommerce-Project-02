import Header from './header';
import React, {useState, useEffect} from 'react';

function AddProduct () {
    const [product_name, setName] = useState('');
    const [file_path, setFile] = useState('');
    const [product_price, setPrice] = useState('');
    const [description, setDescription] = useState(''); 

    async function addProduct() {
        const formData = new FormData();
        formData.append('product_name', product_name);
        formData.append('file_path', file_path);
        formData.append('product_price', product_price);
        formData.append('description', description);
        let result = await fetch("http://localhost:8000/api/addProduct", {
            method: 'POST',
            body: formData
        });
        alert("Product Added Successfully");
        formData.set('product_name', '');
        formData.set('file_path', '');
        formData.set('product_price', '');
        formData.set('description', '');
    }



    return (
        <div > 
            <Header /> 
            <div className="col-sm-6 offset-sm-3">
                <br />

                <input type="text" className="form-control" placeholder="Product Name" value={product_name} onChange={(e) => setName(e.target.value)} /> <br />
                <input type="file" className="form-control" placeholder="Upload Image"  onChange={(e) => setFile(e.target.files[0])} /> <br />
                <input type="text" className="form-control" placeholder="Product Price" value={product_price} onChange={(e) => setPrice(e.target.value)} /> <br />
                <input type="text" className="form-control" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} /> <br />
                <button className="btn btn-primary" onClick={addProduct}>Add Product</button>
            </div>

        </div>
    );
}

export default AddProduct;