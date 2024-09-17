import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewTicket from "./pages/NewTicket";
import PrivateRoute from "./components/PrivateRoute";
import Tickets from "./pages/Tickets";
import ManageTickets from "./pages/ManageTickets";
import Ticket from "./pages/Ticket";
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
          <Route path="/new-ticket" element={<NewTicket />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/ticket/:ticketId" element={<Ticket />} />
          <Route path="/manage-tickets" element={<ManageTickets />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
