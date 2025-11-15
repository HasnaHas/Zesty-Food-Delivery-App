import React, { useState } from 'react';
import './AddPromo.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddPromo = () => {
  const url = "http://localhost:4000";
  const [data, setData] = useState({
    code: "",
    type: "promo",
    discountType: "percentage",
    discountValue: "",
    expiry: "",
    usageLimit: "",
    eligibilityType: "all",
    minOrderValue: "",
    description: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const payload = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== "") {
        payload[key] = data[key];
      }
    });

    const response = await axios.post(`${url}/api/promo/add`, payload, {
      headers: {
        token: localStorage.getItem("token"),
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      setData({
        code: "",
        type: "promo",
        discountType: "percentage",
        discountValue: "",
        expiry: "",
        usageLimit: "",
        eligibilityType: "all",
        minOrderValue: "",
        description: "",
      });
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-product-name flex-col">
          <p>Promo Code</p>
          <input
            onChange={onChangeHandler}
            value={data.code}
            type="text"
            name="code"
            placeholder="Enter promo code"
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Type</p>
          <select onChange={onChangeHandler} name="type" value={data.type}>
            <option value="promo">Promo</option>
            <option value="coupon">Coupon</option>
          </select>
        </div>
        <div className="add-product-name flex-col">
          <p>Discount Type</p>
          <select onChange={onChangeHandler} name="discountType" value={data.discountType}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="add-product-name flex-col">
          <p>Discount Value</p>
          <input
            onChange={onChangeHandler}
            value={data.discountValue}
            type="number"
            name="discountValue"
            placeholder={data.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 50'}
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Expiry Date</p>
          <input
            onChange={onChangeHandler}
            value={data.expiry}
            type="datetime-local"
            name="expiry"
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Usage Limit (leave empty for unlimited)</p>
          <input
            onChange={onChangeHandler}
            value={data.usageLimit}
            type="number"
            name="usageLimit"
            placeholder="e.g., 100"
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Eligibility Type</p>
          <select onChange={onChangeHandler} name="eligibilityType" value={data.eligibilityType}>
            <option value="all">All Users</option>
            <option value="new_users">New Users Only</option>
          </select>
        </div>
        <div className="add-product-name flex-col">
          <p>Minimum Order Value</p>
          <input
            onChange={onChangeHandler}
            value={data.minOrderValue}
            type="number"
            name="minOrderValue"
            placeholder="e.g., 100"
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="3"
            placeholder="Describe the promo"
            required
          />
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
};

export default AddPromo;
