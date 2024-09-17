import React from "react";
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async ({ access_token }: { access_token: string }) => {
      dispatch(setLoading(true));

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
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
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
        </section>
      )}
    </>
  );
};

export default Login;
