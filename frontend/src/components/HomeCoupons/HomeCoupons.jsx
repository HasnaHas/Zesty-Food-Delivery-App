import React, { useContext, useEffect, useState } from 'react';
import './HomeCoupons.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const HomeCoupons = () => {
  const { url } = useContext(StoreContext);
  const [promos, setPromos] = useState([]);

  const fetchPromos = async () => {
    try {
      const response = await axios.get(`${url}/api/promo/listall`);
      if (response.data.success) setPromos(response.data.data);
    } catch (error) {
      console.log("Error fetching promos:", error);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const formatDiscount = (promo) =>
    promo.discountType === 'percentage'
      ? `${promo.discountValue}% off`
      : `$${promo.discountValue} off`;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Promo code "${code}" copied!`);
  };

  const isExpired = (expiryDate) => new Date() > new Date(expiryDate);

  return (
    <div className='home-coupons' id="home-coupons">
      <div className="coupons-wrapper">
        <h2>Available Promos & Coupons</h2>
        <div className="coupons-grid">
          {promos.slice(0, 4).map((promo) => (
            <div key={promo._id} className={`coupon-card ${isExpired(promo.expiry) ? 'expired' : ''}`}>
              <div className="coupon-header">
                <span className="coupon-type">{promo.type.toUpperCase()}</span>
                <span className="coupon-code">{promo.code}</span>
              </div>
              <div className="coupon-body">
                <h3>{formatDiscount(promo)}</h3>
                <p className="coupon-description">{promo.description}</p>
                {promo.minOrderValue > 0 && <p className="min-order">Min. order: ${promo.minOrderValue}</p>}
                <p className="expiry">Expires: {new Date(promo.expiry).toLocaleDateString()}</p>
              </div>
              <div className="coupon-footer">
                {promo.eligibilityType === 'new_users' && <span className="new-user-badge">New Users</span>}
                {promo.usageLimit && (
                  <span className="usage-limit">
                    {promo.usedCount}/{promo.usageLimit} used
                  </span>
                )}
                <button className="copy-code-btn" onClick={() => copyCode(promo.code)}>Copy Code</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCoupons;
