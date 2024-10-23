import axios from "axios";
import {
  fetchAllProductsFailure,
  fetchAllProductsStart,
  fetchAllProductsSuccess,
} from "../slices/productSlice"; // Your API constants
import { store } from "../store";
import constants from "../../utility/constants";
export const getAllProducts = async (
  token: string,
  page: number,
  limit: number
) => {
  try {
    store.dispatch(fetchAllProductsStart()); // Dispatch start action to show loader
    const response = await axios.get(
      `${constants.Product_Api}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    store.dispatch(fetchAllProductsSuccess(response.data)); // Dispatch success action
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    store.dispatch(fetchAllProductsFailure(errorMessage)); // Dispatch failure action
    throw error; // Re-throw error if needed for further handling
  }
};
