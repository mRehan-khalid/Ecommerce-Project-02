import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/header";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateProduct.css";
import { environment  } from '../../environment';

function UpdateProduct () {
    const { id } = useParams(); 
    const [data, setData] = useState({});
    const [product_name, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [product_price, setProductPrice] = useState("");  
    const [file_path, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const fetchData = async () => {
        setLoading(true);
        try {
            let result = await fetch(`${environment.serverUrl}/api/getProductById/` + id);
            result = await result.json();
            setData(result);
            setProductName(result.product_name);
            setDescription(result.description);
            setProductPrice(result.product_price);
            setFile(result.file_path);
            setSelectedImage(null);
        } catch (error) {
            toast.error("Failed to fetch product data");
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed");
                e.target.value = null; 
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error("Image size should be less than 5MB");
                e.target.value = null;
                return;
            }

            setSelectedImage(URL.createObjectURL(file));
            setFile(file);
        }
    }

    // Update product
    const handleUpdateProduct = async () => {
        if (!product_name || !description || !product_price) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("id", id);
        formData.append("product_name", product_name);
        formData.append("description", description);
        formData.append("product_price", product_price);
        if (file_path) formData.append("file_path", file_path);

        try {
            let result = await fetch(`${environment.serverUrl}/api/updateProduct/${id}?_method=PUT`, {
                method: "POST",
                body: formData
            });
            let data = await result.json();

            if (data.status || result.ok) {
                toast.success("Product Updated Successfully");
                fetchData(); 
                setSelectedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = null;
            } else {
                toast.error("Failed to update product");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
        setLoading(false);
    }

    return (
        <div>
            <Header />
            <div className="update-product-container">
                {loading && (
                    <div className="spinner-overlay">
                        <div className="spinner"></div>
                    </div>
                )}

                <h1>Update Product</h1>

                <input 
                    type="text"
                    value={product_name}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product Name"
                />

                <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />

                <input 
                    type="number"
                    min="0"
                    step="1"
                    value={product_price}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="Price (AED)"
                />

                <input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />

                {selectedImage && (
                    <div className="selected-image-container">
                        <img src={selectedImage} alt="Selected" className="selected-image-preview"/>
                        <div className="selected-image-caption">Image selected</div>
                    </div>
                )}

                {!selectedImage && data.file_path && (
                    <div className="selected-image-container">
                        <img src={`${environment.serverUrl}/storage/${data.file_path}`} alt="Current" className="selected-image-preview"/>
                        <div className="selected-image-caption">Current image</div>
                    </div>
                )}

                <button onClick={handleUpdateProduct}>Update Product</button>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default UpdateProduct;