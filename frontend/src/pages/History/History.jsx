import React, { useContext, useEffect, useState } from "react";
import "./History.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { MdHistory, MdCheckCircle, MdStar, MdComment, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const History = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token: token } }
      );
      if (response.data.success) {
        const deliveredReviewed = response.data.data.filter(
          order => order.status === "Delivered" && order.reviewed
        );
        setData(deliveredReviewed);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/userdelete",
        { orderId },
        { headers: { token: token } }
      );
      if (response.data.success) {
        toast.success("Order removed successfully");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing order:", error);
      toast.error("Failed to remove order");
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const groupItems = (items) => {
    const grouped = {};
    items.forEach(item => {
      if (grouped[item.name]) grouped[item.name] += item.quantity;
      else grouped[item.name] = item.quantity;
    });
    return Object.entries(grouped).map(([name, quantity]) => ({ name, quantity }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="history">
      <div className="history-header">
        <MdHistory className="history-icon" />
        <h2>Order History</h2>
      </div>
      <div className="container">
        {data.length === 0 ? (
          <div className="no-orders">
            <p>No order history available</p>
          </div>
        ) : (
          data.map((order, index) => {
            const groupedItems = groupItems(order.items);
            return (
              <div key={index} className="history-card">
                <div className="history-items">
                  {groupedItems.map((item, idx) => (
                    <p key={idx}>{item.name} x {item.quantity}</p>
                  ))}
                </div>
                <p className="history-amount">${order.amount}.00</p>
                <p className="history-date">{formatDate(order.date)}</p>
                <p className="history-status"><MdCheckCircle className="status-icon" /> Delivered</p>
                <div className="history-review">
  <MdStar className="star-icon" /> 
  {order.reviewStars ? order.reviewStars : 0} stars
</div>
                <button className="remove-btn" onClick={() => handleRemoveOrder(order._id)}><MdDelete /></button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
