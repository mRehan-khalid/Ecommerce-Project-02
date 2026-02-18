import React, { useState } from "react";
import "./CartInvoice.css"; // Custom CSS file
import Header from "../Header/header";

function CartInvoicePage({ cartItems, orderData, onBackToHome }) {
  const [loading, setLoading] = useState(false);

  if (!orderData) {
    return <p>No order data available.</p>;
  }

  const orderNumber = `91703-ABC${orderData.order_id}`;
  const totalAmount = orderData.total_amount;

  return (
    <div className="invoice-container">
      <Header />
      <div className="invoice-box">
        {loading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <h1 className="invoice-title">Thank You!</h1>
        <p className="invoice-subtitle">
          Your order has been placed successfully.
        </p>
        <p className="order-number">Order Number: <strong>{orderNumber}</strong></p>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price (AED)</th>
              <th>Quantity</th>
              <th>Subtotal (AED)</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.product.product_name}</td>
                <td>{item.product.description}</td>
                <td>{item.product.product_price}</td>
                <td>{item.quantity}</td>
                <td>{item.product.product_price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="invoice-total">Total: AED {totalAmount}</h2>

        <button className="back-home-btn" onClick={onBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default CartInvoicePage;