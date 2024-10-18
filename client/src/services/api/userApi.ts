// src/api/userApi.ts
import axios from "axios";
import { User } from "./userTypes";
import constants from "../../utility/constants";

// Fetch user data from USER_API_URL
export const fetchUserApi = async (): Promise<User> => {
  const response = await axios.get(constants.USER_API_URL);
  return response.data;
};

export const createUserApi = async (userData: User): Promise<User> => {
  const response = await axios.post(constants.USER_API_URL, userData);
  return response.data;
};
