import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext"; // ✅ correct path

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useContext(StoreContext);

  useEffect(() => {
    const verifyPayment = async () => {
      const success = searchParams.get("success");
      const orderId = searchParams.get("orderId");

      if (!orderId) {
        toast.error("Missing order ID!");
        navigate("/");
        return;
      }

      try {
        const res = await axios.post("http://localhost:4000/api/order/verify", {
          orderId,
          success,
        });

        if (res.data.success) {
          clearCart();
          toast.success("Payment verified successfully!");
          navigate("/myorders");
        } else {
          toast.error("Payment failed or cancelled.");
          navigate("/");
        }
      } catch (err) {
        console.error("Verification error:", err);
        toast.error("Error verifying payment");
        navigate("/");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="verify-container">
      <h2>Verifying your payment...</h2>
    </div>
  );
};

export default Verify;
