import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token: token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      url + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      { headers: { token: token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
    }
  };
  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
  }, []);

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

  const activeOrders = orders.filter(order => order.status !== "Delivered");
  const deliveredOrders = orders.filter(order => order.status === "Delivered");

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await axios.post(
          url + "/api/order/delete",
          { orderId },
          { headers: { token: token } }
        );
        if (response.data.success) {
          toast.success("Order deleted successfully");
          fetchAllOrder();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error deleting order");
      }
    }
  };

  const selectAll = () => {
    const allOrderIds = deliveredOrders.map(order => order._id);
    if (window.confirm(`Delete all ${allOrderIds.length} delivered orders?`)) {
      allOrderIds.forEach(orderId => deleteOrder(orderId));
    }
  };

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="tabs">
        <button className={activeTab === "active" ? "active" : ""} onClick={() => setActiveTab("active")}>Active Orders</button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>Order History</button>
      </div>
      {activeTab === "history" && (
        <div className="bulk-actions">
          <button onClick={selectAll} className="select-all-btn">Delete All Delivered Orders</button>
        </div>
      )}
      <div className="order-list">
        {(activeTab === "active" ? activeOrders : deliveredOrders).map((order, index) => {
          const groupedItems = groupItems(order.items);
          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <div className="order-item-food">
                  {groupedItems.map((item, idx) => (
                    <p key={idx}>{item.name} x {item.quantity}</p>
                  ))}
                </div>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${order.amount}</p>
              {activeTab === "active" && (
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              )}
              {activeTab === "history" && (
                <div className="order-actions">
                  <p>Status: {order.status}</p>
                  {order.reviewed && <p>Reviewed: {order.reviewStars} stars</p>}
                  <button onClick={() => deleteOrder(order._id)} className="delete-btn">Delete</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
