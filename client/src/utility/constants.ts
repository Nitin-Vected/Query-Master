export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const API_URL = `${BASE_API_URL}/api`;

// for Support System UI 15/102024
const BaseURL = API_URL;

const constants = {
  BaseURL: BaseURL,
  Lead_Api: `${BaseURL}/lead`,
  Counsellor_Api: `${BaseURL}/counsellor`,
  Status_Api: `${BaseURL}/status`,
  Product_Api: `${BaseURL}/product`,
  Channel_Api: `${BaseURL}/channel`,
};

export default constants;
