import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import "./Login.css";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "/api/user/login", data);
      if (response.data.success) {
        if (response.data.role === "admin") {
          setToken(response.data.token);
          setAdmin(true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("admin", true);
          toast.success("Login Successful");
          navigate("/add");
        } else {
          toast.error("You are not an admin");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Login failed, please try again");
    }
  };


  useEffect(() => {
    if (admin && token) navigate("/add");
  }, [admin, token, navigate]);

  return (
    <div className="login-page">
      <form onSubmit={onLogin} className="login-popup-container">
        <h2 className="login-title">Admin Login</h2>
        <div className="login-inputs">
          <div className="input-group">
            <AiOutlineMail className="input-icon" />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={data.email}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="input-group">
            <AiOutlineLock className="input-icon" />
            <input
              name="password"
              type="password"
              placeholder="Your password"
              value={data.password}
              onChange={onChangeHandler}
              required
            />
          </div>
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
