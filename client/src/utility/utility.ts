import axios from "axios";
import { API_URL } from "./constants";

// Function to login with Google
export const loginWithGoogleApi = async (accessToken: string) => {
  console.log("Sending Access Token:", accessToken);
  return await axios.post(`${API_URL}/login`, {
    tokenResponse: { access_token: accessToken },
  });
};
