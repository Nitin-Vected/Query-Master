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
import {
  fetchStudentDataFailure,
  fetchStudentDataStart,
  fetchStudentDataSuccess,
} from "../../redux/slices/studentSlice";
import {
  fetchTransactionDataFailure,
  fetchTransactionDataStart,
  fetchTransactionDataSuccess,
} from "../../redux/slices/transactionSlice";
import {
  fetchOrderDataFailure,
  fetchOrderDataStart,
  fetchOrderDataSuccess,
} from "../../redux/slices/orderSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast
export const loginWithGoogleApi = async (accessToken: string) => {
  return await axios.post(`${API_URL}/login`, {
    tokenResponse: { access_token: accessToken },
  });
};

export const createLead = async (token: string, data: object) => {
  try {
    const response = await axios.post(`${constants.Lead_Api}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success(response.data.message); // Show success toast
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("An unknown error occurred");
    }
    throw error;
  }
};

export const getAllLeads = async (
  token: string,
  page: number,
  limit: number
) => {
  try {
    store.dispatch(fetchLeadDataStart()); // Dispatch start action
    const response = await axios.get(
      `${constants.Lead_Api}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    store.dispatch(fetchLeadDataSuccess(response.data)); // Dispatch success action
    return response.data; // Return the data from the response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from the server");
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("An unknown error occurred");
    }
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
    toast.success(response.data.message); // Show success toast
    return response.data; // Return the data from the response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("An unknown error occurred");
    }
  }
};

export const enrollLead = async (token: string, data: object) => {
  try {
    const response = await axios.post(
      `${constants.EnrollLead_Api}`, // Update URL if necessary
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(response.data.message); // Show success toast

    return response.data; // Return the data from the response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("An unknown error occurred");
    }
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
    toast.success(response.data.message); // Show success toast
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
    // getAllLeads(token);
    toast.success(response.data.message); // Show success toast

    return response.data; // Return the data from the response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from the server");
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } else {
      console.error("An unknown error occurred:", error);
      toast.error("An unknown error occurred");
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from the server");
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } else {
      console.error("An unknown error occurred:", error);
      toast.error("An unknown error occurred");
    }
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
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchAllStatusFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};
export const getAllProducts = async (
  token: string,
  page: number,
  limit: number
) => {
  try {
    store.dispatch(fetchAllProductsStart()); // Dispatch start action
    const response = await axios.get(
      `${constants.Product_Api}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
export const getAllOrders = async (
  token: string,
  page: number,
  limit: number
) => {
  try {
    store.dispatch(fetchOrderDataStart()); // Dispatch start action
    const response = await axios.get(
      `${constants.Order_Api}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    store.dispatch(fetchOrderDataSuccess(response.data)); // Dispatch success action
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
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchOrderDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};

export const getAllStudents = async (
  token: string,
  page: number,
  limit: number
) => {
  try {
    store.dispatch(fetchStudentDataStart()); // Dispatch start action
    const response = await axios.get(
      `${constants.Student_Api}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    store.dispatch(fetchStudentDataSuccess(response.data)); // Dispatch success action
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
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchStudentDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};
export const getAllTransactions = async (
  token: string,
  page: number,
  limit: number
) => {
  try {
    store.dispatch(fetchTransactionDataStart()); // Dispatch start action
    const response = await axios.get(
      `${constants.Transaction_Api}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    store.dispatch(fetchTransactionDataSuccess(response.data)); // Dispatch success action
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
    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchTransactionDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};

export const addTransaction = async (token: string, data: object) => {
  try {
    const response = await axios.post(
      `${constants.Transaction_Api}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(response.data.message);
    // console.log(response)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from the server");
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("An unknown error occurred");
    }
  }
};