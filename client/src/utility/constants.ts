export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const API_URL = `${BASE_API_URL}/api`;

// for Support System UI 15/102024
const BaseURL = "https://jsonplaceholder.typicode.com";

const constants = {
  BaseURL: BaseURL,
  USER_API_URL: `${BaseURL}/users/1`,
};

export default constants;
