import axios from "axios";
import constants, { API_URL } from "../../utility/constants";
import {
  fetchLeadDataFailure,
  fetchLeadDataStart,
  fetchLeadDataSuccess,
} from "../../redux/slices/leadSlice";
import { store } from "../../redux/store";

export const loginWithGoogleApi = async (accessToken: string) => {
  return await axios.post(`${API_URL}/login`, {
    tokenResponse: { access_token: accessToken },
  });
};

export const getAllLeads = async (token: string) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.get(`${constants.Get_All_lead_Api}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response);
    store.dispatch(fetchLeadDataSuccess(response.data)); // Dispatch success action
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchLeadDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};

export const getallCounsellor = async (token: string) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.get(`${constants.GET_All_Counsellor}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("data", response.data);
    store.dispatch(fetchLeadDataSuccess(response.data)); // Dispatch success action
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchLeadDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};
