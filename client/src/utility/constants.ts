export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const API_URL = `${BASE_API_URL}/api`;

// for Support System UI 15/102024
const BaseURL = API_URL;

const constants = {
  BaseURL: BaseURL,
  Get_All_lead_Api: `${BaseURL}/lead`,
  GET_All_Counsellor: `${BaseURL}/counsellor`,
  GET_All_Status: `${BaseURL}/status`,
  Status_Api: `${BaseURL}/status`,
  Product_Api: `${BaseURL}/product`,
  Channel_Api: `${BaseURL}/channel`,
  Order_Api: `${BaseURL}/order`,
  Student_Api: `${BaseURL}/student`,
  Transaction_Api: `${BaseURL}/transaction`,
};

export default constants;
