import axios from "axios";
import constants from "../utility/constants";

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
