import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { MdStar } from "react-icons/md";
import "./Review.css";

const Review = () => {
  const { orderId } = useParams();
  const { url, token, updateRatingAfterReview } = useContext(StoreContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [stars, setStars] = useState(5);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.post(
          `${url}/api/order/userorders`,
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          const foundOrder = response.data.data.find(
            o => o._id === orderId
          );
          if (foundOrder && foundOrder.status === "Delivered" && !foundOrder.reviewed) {
            setOrder(foundOrder);
          } else {
            toast.error("Order not found or not eligible for review");
            navigate("/myorders");
          }
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Error loading order");
        navigate("/myorders");
      }
    };

    if (token) fetchOrder();
  }, [orderId, token, url, navigate]);

  const submitReview = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/submitreview`,
        { orderId, stars },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        order.items.forEach(item => updateRatingAfterReview(item._id, stars));
        navigate("/myorders");
      } else {
        toast.error(response.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error("Error submitting review");
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="review">
      <div className="order-summary">
        <div className="items">
          {order.items.map((item, index) => (
            <p key={index}>
              {item.name} x {item.quantity}
            </p>
          ))}
        </div>
        <p className="history-amount">Total: ${order.amount}.00</p>
      </div>

      <div className="review-form">
        <h3>Rate Your Order</h3>
        <div className="stars-select">
          {[1, 2, 3, 4, 5].map(s => (
            <span
              key={s}
              className={s <= stars ? "star active" : "star"}
              onClick={() => setStars(s)}
            >
              ★
            </span>
          ))}
          <span className="star-text">{stars} stars</span>
        </div>

        <button className="submit-btn" onClick={submitReview}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Review;
