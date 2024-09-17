import React, { useEffect, useState } from "react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

// Define the structure of the user object
interface User {
  email: string;
  token: string;
}

function Header(): JSX.Element {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null); // User is either an object or null

  useEffect(() => {
    loadUserFromStorage();

    window.addEventListener("storage", loadUserFromStorage);

    return () => {
      window.removeEventListener("storage", loadUserFromStorage);
    };
  }, []);

  const loadUserFromStorage = () => {
    const storedUserEmail = localStorage.getItem("user_email");
    const storedUserToken = localStorage.getItem("user_token");

    if (storedUserEmail && storedUserToken) {
      setUser({
        email: storedUserEmail,
        token: storedUserToken,
      });
    } else {
      setUser(null);
    }
  };

  const onLogOut = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_token");

    setUser(null);

    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Support Desk</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <button className="btn" onClick={onLogOut}>
              <FaSignOutAlt /> Log Out
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
