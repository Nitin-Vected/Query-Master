import axios from "axios";
import constants, { API_URL } from "../../utility/constants";
import {
  fetchLeadDataFailure,
  fetchLeadDataStart,
  fetchLeadDataSuccess,
} from "../../redux/slices/leadSlice";
import { store } from "../../redux/store";
import {
  fetchAllProductsFailure,
  fetchAllProductsStart,
  fetchAllProductsSuccess,
} from "../../redux/slices/productSlice";
import {
  fetchAllStatusFailure,
  fetchAllStatusStart,
  fetchAllStatusSuccess,
} from "../../redux/slices/statusSlice";

export const loginWithGoogleApi = async (accessToken: string) => {
  return await axios.post(`${API_URL}/login`, {
    tokenResponse: { access_token: accessToken },
  });
};

export const getAllLeads = async (token: string) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.get(`${constants.Lead_Api}`, {
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

export const getAllLeadsUpdate = async (
  token: string,
  leadId: string,
  data: object
) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.put(
      `${constants.Lead_Api}/${leadId}`, // Update URL if necessary
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the data from the response
  } catch (error) {
    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    store.dispatch(fetchLeadDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};

export const getCounsellorListLeadsUpdate = async (
  token: string,
  leadId: string,
  data: object
) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.put(
      `${constants.Lead_Api}/${leadId}`, // Update URL if necessary
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
     return response.data; // Return the data from the response
  } catch (error) {
    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    store.dispatch(fetchLeadDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};

export const updateLead = async (
  token: string,
  data: object,
  leadId: string
) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.put(
      `${constants.Lead_Api}/${leadId}`, // Update URL if necessary
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getAllLeads(token);
    return response.data; // Return the data from the response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    store.dispatch(fetchLeadDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};

export const getLeadById = async (token: string, leadId: string) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.get(
      `${constants.Lead_Api}/${leadId}`, // Update URL if necessary
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the data from the response
  } catch (error) {
    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    store.dispatch(fetchLeadDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};

export const getallLeadEdit = async (token: string, leadId: string) => {
  try {
    const response = await axios.get(`${constants.Lead_Api}/${leadId}`, {
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

export const getallCounsellor = async (token: string) => {
  try {
    const response = await axios.get(`${constants.Counsellor_Api}`, {
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
    const response = await axios.get(`${constants.Status_Api}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("@TEST data", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    throw error; // Re-throw the error for further handling
  }
};

export const getAllChannels = async (token: string) => {
  try {
    const response = await axios.get(`${constants.Channel_Api}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occurred during API call:", error);
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    throw error;
  }
};

export const getAllStatus = async (token: string) => {
  try {
    store.dispatch(fetchAllStatusStart()); // Dispatch start action
    const response = await axios.get(`${constants.Status_Api}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    store.dispatch(fetchAllStatusSuccess(response.data)); // Dispatch success action
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchAllStatusFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};
export const getAllProducts = async (token: string) => {
  try {
    store.dispatch(fetchAllProductsStart()); // Dispatch start action
    const response = await axios.get(`${constants.Product_Api}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    store.dispatch(fetchAllProductsSuccess(response.data)); // Dispatch success action
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchAllProductsFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};
