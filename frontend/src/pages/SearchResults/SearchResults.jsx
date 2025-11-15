import React from "react";
import { useLocation } from "react-router-dom";
import FoodDetailsDisplay from "../../components/FoodDisplay/FoodDisplay";

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] }; // get search results from Navbar

  return <FoodDetailsDisplay searchResults={results} />;
};

export default SearchResults;
