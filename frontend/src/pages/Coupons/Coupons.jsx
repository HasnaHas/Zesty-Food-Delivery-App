import React, { useContext, useEffect, useState } from 'react';
import './Coupons.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Coupons = () => {
  const { url, token, applyPromoCode } = useContext(StoreContext);
  const [promos, setPromos] = useState([]);
  const [user, setUser] = useState(null);

  const fetchPromos = async () => {
    try {
      const response = await axios.get(`${url}/api/promo/listall`);
      if (response.data.success) setPromos(response.data.data);
    } catch (error) {
      console.log("Error fetching promos:", error);
    }
  };

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${url}/api/user/profile`, { headers: { token } });
      if (response.data.success) setUser(response.data.user);
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchPromos();
    fetchUser();
  }, [token]);

  const formatDiscount = (promo) =>
    promo.discountType === 'percentage' ? `${promo.discountValue}% off` : `$${promo.discountValue} off`;

  const isExpired = (expiryDate) => new Date() > new Date(expiryDate);

  const isEligible = (promo) => {
    if (!user) return false;
    if (promo.eligibilityType === 'new_users') {
      return user.createdAt && new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    return true;
  };

  const eligiblePromos = promos.filter(p => !isExpired(p.expiry) && isEligible(p));
  const ineligiblePromos = promos.filter(p => !isExpired(p.expiry) && !isEligible(p));

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => toast.success(`Coupon code "${code}" copied!`))
      .catch(() => toast.error('Failed to copy coupon code'));
  };

  // ✅ Instant apply promo
  const handleApplyPromo = (code) => {
    if (!token) return toast.error("Login required to apply promo");
    applyPromoCode(code);
  };

  return (
    <div className='coupons-page'>
      <div className="coupons-header">
        <h1>Available Coupons</h1>
        <p>Find and apply coupons to save on your orders</p>
      </div>

      {eligiblePromos.length > 0 && (
        <div className="coupons-section">
          <h2>Eligible for You</h2>
          <div className="coupons-grid">
            {eligiblePromos.map((promo) => (
              <div key={promo._id} className="coupon-card eligible">
                <div className="coupon-header">
                  <span className="coupon-type">{promo.type.toUpperCase()}</span>
                  <div className="coupon-code-section">
                    <span className="coupon-code">{promo.code}</span>
                    <button className="copy-btn" onClick={() => copyToClipboard(promo.code)}>Copy</button>
                  </div>
                </div>
                <div className="coupon-body">
                  <h3>{formatDiscount(promo)}</h3>
                  <p>{promo.description}</p>
                  {promo.minOrderValue > 0 && <p>Min. order: ${promo.minOrderValue}</p>}
                  <p>Expires: {new Date(promo.expiry).toLocaleDateString()}</p>
                </div>
                <div className="coupon-footer">
                  {promo.usageLimit && <span>{promo.usedCount}/{promo.usageLimit} used</span>}
                  <button className="apply-btn" onClick={() => handleApplyPromo(promo.code)}>
                    Apply at Checkout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ineligiblePromos.length > 0 && (
        <div className="coupons-section">
          <h2>Other Available Coupons</h2>
          <div className="coupons-grid">
            {ineligiblePromos.map((promo) => (
              <div key={promo._id} className="coupon-card ineligible">
                <div className="coupon-header">
                  <span className="coupon-type">{promo.type.toUpperCase()}</span>
                  <div className="coupon-code-section">
                    <span className="coupon-code">{promo.code}</span>
                    <button className="copy-btn" onClick={() => copyToClipboard(promo.code)}>Copy</button>
                  </div>
                </div>
                <div className="coupon-body">
                  <h3>{formatDiscount(promo)}</h3>
                  <p>{promo.description}</p>
                  {promo.minOrderValue > 0 && <p>Min. order: ${promo.minOrderValue}</p>}
                  <p>Expires: {new Date(promo.expiry).toLocaleDateString()}</p>
                </div>
                <div className="coupon-footer">
                  {promo.eligibilityType === 'new_users' && <span>New users only</span>}
                  {promo.usageLimit && <span>{promo.usedCount}/{promo.usageLimit} used</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {promos.filter(p => isExpired(p.expiry)).length > 0 && (
        <div className="coupons-section">
          <h2>Expired Coupons</h2>
          <div className="coupons-grid">
            {promos.filter(p => isExpired(p.expiry)).map((promo) => (
              <div key={promo._id} className="coupon-card expired">
                <div className="coupon-header">
                  <span>{promo.type.toUpperCase()}</span>
                  <span>{promo.code}</span>
                </div>
                <div className="coupon-body">
                  <h3>{formatDiscount(promo)}</h3>
                  <p>{promo.description}</p>
                  <p className="expired-text">Expired: {new Date(promo.expiry).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
