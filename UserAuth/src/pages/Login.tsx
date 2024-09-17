import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Spinner from "../components/Spinner";
import googleIcon from "../assets/google.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false); // Loading state with TypeScript

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (response: any) => {
      setLoading(true); // Set loading to true when API call starts

      try {
        console.log("result.data : ", response);

        if (response.access_token) {
          const loginResult = await axios.post(
            "http://localhost:3001/user/userLogin",
            { tokenResponse: response }
          );

          if (
            loginResult.status === 201 &&
            loginResult.data.userData.role === "Student"
          ) {
            localStorage.setItem("user_email", loginResult.data.userData.email);
            localStorage.setItem("user_name", loginResult.data.userData.name);
            localStorage.setItem("user_token", loginResult.data.token);

            window.dispatchEvent(new Event("storage"));
            navigate("/", {
              state: { userData: loginResult.data.userData },
            });
          } else {
            localStorage.removeItem("user_email");
            localStorage.setItem(
              "admin_email",
              loginResult.data.userData.email
            );
            localStorage.setItem("admin_token", loginResult.data.token);

            window.dispatchEvent(new Event("storage"));
            navigate("/", {
              state: { userData: loginResult.data.userData },
            });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false when API call completes
      }
    },
  });

  return (
    <>
      {loading ? (
        <Spinner /> // Show spinner if loading
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
