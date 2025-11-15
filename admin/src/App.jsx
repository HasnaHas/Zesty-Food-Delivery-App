import React, { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import AddPromo from "./pages/AddPromo/AddPromo";
import ListPromo from "./pages/ListPromo/ListPromo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login";
import { StoreContext } from "./context/StoreContext";
import ProfilePage from "./pages/Profile/ProfilePage";


const App = () => {
  const url = "http://localhost:4000";
  const { token, admin } = useContext(StoreContext);

  return (
    <div>
      <ToastContainer />
      {token && admin ? (
        <>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/addpromo" element={<AddPromo url={url} />} />
              <Route path="/listpromo" element={<ListPromo url={url} />} />
              <Route path="/profile" element={<ProfilePage />} /> 
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login url={url} />} />
          <Route path="/add" element={<Login url={url} />} />
          <Route path="/list" element={<Login url={url} />} />
          <Route path="/orders" element={<Login url={url} />} />
          <Route path="/addpromo" element={<Login url={url} />} />
          <Route path="/listpromo" element={<Login url={url} />} />
          <Route path="/profile" element={<Login url={url} />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
