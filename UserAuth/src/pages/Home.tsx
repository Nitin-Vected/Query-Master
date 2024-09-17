import React from "react";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../app/store'; // Import the RootState type

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
            {displayUserData.role === "Student" ? (
              <p>What do you need help with today?</p>
            ) : displayUserData.role === "SupportAdmin" ? (
              <p>
                As a Support Admin, you can manage queries and assist users.
              </p>
            ) : (
              <p>Welcome! How can we assist you today?</p>
            )}
          </>
        ) : (
          <>
            <h1>Welcome to the Support Desk</h1>
            <p>Please log in to get started.</p>
          </>
        )}
      </section>

      {displayUserData.role === "Student" && (
        <>
          <Link to="/new-ticket" className="btn btn-reverse btn-block">
            <FaQuestionCircle /> Create New Ticket
          </Link>

          <Link to="/tickets" className="btn btn-block">
            <FaTicketAlt /> View Your Tickets
          </Link>
        </>
      )}

      {displayUserData.role === "SupportAdmin" && (
        <>
          <Link to="/manage-tickets" className="btn btn-reverse btn-block">
            <FaTicketAlt /> Manage Queries
          </Link>

          <Link to="/user-management" className="btn btn-block">
            <FaQuestionCircle /> User Management
          </Link>
        </>
      )}
    </>
  );
};

export default Home;
