import React, { useState, useRef } from "react";
import Header from '../Header/header';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddProduct.css";
import { environment } from "../../environment";

function AddProduct() {
    const [product_name, setName] = useState('');
    const [file_path, setFile] = useState(null);
    const [product_price, setPrice] = useState('');
    const [description, setDescription] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Restrict to images only
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            e.target.value = null;
            return;
        }

        setFile(file);
        setSelectedImage(URL.createObjectURL(file));
    }

    // Handle product addition
    const addProduct = async () => {
        if (!product_name || !product_price || !description || !file_path) {
            toast.error("Please fill all fields and select an image");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('product_name', product_name);
        formData.append('file_path', file_path);
        formData.append('product_price', parseInt(product_price)); 
        formData.append('description', description);

        try {
            let result = await fetch(`${environment.serverUrl}/api/addProduct`, {
                method: 'POST',
                body: formData
            });
            let data = await result.json();

            if (data.status || result.ok) {
                toast.success("Product Added Successfully");
                // Reset form
                setName('');
                setFile(null);
                setPrice('');
                setDescription('');
                setSelectedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = null;
            } else {
                toast.error("Failed to add product");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }

        setLoading(false);
    }

    return (
        <div>
            <Header />
            <div className="add-product-container">
                {loading && (
                    <div className="spinner-overlay">
                        <div className="spinner"></div>
                    </div>
                )}

                <h1>Add Product</h1>

                <input 
                    type="text"
                    value={product_name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                />

                <input 
                    type="number"
                    min="0"
                    step="1"
                    value={product_price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price (AED)"
                />

                <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description"
                />

                <input 
                    type="file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />

                {/* Selected Image Preview */}
                {selectedImage && (
                    <div className="selected-image-container">
                        <img src={selectedImage} alt="Selected" className="selected-image-preview"/>
                        <div className="selected-image-caption">Image selected</div>
                    </div>
                )}

                <button onClick={addProduct}>Add Product</button>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default AddProduct;