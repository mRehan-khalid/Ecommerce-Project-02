import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./CartInvoice.css"; // Custom CSS file
import Header from "../Header/header";
import React, {useState, useEffect} from 'react';

function CartInvoicePage({ cartItems, orderData, onBackToHome }) {
  const [loading, setLoading] = useState(false);
  const invoiceRef = useRef();

  if (!orderData) {
    return <p>No order data available.</p>;
  }

  const orderNumber = `91703-ABC${orderData.order_id}`;
  const totalAmount = orderData.total_amount;

  const downloadPDF = () => {
    setLoading(true);
    const input = invoiceRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${orderNumber}.pdf`);
      setLoading(false);
    });
  };

  return (
    <div className="invoice-container">
      <Header />
      <div className="invoice-box" ref={invoiceRef}>
        {loading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <h1 className="invoice-title">Thank You!</h1>
        <p className="invoice-subtitle">
          Your order has been placed successfully.
        </p>
        <p className="order-number">
          Order Number: <strong>{orderNumber}</strong>
        </p>

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

        <button
          className="download-pdf-btn"
          onClick={downloadPDF}
          style={{ marginLeft: "10px" }}
        >
          Download Invoice PDF
        </button>
      </div>
    </div>
  );
}

export default CartInvoicePage;