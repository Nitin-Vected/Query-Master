import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import Leads from "./pages/leads";

const App: React.FC = () => {
  return (
    <div className="container">
      {/* <Header /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/leads" element={<Leads />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
