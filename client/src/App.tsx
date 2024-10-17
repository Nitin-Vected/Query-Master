import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import Leads from "./pages/leads";
import Login from "./pages/login";
import Orders from "./pages/orders";
import Students from "./pages/students";
import Transactions from "./pages/transactions";

const App: React.FC = () => {
  return (
    <div className="container">
      {/* <Header /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/students" element={<Students />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
};
