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

export const adminGetStudentsList = async (token: string) => {
  return axios.get(`${ADMIN_API_URL}/adminGetStudentsList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminUpdateStudentStatus = async (
  studentId: string,
  status: "active" | "inactive",
  token: string
) => {
  return axios.patch(
    `${ADMIN_API_URL}/student/${studentId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
