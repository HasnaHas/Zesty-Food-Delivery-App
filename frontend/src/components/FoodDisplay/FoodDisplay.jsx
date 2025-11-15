import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import "./FoodDisplay.css";

const FoodDetailsDisplay = ({ category = "All", searchResults = null }) => {
  const { id } = useParams();
  const { food_list } = useContext(StoreContext);

  // Single food detail
  if (id) {
    const food = food_list.find((item) => item._id === id);
    if (!food) return <div>Food not found</div>;

    return (
      <div className="food-display" id="food-display">
        <h2>{food.name}</h2>
        <div className="food-display-list">
          <FoodItem {...food} />
        </div>
      </div>
    );
  }

  // Search results
  if (searchResults && searchResults.length > 0) {
    return (
      <div className="food-display" id="food-display">
        <h2>Search Results</h2>
        <div className="food-display-list">
          {searchResults.map((item) => (
            <FoodItem key={item._id} {...item} />
          ))}
        </div>
      </div>
    );
  }

  // all foods
  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list
          .filter((item) => category === "All" || item.category === category)
          .map((item) => (
            <FoodItem key={item._id} {...item} />
          ))}
      </div>
    </div>
  );
};

export default FoodDetailsDisplay;
