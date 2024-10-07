import React from "react";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store"; // Import the RootState type

interface UserData {
  userName: string | null;
  role: string;
}

const Home: React.FC = () => {
  const location = useLocation();

  const userData = useSelector((state: RootState) => state.auth.userData);

  const displayUserData: UserData = {
    userName: userData?.name || location.state?.userData?.name || null,
    role: userData?.role || location.state?.userData?.role || "Student",
  };

  return (
    <>
      <section className="heading">
        {displayUserData.userName ? (
          <>
            <h1>Welcome back, {displayUserData.userName}!</h1>
            <p>Welcome! How can we assist you today?</p>
          </>
        ) : (
          <>
            <h1>Welcome to the Support Desk</h1>
            <p>Please log in to get started.</p>
          </>
        )}
      </section>
    </>
  );
};

export default Home;
