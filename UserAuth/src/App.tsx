import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewQuery from "./pages/NewQuery";
import PrivateRoute from "./components/PrivateRoute";
import Queries from "./pages/Queries";
import ManageQueries from "./pages/ManageQueries";
import Query from "./pages/Query";
import "./App.css";
import UserManagement from "./pages/UserManagement";

const App: React.FC = () => {
  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/new-query" element={<NewQuery />} />
          <Route path="/Queries" element={<Queries />} />
          <Route path="/query/:queryId" element={<Query />} />
          <Route path="/manage-Queries" element={<ManageQueries />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
