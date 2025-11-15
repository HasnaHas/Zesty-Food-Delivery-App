import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { 
  FaUserCircle, 
  FaClipboardList, 
  FaHistory, 
  FaSignOutAlt 
} from "react-icons/fa"; 
import { FiSearch, FiShoppingCart } from "react-icons/fi";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, food_list } = useContext(StoreContext);
  const [searchText, setSearchText] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const filteredFoods = food_list.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const highlightMatch = (text) => {
    const index = text.toLowerCase().indexOf(searchText.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <strong style={{ color: "#FF7A00" }}>{text.slice(index, index + searchText.length)}</strong>
        {text.slice(index + searchText.length)}
      </>
    );
  };

  const goToFood = (item) => {
    if (!item) return toast.error("Food not available");
    navigate(`/food/${item._id}`);
    setHistory((prev) => {
      const updated = [item.name, ...prev.filter((x) => x !== item.name)].slice(0, 5);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
    setSearchText("");
  };

  const searchTrigger = () => {
    if (filteredFoods.length > 0) {
      navigate("/search", { state: { results: filteredFoods } });
      setSearchText("");
    } else {
      toast.error("No matching food found");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" className="zesty-logo">
        <span className="logo-text">Zes<span className="logo-accent">ty</span></span>
      </Link>

      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href="#home-coupons" onClick={() => setMenu("coupons")} className={menu === "coupons" ? "active" : ""}>Coupons</a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
      </ul>

      <div className="navbar-right">
        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search your craving..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchTrigger()}
          />
          <FiSearch className="search-icon" onClick={searchTrigger} size={20} />
          {searchText && (
            <div className="suggestions">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((item) => (
                  <div key={item._id} onClick={() => goToFood(item)} className="suggestion-item">
                    {highlightMatch(item.name)}
                  </div>
                ))
              ) : (
                <p className="no-result">No results</p>
              )}
            </div>
          )}
        </div>

        <div className="navbar-search-icon" onClick={() => navigate("/cart")}>
          <FiShoppingCart size={22} color="#5A3E2B" />
          {getTotalCartAmount() > 0 && <span className="dot"></span>}
        </div>

        {!token ? (
          <button className="zesty-btn" onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <FaUserCircle size={28} color="#5A3E2B" className="profile-icon" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <FaClipboardList style={{ marginRight: "8px" }} />
                <p>Orders</p>
              </li>
              <li onClick={() => navigate("/history")}>
                <FaHistory style={{ marginRight: "8px" }} />
                <p>History</p>
              </li>
              <li onClick={logout}>
                <FaSignOutAlt style={{ marginRight: "8px" }} />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
