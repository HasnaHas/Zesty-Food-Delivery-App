import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    url,
    promoDiscount,
    setPromoDiscount,
    appliedPromo,
    setAppliedPromo,
    removePromo,
    deliveryInfo,
    setDeliveryInfo,
    applyPromoCode
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: deliveryInfo.firstName || "",
    lastName: deliveryInfo.lastName || "",
    email: deliveryInfo.email || "",
    street: deliveryInfo.street || "",
    city: deliveryInfo.city || "",
    state: deliveryInfo.state || "",
    zipcode: deliveryInfo.zipcode || "",
    country: deliveryInfo.country || "",
    phone: deliveryInfo.phone || "",
  });

  const [promoInput, setPromoInput] = useState("");
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Apply promo from input
  const handleApplyPromo = () => {
    if (!promoInput) return toast.error("Enter a promo code");
    applyPromoCode(promoInput);
  };

  // Remove applied promo
  const handleRemovePromo = () => {
    setPromoInput("");
    setPromoDiscount(0);
    setAppliedPromo(null);
  };

  // Place order
  const placeOrder = async (e) => {
    e.preventDefault();

    if (!token) return toast.error("Please login first");
    if (getTotalCartAmount() === 0) return toast.error("Cart is empty");

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }));

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 2000 ? 0 : 2;
    const totalAmount = subtotal + deliveryFee - promoDiscount;

    const orderData = {
      address: data,
      items: orderItems,
      amount: subtotal,
      discount: promoDiscount,
      promoCode: appliedPromo?.code,
    };

    setDeliveryInfo(data);

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error placing order");
    }
  };

  useEffect(() => {
    if (location.state?.promoCode) {
      setPromoInput(location.state.promoCode);
      applyPromoCode(location.state.promoCode);
    }

    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Cart is empty");
      navigate("/cart");
    }
  }, [token, location.state]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First name"/>
          <input required name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last name"/>
        </div>
        <input required name="email" value={data.email} onChange={onChangeHandler} placeholder="Email"/>
        <input required name="street" value={data.street} onChange={onChangeHandler} placeholder="Street"/>
        <div className="multi-fields">
          <input required name="city" value={data.city} onChange={onChangeHandler} placeholder="City"/>
          <input required name="state" value={data.state} onChange={onChangeHandler} placeholder="State"/>
        </div>
        <div className="multi-fields">
          <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zip"/>
          <input required name="country" value={data.country} onChange={onChangeHandler} placeholder="Country"/>
        </div>
        <input required name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone"/>

        <div className="promo-section">
          <input
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Enter promo code"
          />
          <div className="promo-buttons">
            <button type="button" onClick={handleApplyPromo}>Apply Promo</button>
            {appliedPromo?.code && (
             <button type="button" className="remove-promo" onClick={() => { removePromo(); setPromoInput(""); }}>
  Remove
</button>
            )}
          </div>
          {appliedPromo?.code && (
            <p className="applied-promo">Applied: {appliedPromo.code.toLowerCase()}</p>
          )}
          <p onClick={() => navigate("/coupons")} className="view-coupons-link">
            View Available Coupons
          </p>
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal:</p><p>${getTotalCartAmount()}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee:</p><p>${getTotalCartAmount() > 2000 ? 0 : 2}</p>
          </div>
          {promoDiscount > 0 && (
            <div className="cart-total-details">
              <p>Discount:</p><p>-${promoDiscount.toFixed(2)}</p>
            </div>
          )}
          <div className="cart-total-details">
            <b>Total:</b>
            <b>${(getTotalCartAmount() + (getTotalCartAmount() > 2000 ? 0 : 2) - promoDiscount).toFixed(2)}</b>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
