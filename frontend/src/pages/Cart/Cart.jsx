import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    url,
    applyPromoCode,
    removePromo,
    appliedPromo,
    promoDiscount,
    setAppliedPromo,
    setPromoDiscount
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : subtotal > 2000 ? 0 : 2;
  const total = subtotal + deliveryFee - promoDiscount;

  const handleApplyPromo = () => {
    if (!promoInput) return toast.error("Enter a promo code");
    applyPromoCode(promoInput);
    setPromoInput("");
  };

  const handleRemovePromo = () => {
    removePromo();
    setPromoInput("");
  };

  return (
    <div className="cart">
      <h2 className="cart-title">Shopping Cart</h2>

      <div className="cart-items">
        <div className="cart-items-header">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item) => {
          const quantity = Number(cartItems[item._id] || 0);
          if (quantity > 0) {
            const itemTotal = Number(item.price || 0) * quantity;
            return (
              <div key={item._id} className="cart-items-row">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
                <p>${Number(item.price || 0).toFixed(2)}</p>
                <p>{quantity}</p>
                <p>${itemTotal.toFixed(2)}</p>
                <p
                  onClick={() => removeFromCart(item._id)}
                  className="cross"
                >
                  ×
                </p>
              </div>
            );
          }
          return null;
        })}
        {subtotal === 0 && <p className="empty-cart">Your cart is empty.</p>}
      </div>

      {/* Promo Section & Cart Totals */}
      <div className="cart-bottom">
        <div className="cart-promocode">
          <div className="promos-header">
            <h3>Have a Promo Code?</h3>
            <p className="view-all" onClick={() => navigate("/coupons")}>
              view all promos
            </p>
          </div>

          {appliedPromo?.code ? (
            <div className="applied-promo">
              <span>{appliedPromo.code.toLowerCase()}</span>
              <button onClick={handleRemovePromo}>Remove</button>
            </div>
          ) : (
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button onClick={handleApplyPromo}>Apply</button>
            </div>
          )}
        </div>

        <div className="cart-total">
          <h3>Cart Totals</h3>
          <div className="cart-total-details">
            <p>Subtotal:</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee:</p>
            <p>${deliveryFee.toFixed(2)}</p>
          </div>
          {promoDiscount > 0 && (
            <div className="cart-total-details promo-applied">
              <p>Discount:</p>
              <p>-${promoDiscount.toFixed(2)}</p>
            </div>
          )}
          <hr />
          <div className="cart-total-details total">
            <b>Total:</b>
            <b>${total.toFixed(2)}</b>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate("/order")}
            disabled={subtotal === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
