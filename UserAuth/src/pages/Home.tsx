import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

interface UserData {
  userName: string | null;
  role: string;
}

const Home: React.FC = () => {
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if userData is available in location.state or localStorage
    const storedUserData = location.state?.userData || {
      userName: localStorage.getItem("user_name"),
      role: "Student", // or "Admin" based on your app logic
    };

    setUserData(storedUserData);
  }, [location.state]);

  return (
    <>
      <section className="heading">
        {userData && userData.userName ? (
          <>
            <h1>Welcome back, {userData.userName}!</h1>
            <p>What do you need help with today?</p>
          </>
        ) : (
          <>
            <h1>Welcome to the Support Desk</h1>
            <p>Please log in to get started.</p>
          </>
        )}
      </section>

      <Link to="/new-ticket" className="btn btn-reverse btn-block">
        <FaQuestionCircle /> Create New Ticket
      </Link>

      <Link to="/tickets" className="btn btn-block">
        <FaTicketAlt /> View Your Tickets
      </Link>
    </>
  );
};

export default Home;
