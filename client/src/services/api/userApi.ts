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

export const getAllLeadsUpdate = async (token: string, productId: string) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.put(
      `${constants.Get_All_lead_Api}/${productId}`, // Add productId to the URL
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("ss", response.data);
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
    const response = await axios.get(`${constants.GET_All_Counsellor}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("data", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    throw error; // Re-throw the error for further handling
  }
};

export const getallManageStatusApi = async (token: string) => {
  try {
    const response = await axios.get(`${constants.GET_All_Status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("data", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    throw error; // Re-throw the error for further handling
  }
};
