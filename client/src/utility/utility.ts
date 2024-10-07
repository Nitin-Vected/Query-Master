// src/api.ts
import axios from "axios";
import { USER_API_URL } from "./constants";

export const loginWithGoogle = async (accessToken: string) => {
  return await axios.post(`${USER_API_URL}/userLogin`, {
    tokenResponse: { access_token: accessToken },
  });
};
