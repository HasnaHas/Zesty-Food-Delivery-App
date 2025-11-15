import React, { useEffect, useState } from 'react';
import './ListPromo.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const ListPromo = () => {
  const url = "http://localhost:4000";
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/promo/listall`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removePromo = async (promoId) => {
    const response = await axios.post(`${url}/api/promo/remove`, {
      id: promoId
    }, {
      headers: { token: localStorage.getItem("token") }
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Promos and Coupons</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Code</b>
          <b>Type</b>
          <b>Discount</b>
          <b>Expiry</b>
          <b>Usage</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <p>{item.code}</p>
              <p>{item.type}</p>
              <p>{item.discountType === 'percentage' ? `${item.discountValue}%` : `$${item.discountValue}`}</p>
              <p>{new Date(item.expiry).toLocaleDateString()}</p>
              <p>{item.usedCount || 0}/{item.usageLimit || '∞'}</p>
              <p onClick={() => removePromo(item._id)} className='cursor'>X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListPromo;
