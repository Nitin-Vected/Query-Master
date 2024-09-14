import axios from "axios";
import AppleSignin from "react-apple-signin-auth";
import { useNavigate } from "react-router-dom";
import apple from "../assets/apple.png";
import jscookie from "js-cookie";
import {jwtDecode} from "jwt-decode"; 

function AppleComponent() {
  const navigate = useNavigate();

  const handleAppleResponse = async (response) => {
    const {
      authorization: { id_token },
      user,
    } = response;

    const decoded = jwtDecode(id_token);
    console.log("+++++++>>>", decoded);

    try {
      const loginResult = await axios.post("http://localhost:3001/userLogin", {
        decoded,
        user,
      });
      if (loginResult.status === 200) {
        jscookie.set("user_email", loginResult.data.userData.email, {
          expires: 1,
        });
        navigate("/homepage", {
          state: { userData: loginResult.data.userData },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppleSignin
        authOptions={{
          clientId: "YOUR_APPLE_CLIENT_ID",
          scope: "name email",
          redirectURI: "YOUR_REDIRECT_URI",
          state: "state",
          nonce: "nonce",
          usePopup: true, // or false, depending on your needs
        }}
        onSuccess={handleAppleResponse}
        onError={(error) => console.error("Apple SignIn Error:", error)}
        render={({ onClick }) => (
          <button
            type="button"
            className="btn btn-dark d-flex align-items-center shadow-lg"
            // style={{ border: "thin solid #888", boxShadow: "1px 1px 1px grey" }}
            onClick={onClick}
          >
            <img
              src={apple}
              className="img-fluid"
              alt="Apple Icon"
              style={{ height: "20px", width: "20px" }}
            />
            &nbsp;LogIn With Apple
          </button>
        )}
      />
    </>
  );
}
export default AppleComponent;
