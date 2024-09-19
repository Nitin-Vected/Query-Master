import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store"; // Import the necessary types
import { clearUserData } from "../app/authSlice"; // Import the action creator

function Header(): JSX.Element {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch(); // Use Redux dispatch
  const userData = useSelector((state: RootState) => state.auth.userData); // Get user data from Redux store

  const onLogOut = () => {
    dispatch(clearUserData());
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Support Desk</Link>
      </div>
      <ul>
        {userData ? (
          <>
            <li>
              <span>Role: {userData.role}</span> {/* Display user role */}
            </li>
            <li>
              <button className="btn" onClick={onLogOut}>
                <FaSignOutAlt /> Log Out
              </button>
            </li>
          </>
        ) : (
          ""
        )}
      </ul>
    </header>
  );
}

export default Header;
