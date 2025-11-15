import React, { useContext } from "react";
import "./Navbar.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, admin, setAdmin, setToken } = useContext(StoreContext);

  const handleAuth = () => {
    if (token && admin) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      setToken("");
      setAdmin(false);
      toast.success("Logout Successfully");
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="navbar">
      <h1 className="logo-text">
        Zes<span className="logo-accent">ty</span>
      </h1>

      <div className="navbar-right">
        <button className="auth-btn" onClick={handleAuth}>
          {token && admin ? "Logout" : "Login"}
        </button>

        <div className="profile-container" onClick={() => navigate("/profile")}>
          <FaUser className="profile-icon" />
          <span className="tooltip">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
