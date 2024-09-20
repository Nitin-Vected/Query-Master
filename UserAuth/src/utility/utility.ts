// src/api.ts
import axios from "axios";
import { USER_API_URL, ADMIN_API_URL } from "./constants";

export const loginWithGoogle = async (accessToken: string) => {
  return await axios.post(`${USER_API_URL}/userLogin`, {
    tokenResponse: { access_token: accessToken },
  });
};

export const createQuery = async (
  subject: string,
  message: string,
  token: string
) => {
  return await axios.post(
    `${USER_API_URL}/userRaiseQuery`,
    {
      subject,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    }
  );
};

export const fetchQueries = async (token: string) => {
  return await axios.get(`${USER_API_URL}/userViewMyQueries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminfetchQueries = async (token: string) => {
  return await axios.get(`${ADMIN_API_URL}/adminViewRaisedQueries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendMessageApi = async (
  queryId: string,
  message: string,
  token: string,
  role: string
) => {
  let URL = `${ADMIN_API_URL}/adminAddResponseToQuery`;
  if (role !== "SupportAdmin") {
    URL = `${USER_API_URL}/userAddCommentToQuery`;
  }
  try {
    const response = await axios.post(
      `${URL}/${queryId}`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

export const adminGetStudentsList = async (token: string) => {
  return axios.get(`${ADMIN_API_URL}/adminViewStudentList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminUpdateStudentStatus = async (
  email: string,
  newStatus: "true" | "false",
  token: string
) => {
  return axios.get(
    `${ADMIN_API_URL}/adminManageStudentStatus/${email}/${newStatus}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// http://localhost:3001/user/userManageQueryStatus/66e9850497c08c0da0327a64/Open

export const manageQueryStatus = async (
  queryId: string,
  userEmail: string,
  token: string,
  role: string,
  selectedStatus: string
) => {
  let URL = `${ADMIN_API_URL}/adminManageQueryStatus`;
  if (role !== "SupportAdmin") {
    URL = `${USER_API_URL}/userManageQueryStatus`;
  }
  try {
    const response = await axios.post(
      `${URL}/${queryId}/${selectedStatus}`,
      { userEmail },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

export const fetchQueryById = async (
  queryId: string,
  token: string,
  role: string
) => {
  let URL = `${ADMIN_API_URL}/adminGetQueryData`;
  if (role !== "SupportAdmin") {
    URL = `${USER_API_URL}/userGetQueryData`;
  }
  try {
    const response = await axios.get(`${URL}/${queryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
