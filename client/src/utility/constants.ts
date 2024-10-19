export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const API_URL = `${BASE_API_URL}/api`;

// for Support System UI 15/102024
const BaseURL = API_URL;

const constants = {
  BaseURL: BaseURL,
  Get_All_lead_Api: `${BaseURL}/lead`,
  GET_All_Counsellor: `${BaseURL}/counsellor`,
  GET_All_Status: `${BaseURL}/status`,
  Product_API: `${BaseURL}/product`,
  Channel_API: `${BaseURL}/channel`,

};

export default constants;
