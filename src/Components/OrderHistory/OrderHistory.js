import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header/header";
import "./OrderHistory.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const invoiceRef = useRef();
  const perPage = 10;

  const fetchOrders = (page = 1) => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const user = userInfo?.user;
    const userId = user?.id;

    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    setLoading(true);
    fetch(
      `http://localhost:8000/api/userOrders/${userId}?per_page=${perPage}&page=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status) {
          setOrders(data.orders);
          setCurrentPage(data.current_page);
          setLastPage(data.last_page);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong");
        console.error(err);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      fetchOrders(newPage);
    }
  };

  // Grand Total
  const grandTotal = orders.reduce(
    (acc, order) => acc + parseFloat(order.total_amount),
    0
  );

  const formattedGrandTotal = grandTotal.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // PDF Download
  const downloadPDF = () => {
    if (!invoiceRef.current) return;
    html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save("OrderHistory.pdf");
    });
  };

  // Excel Download
  const downloadExcel = () => {
    const data = orders.map((order) => ({
      "Order ID": order.id,
      Date: new Date(order.created_at).toLocaleDateString(),
      "Items Purchased": order.items
        .map((i) => `${i.product.product_name} (x${i.quantity})`)
        .join(", "),
      "Total Amount (AED)": parseFloat(order.total_amount).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrderHistory");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "OrderHistory.xlsx");
  };

  return (
    <div>
      <Header />
    <div className="order-history-container">

      <div className="order-history-actions">
        <button className="icon-btn pdf-btn" onClick={downloadPDF} title="Download PDF">
          <FaFilePdf size={24} />Download PDF
        </button>
        <button className="icon-btn excel-btn" onClick={downloadExcel} title="Download Excel">
          <FaFileExcel size={24} /> Download Excel
        </button>
      </div>

      <div className="order-history-wrapper">
        <h2 className="history-title">My Order History</h2>

        {loading && (
          <div className="spinner-center">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <p className="no-orders">No Orders Found</p>
        )}

        {!loading && orders.length > 0 && (
          <>
            <table className="order-history-table" ref={invoiceRef}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items Purchased</th>
                  <th>Total Amount (AED)</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <ul className="items-list">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product.product_name} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="amount">
                      AED {parseFloat(order.total_amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grand-total">
              <strong>Grand Total: AED {formattedGrandTotal}</strong>
            </div>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {lastPage}
              </span>
              <button
                disabled={currentPage === lastPage}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </div>
  );
}

export default OrderHistory;