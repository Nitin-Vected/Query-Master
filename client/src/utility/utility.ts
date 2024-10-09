// src/api.ts
import axios from "axios";
import { API_URL } from "./constants";

export const loginWithGoogle = async (accessToken: string) => {
  return await axios.post(`${API_URL}/login`, {
    tokenResponse: { access_token: accessToken },
  });
};
