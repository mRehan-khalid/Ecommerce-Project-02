import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import Header from "../Header/header";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { environment  } from '../../environment';

function CartView() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("user-info") || "{}");
  const user = userInfo.user || null;
  const userId = user?.id;

  useEffect(() => {
    if (userId) fetchCart();
    else setLoading(false);
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${environment.serverUrl}/api/userCart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`${environment.serverUrl}/api/updateCartQuantity/${cartItemId}`, { quantity: newQuantity });
      fetchCart();
      toast.success("Quantity updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`${environment.serverUrl}/api/removeCartItem/${cartItemId}`);
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const res = await axios.post(`${environment.serverUrl}/api/checkout`, { user_id: userId });
      setCartItems([]);
      navigate(`/invoice/${res.data.order_id}`, { state: { orderData: res.data, cartItems } });
      toast.success("Checkout successful");
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getTotal = () => cartItems.reduce((total, item) => total + item.product.product_price * item.quantity, 0);

  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />

      <div style={{ width: "90%", margin: "20px auto" }}>
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <p style={{ textAlign: "center" }}>Your cart is empty</p>
        ) : (
          <>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Your Cart</h2>
            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead style={{ backgroundColor: "#f2f2f2" }}>
                <tr>
                  <th style={{ width: "25%" }}>Product</th>
                  <th style={{ width: "30%" }}>Description</th>
                  <th style={{ width: "10%" }}>Price</th>
                  <th style={{ width: "15%" }}>Quantity</th>
                  <th style={{ width: "20%" }}>Subtotal</th>
                  <th style={{ width: "10%" }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.product.product_name}</td>
                    <td>{item.product.description}</td>
                    <td>AED {item.product.product_price}</td>
                    <td style={{ display: "flex", alignItems: "center", justifyContent:"center", gap: "10px" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ padding: "2px 8px" }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: "2px 8px" }}
                      >
                        +
                      </button>
                    </td>
                    <td>AED {item.product.product_price * item.quantity}</td>
                    <td>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ padding: "4px 10px", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 style={{ textAlign: "right", marginTop: "20px" }}>Total: AED {getTotal()}</h3>
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                style={{
                  padding: "12px 25px",
                  fontSize: "16px",
                  cursor: checkoutLoading ? "not-allowed" : "pointer",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px"
                }}
              >
                {checkoutLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : null}
                {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartView;