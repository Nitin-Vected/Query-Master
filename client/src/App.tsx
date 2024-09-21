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
import StudentManagement from "./pages/StudentManagement";

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
          <Route path="/queries" element={<Queries />} />
          <Route path="/query/:queryId" element={<Query />} />
          <Route path="/manage-queries" element={<ManageQueries />} />
          <Route path="/student-management" element={<StudentManagement />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
