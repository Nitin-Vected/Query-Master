// import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from '@react-oauth/google';
import apple from '../assets/apple.png';
import googleIcon from '../assets/google.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jscookie from 'js-cookie';
import AppleComponent from './AppleLogin';
import { jwtDecode } from "jwt-decode";


function GoogleLogin() {
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    // onSuccess: tokenResponse => console.log(tokenResponse.access_token),
    onSuccess: async (response) => {
      try {
        console.log("result.data : ", response);

        if (response.access_token) {
          const loginResult = await axios.post(
            "http://localhost:3001/user/userLogin",
            // "http://localhost:3001/admin/adminLogin",
            { tokenResponse: response }
          );
          if (loginResult.status === 201 && loginResult.data.userData.role === 'Student') {
            console.log('Hello from user block ..!');
            jscookie.set("user_email", loginResult.data.userData.email, {
              expires: 1,
            });
            jscookie.set("user_token",loginResult.data.token,{expires: 1,});
            navigate("/homepage", {
              state: { userData: loginResult.data.userData },
            });
          } else {
            console.log('Hello from admin block ..!');
            jscookie.remove('user_email');
            jscookie.set("admin_email", loginResult.data.userData.email, {
              expires: 1,
            });
            jscookie.set("admin_token",loginResult.data.token,{expires: 1,});
            navigate("/homepage", {
              state: { userData: loginResult.data.userData },
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-flex align-items-center shadow-lg"
        // style={{ border: "thin solid #888", boxShadow: "1px 1px 1px grey" }}
        onClick={loginWithGoogle}
      >
        <img
          src={googleIcon}
          className="img-fluid"
          alt="Google Icon"
          style={{ height: "20px", width: "20px" }}
        />
        &nbsp;Login With Google
      </button>
    </>
  );
}

export default GoogleLogin;
