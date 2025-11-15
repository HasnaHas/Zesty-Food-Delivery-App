import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!token) {
      console.log("No token available for fetching orders");
      return;
    }
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token: token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.log("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Group same items and sum quantities
  const groupItems = (items) => {
    const grouped = {};
    items.forEach(item => {
      if (grouped[item.name]) {
        grouped[item.name] += item.quantity;
      } else {
        grouped[item.name] = item.quantity;
      }
    });
    return Object.entries(grouped).map(([name, quantity]) => ({ name, quantity }));
  };

  const activeOrders = data.filter(order => order.status !== "Delivered");
  const pendingReviews = data.filter(order => order.status === "Delivered" && !order.reviewed);

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "green";
      case "Pending": return "orange";
      case "Cancelled": return "red";
      default: return "gray";
    }
  }

  const renderOrders = (orders) => {
    return orders.map((order, index) => {
      const groupedItems = groupItems(order.items);
      return (
        <div key={index} className="my-orders-order">
          <img src={assets.parcel_icon} alt="Order" />
          <div className="items-list">
            {groupedItems.map((item, idx) => (
              <p key={idx}>{item.name} x {item.quantity}</p>
            ))}
          </div>
          <p className="amount">${order.amount}.00</p>
          <p className="status" style={{ color: getStatusColor(order.status) }}>
            <span>&#x25cf;</span>
            <b> {order.status}</b>
          </p>
          {order.status !== "Delivered" && <button onClick={fetchOrders}>Track Order Status</button>}
          {order.status === "Delivered" && !order.reviewed && <button onClick={() => navigate(`/review/${order._id}`)}>Review Order</button>}
          {order.status === "Delivered" && order.reviewed && (
            <div className="review">
              <p>Review: {order.reviewStars} stars</p>
              {order.reviewText && <p>"{order.reviewText}"</p>}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="tabs">
        <button className={activeTab === "active" ? "active" : ""} onClick={() => setActiveTab("active")}>Active Orders</button>
        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>Pending Reviews</button>
      </div>

      <div className="container">
        {/* Header Row */}
        <div className="my-orders-header">
          <p>Image</p>
          <p>Items</p>
          <p>Amount</p>
          <p>Status</p>
          <p> </p>
        </div>

        {activeTab === "active" && (
          activeOrders.length === 0 ? (
            <div className="no-orders">
              <p>No active orders</p>
            </div>
          ) : (
            renderOrders(activeOrders)
          )
        )}

        {activeTab === "pending" && (
          pendingReviews.length === 0 ? (
            <div className="no-orders">
              <p>No items to review</p>
            </div>
          ) : (
            renderOrders(pendingReviews)
          )
        )}
      </div>
    </div>
  );
};

export default MyOrders;
