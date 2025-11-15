import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { 
  AiOutlinePlusCircle, 
  AiOutlineUnorderedList, 
  AiOutlineShoppingCart, 
  AiOutlineTag 
} from 'react-icons/ai';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='add' className="sidebar-option" data-label="Add Items">
  <AiOutlinePlusCircle className='sidebar-icon' />
  <p>Add Items</p>
</NavLink>
<NavLink to='list' className="sidebar-option" data-label="List Items">
  <AiOutlineUnorderedList className='sidebar-icon' />
  <p>List Items</p>
</NavLink>
<NavLink to='orders' className="sidebar-option" data-label="Orders">
  <AiOutlineShoppingCart className='sidebar-icon' />
  <p>Orders</p>
</NavLink>
<NavLink to='addpromo' className="sidebar-option" data-label="Add Promo">
  <AiOutlinePlusCircle className='sidebar-icon' />
  <p>Add Promo</p>
</NavLink>
<NavLink to='listpromo' className="sidebar-option" data-label="List Promos">
  <AiOutlineTag className='sidebar-icon' />
  <p>List Promos</p>
</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
