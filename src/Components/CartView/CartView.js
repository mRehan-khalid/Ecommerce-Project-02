import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // navigation ke liye
import Header from "../Header/header";

function CartView() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const navigate = useNavigate(); // navigate hook

  const user = JSON.parse(localStorage.getItem("user-info"));
  const userId = user?.id;

  useEffect(() => {
    if (userId) fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/userCart/${userId}`);
      setCartItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true); // loading start
      const res = await axios.post("http://localhost:8000/api/checkout", {
        user_id: userId
      });
      setCheckoutLoading(false); // loading end
      setCartItems([]); // cart clear
      // Navigate to invoice page with order data
      navigate(`/invoice/${res.data.order_id}`, { state: { orderData: res.data, cartItems } });
    } catch (err) {
      console.error(err);
      setCheckoutLoading(false);
      alert("Checkout failed");
    }
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.product_price * item.quantity,
      0
    );
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading cart...</p>;
  if (cartItems.length === 0) return <p style={{ textAlign: "center", marginTop: "50px" }}>Your cart is empty</p>;

  return (
    <div>
      <Header />
      <div style={{ width: "90%", margin: "20px auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Your Cart</h2>
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td>{item.product.product_name}</td>
                <td>{item.product.description}</td>
                <td>AED {item.product.product_price}</td>
                <td>{item.quantity}</td>
                <td>AED {item.product.product_price * item.quantity}</td>
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
            {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartView;