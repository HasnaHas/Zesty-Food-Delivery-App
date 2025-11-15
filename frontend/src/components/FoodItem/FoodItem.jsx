import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ _id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url, ratings } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleClick = () => navigate(`/food/${_id}`);

  const avgRating = ratings[_id]?.avgRating ?? 0;
  const reviewCount = ratings[_id]?.reviewCount ?? 0;

  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(avgRating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) stars.push(<span key={i} className="star full">★</span>);
      else if (i - 0.5 === roundedRating) stars.push(<span key={i} className="star half">★</span>);
      else stars.push(<span key={i} className="star empty">☆</span>);
    }
    return stars;
  };

  return (
    <div className="food-item" onClick={handleClick}>
      <div className="food-item-img-container">
        <div className="food-item-img-wrapper">
          <img src={url + "/images/" + image} alt={name} className="food-item-image" />
        </div>
        {!cartItems[_id] ? (
          <img
            className="add"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(_id);
            }}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(_id);
              }}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartItems[_id]}</p>
            <img
              onClick={(e) => {
                e.stopPropagation();
                addToCart(_id);
              }}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="rating-display">
            {renderStars()}
            <span className="rating-text">{avgRating.toFixed(1)} ({reviewCount})</span>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
