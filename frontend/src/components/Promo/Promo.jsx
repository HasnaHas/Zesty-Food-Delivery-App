import React, { useState, useContext, useEffect } from 'react';
import './Promo.css';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Promo = ({ subtotal, setDiscount, setAppliedPromo, prefilledCode }) => {
  const [promoCode, setPromoCode] = useState(prefilledCode || '');
  const [loading, setLoading] = useState(false);
  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    if (prefilledCode) {
      setPromoCode(prefilledCode);
    }
  }, [prefilledCode]);

  const applyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(url + '/api/promo/apply', {
        code: promoCode.toUpperCase(),
        orderAmount: subtotal
      }, { headers: { token } });

      if (response.data.success) {
        setDiscount(response.data.discount);
        setAppliedPromo({
          code: response.data.promo.code,
          description: response.data.promo.description,
          discount: response.data.discount
        });
        toast.success(`Promo applied! You saved $${response.data.discount.toFixed(2)}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error applying promo code');
    } finally {
      setLoading(false);
    }
  };

  const removePromo = () => {
    setDiscount(0);
    setAppliedPromo(null);
    setPromoCode('');
    toast.info('Promo code removed');
  };

  return (
    <div className="promo-section">
      <h3>Have a Promo Code?</h3>
      <div className="promo-input-container">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="promo-input"
        />
        <button
          onClick={applyPromo}
          disabled={loading}
          className="promo-apply-btn"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {setAppliedPromo && (
        <button onClick={removePromo} className="promo-remove-btn">
          Remove Promo
        </button>
      )}
    </div>
  );
};

export default Promo;
