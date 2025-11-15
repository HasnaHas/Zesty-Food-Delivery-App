import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const { clearCart, setAppliedPromo, setPromoDiscount } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
    if (typeof setAppliedPromo === "function") setAppliedPromo(null);
    if (typeof setPromoDiscount === "function") setPromoDiscount(0);

    toast.success("Payment successful! Cart cleared.");

    const t = setTimeout(() => {
      navigate("/myorders");
    }, 900);

    return () => clearTimeout(t);
  }, [clearCart, setAppliedPromo, setPromoDiscount, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>Payment successful </h2>
      <p>Preparing your order and redirecting to My Orders...</p>
    </div>
  );
};

export default PaymentSuccess;
