import axios from "axios";
import constants, { API_URL } from "../../utility/constants";
import { useDispatch } from "react-redux";
import {
  fetchLedaDataFailure,
  fetchLedaDataStart,
  fetchLedaDataSuccess,
} from "../../app/ledaSlice";
import { store } from "../../app/store";

export const loginWithGoogleApi = async (accessToken: string) => {
  return await axios.post(`${API_URL}/login`, {
    tokenResponse: { access_token: accessToken },
  });
};

// export const getApi = async (token: string) => {
//   try {
//     store.dispatch(fetchLedaDataStart()); // Dispatch start action
//     const response = await axios.get(`${constants.Get_All_Leda_Api}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("response", response);
//     store.dispatch(fetchLedaDataSuccess(response.data)); // Dispatch success action
//     return response.data; // Return the data from the response
//   } catch (error) {
//     console.error("Error occurred during API call:", error);
//     store.dispatch(fetchLedaDataFailure(error.message)); // Dispatch failure action
//     throw error; // Re-throw the error for further handling
//   }
// };
export const getApi = async (token: string) => {
  try {
    store.dispatch(fetchLedaDataStart()); // Dispatch start action
    const response = await axios.get(`${constants.Get_All_Leda_Api}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response);
    store.dispatch(fetchLedaDataSuccess(response.data)); // Dispatch success action
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error occurred during API call:", error);

    // Type assertion to handle the error
    const errorMessage =
      (error as Error).message || "An unknown error occurred";

    store.dispatch(fetchLedaDataFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw the error for further handling
  }
};
