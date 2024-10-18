import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import theme from "./theme/theme";
import "./App.css";
import HeaderView from "./template/header-view";
import Home from "./pages/home";
import Leads from "./pages/leads";
import Orders from "./pages/orders";
import Students from "./pages/students";
import Transactions from "./pages/transactions";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import { store } from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <HeaderView />
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
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
