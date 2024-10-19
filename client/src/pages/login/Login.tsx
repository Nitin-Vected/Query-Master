import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import image from "../../assets/image";
import { loginWithGoogle } from "../../redux/slices/authSlice"; // Import login action
import { AppDispatch, RootState } from "../../redux/store";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogleHandler = useGoogleLogin({
    onSuccess: ({ access_token }: { access_token: string }) => {
      dispatch(loginWithGoogle({ access_token })); // This should work now
      navigate("/"); // Navigate on success
    },
    onError: (err) => {
      setError("Google authentication failed. Please try again.");
    },
  });

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="container">
          <section className="heading" style={{ marginTop: "100px" }}>
            <h1>
              <FaSignInAlt /> Login
            </h1>
            <p>Please login to get support</p>

            <button
              style={{
                marginTop: "20px",
                padding: "15px 20px",
                marginInline: "auto",
              }}
              type="button"
              className="btn"
              onClick={() => loginWithGoogleHandler()} // Trigger Google login
            >
              <img
                src={image.google}
                className="img-fluid"
                alt="Google Icon"
                style={{ height: "20px", width: "20px" }}
              />
              &nbsp;Login With Google
            </button>

            {error && (
              <p style={{ color: "red", marginTop: "10px", fontSize: "1rem" }}>
                {error}
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default Login;
