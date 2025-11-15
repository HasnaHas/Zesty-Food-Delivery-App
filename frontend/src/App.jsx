import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import FoodDetailsDisplay from "./components/FoodDisplay/FoodDisplay";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import SearchResults from "./pages/SearchResults/SearchResults";
import Coupons from "./pages/Coupons/Coupons";
import History from "./pages/History/History";
import Review from "./pages/Review/Review";
import PaymentSuccess from "./pages/pages/PaymentSuccess";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <ToastContainer />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/food/:id" element={<FoodDetailsDisplay />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/history" element={<History />} />
          <Route path="/review/:orderId" element={<Review />} />

        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
