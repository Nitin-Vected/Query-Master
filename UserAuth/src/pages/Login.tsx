import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Spinner from "../components/Spinner";
import googleIcon from "../assets/google.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { setUserData, setLoading } from "../app/authSlice";
import { loginWithGoogle as loginWithGoogleApi } from "../utility/utility"; // Import the API utility function

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const [error, setError] = useState<string | null>(null); // State for managing error

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async ({ access_token }: { access_token: string }) => {
      dispatch(setLoading(true));
      setError(null); // Clear any previous error

      try {
        if (access_token) {
          const { data } = await loginWithGoogleApi(access_token);

          const { userData, token } = data;

          const userDataObj = {
            email: userData.email,
            name: userData.name,
            token,
            role: userData.role,
          };

          dispatch(setUserData(userDataObj));
          navigate("/");
        }
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        dispatch(setLoading(false));
      }
    },
    onError: (err) => {
      console.error("Google OAuth error:", err);
      setError("Google authentication failed. Please try again.");
    },
  });

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="heading">
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
            onClick={() => loginWithGoogle()}
          >
            <img
              src={googleIcon}
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
      )}
    </>
  );
};

export default Login;
