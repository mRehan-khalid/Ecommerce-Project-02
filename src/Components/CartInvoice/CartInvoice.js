import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFilePdf } from "react-icons/fa"; // PDF icon
import "./CartInvoice.css";
import Header from "../Header/header";

function CartInvoicePage({ cartItems, orderData, onBackToHome }) {
  const [loading, setLoading] = useState(false);
  const invoiceRef = useRef();
  const thermalRef = useRef();

  if (!orderData) return <p>No order data available.</p>;

  const orderNumber = `91703-ABC${orderData.order_id}`;
  const totalAmount = cartItems.reduce(
    (acc, item) =>
      acc +
      ((item.product.product_price || 0) * (item.quantity || 1) -
        (item.discount || 0) +
        (item.tax || 0)),
    0
  );

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {});

  const downloadThermalPDF = () => {
    setLoading(true);
    html2canvas(thermalRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [80, 200],
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 80;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${orderNumber}.pdf`);
      setLoading(false);
    });
  };

  return (
    <div>
      <Header />

      <div className="invoice-container">
        <div className="invoice-top-actions">
        </div>

        <div className="invoice-box-wrapper">
          <button className="download-pdf-btn" onClick={downloadThermalPDF}>
            <FaFilePdf style={{ marginRight: "5px" }} />
            Download PDF
          </button>
          <div className="invoice-box" ref={invoiceRef}>
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
                {cartItems.map((item) => {
                  const subtotal =
                    item.product.product_price * item.quantity -
                    (item.discount || 0) +
                    (item.tax || 0);
                  return (
                    <tr key={item.id}>
                      <td>{item.product.product_name}</td>
                      <td>{item.product.description}</td>
                      <td>{formatNumber(item.product.product_price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatNumber(subtotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h2 className="invoice-total">
              Total: AED {formatNumber(totalAmount)}
            </h2>

            <div className="invoice-actions">
              <button className="back-home-btn" onClick={onBackToHome}>
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Spinner overlay */}
        {loading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div
          style={{ position: "absolute", left: "-9999px", top: 0 }}
          ref={thermalRef}
          className="thermal-invoice"
        >
          <h1>E-Commerce Platform</h1>
          <h3>Muhammad Rehan Khalid</h3>
          <p>Email: muhammadrehan02@gmail.com</p>
          <p>Contact: +971 55 955 8748</p>
          <hr />
          <p>Order Number: {orderNumber}</p>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Disc</th>
                <th>Tax</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const subtotal =
                  item.product.product_price * item.quantity -
                  (item.discount || 0) +
                  (item.tax || 0);
                return (
                  <tr key={item.id}>
                    <td>{item.product.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatNumber(item.product.product_price)}</td>
                    <td>{formatNumber(item.discount || 0)}</td>
                    <td>{formatNumber(item.tax || 0)}</td>
                    <td>{formatNumber(subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr />
          <p className="total">Total: AED {formatNumber(totalAmount)}</p>
          <p className="footer">Thank you for your purchase!</p>
          <p className="footer">© Muhammad Rehan Khalid</p>
        </div>
      </div>
    </div>
  );
}

export default CartInvoicePage;