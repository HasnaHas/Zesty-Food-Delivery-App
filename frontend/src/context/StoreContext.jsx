import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [ratings, setRatings] = useState({});
  const [token, setToken] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const url = "http://localhost:4000";

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev, [itemId]: (Number(prev[itemId]) || 0) + 1 };
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        const res = await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
        res.data.success ? toast.success("Item added to cart ") : toast.error("Error adding item");
      } catch (err) {
        toast.error("Error adding item");
        console.error(err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (Number(updated[itemId]) > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        const res = await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
        res.data.success ? toast.info("Item removed from cart ") : toast.error("Error removing item");
      } catch (err) {
        toast.error("Error removing item");
        console.error(err);
      }
    }
  };

const clearCart = () => {
  setCartItems({});
  localStorage.removeItem("cartItems");
  console.log("Cart cleared after successful payment");
};

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const quantity = Number(cartItems[itemId] || 0);
      const itemInfo = food_list.find((f) => f._id === itemId);
      const price = itemInfo ? Number(itemInfo.price || 0) : 0;
      totalAmount += price * quantity;
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) setFoodList(res.data.data);
    } catch (err) {
      console.error("Error fetching food list:", err);
    }
  };

  const fetchAllRatings = async () => {
    try {
      const updatedRatings = {};
      const updatedFoodList = food_list.map((f) => ({ ...f }));

      for (let food of food_list) {
        const res = await axios.get(`${url}/api/food/ratings/${food._id}`);
        if (res.data.success) {
          const { avgRating, reviewCount } = res.data;
          updatedRatings[food._id] = { avgRating, reviewCount };

          const index = updatedFoodList.findIndex((item) => item._id === food._id);
          if (index !== -1) {
            updatedFoodList[index].avgRating = avgRating;
            updatedFoodList[index].reviewCount = reviewCount;
          }
        }
      }

      setRatings(updatedRatings);
      setFoodList(updatedFoodList);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const updateRatingAfterReview = (foodId, newStars) => {
    setFoodList((prev) =>
      prev.map((f) =>
        f._id === foodId
          ? {
              ...f,
              avgRating: f.avgRating
                ? (f.avgRating * (f.reviewCount || 0) + newStars) / ((f.reviewCount || 0) + 1)
                : newStars,
              reviewCount: (f.reviewCount || 0) + 1,
            }
          : f
      )
    );

    setRatings((prev) => ({
      ...prev,
      [foodId]: {
        avgRating: prev[foodId]?.avgRating
          ? (prev[foodId].avgRating * (prev[foodId].reviewCount || 0) + newStars) / ((prev[foodId].reviewCount || 0) + 1)
          : newStars,
        reviewCount: (prev[foodId]?.reviewCount || 0) + 1,
      },
    }));
  };

  const applyPromoCode = async (code) => {
    try {
      const response = await axios.post(
        `${url}/api/promo/apply`,
        { code, orderAmount: getTotalCartAmount() },
        { headers: { token } }
      );
      if (response.data.success) {
        setPromoDiscount(response.data.discount);
        setAppliedPromo(response.data.promo);
        toast.success(`Promo "${response.data.promo.code}" applied!`);
      } else {
        setPromoDiscount(0);
        setAppliedPromo(null);
        toast.error(response.data.message || "Invalid promo");
      }
    } catch (error) {
      setPromoDiscount(0);
      setAppliedPromo(null);
      toast.error("Failed to apply promo");
      console.log(error);
    }
  };

  const removePromo = () => {
    setPromoDiscount(0);
    setAppliedPromo(null);
    toast.info("Promo removed");
  };


  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) setToken(savedToken);

      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) setCartItems(JSON.parse(savedCart));
    }
    loadData();
  }, []);

  useEffect(() => {
    if (food_list.length) fetchAllRatings();
  }, [food_list]);

  const contextValue = {
    food_list,
    cartItems,
    setToken,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    ratings,
    updateRatingAfterReview,
    fetchAllRatings,
    url,
    token,
    deliveryInfo,
    setDeliveryInfo,
    appliedPromo,
    promoDiscount,
    applyPromoCode,
    removePromo,
    setAppliedPromo,
    setPromoDiscount,
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export default StoreContextProvider;
