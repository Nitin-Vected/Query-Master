import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

export const CONNECTION_STRING: string = process.env
  .CONNECTION_STRING as string;
export const PORT: string = process.env.PORT as string;
export const USER_SECRET_KEY: string = process.env.USER_SECRET_KEY as string;
export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY as string;
export const COUNSELLOR_SECRET_KEY: string = process.env
  .COUNSELLOR_SECRET_KEY as string;
export const GOOGLE_DECODE_TOKEN_API: string = process.env
  .GOOGLE_DECODE_TOKEN_API as string;
export const ADMIN_ROLE_ID = "ROLE0001";
export const COUNSELLOR_ROLE_ID = "ROLE0002";
export const STUDENT_ROLE_ID = "ROLE0003";
export const SUPPORT_ADMIN_ROLE_ID = "ROLE0004";
export const STATUS_INTERESTED = "STATUS0001";
export const STATUS_ENROLLED = "STATUS0002";

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  ALREADY_EXIST: 409,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const Messages = {
  ALREADY_EXIST: "Already Exist!",
  AUTHORIZATION_TOKEN_MISSING: "Authorization Token is Missing or Invalid!",
  AUTHENTICATION_SUCCESS: "Authentication Successfull!",
  FETCHED_SUCCESSFULLY: "Fetched Successfully.",
  CREATED_SUCCESSFULLY: "Created SuccessFully.",
  UPDATED_SUCCESSFULLY: "Updated SuccessFully.",
  REGISTERED_SUCCESSFULLY: "Registered SuccessFully.",
  REGISTRATION_FAILED: "Registration Failed!",
  CREATION_FAILED: "Creation Failed!",
  UPDATION_FAILED: "Updation Failed!",
  SOMETHING_WENT_WRONG: "Something Went Wrong!",
  ERROR_OCCURED: "Error Occured in ",
  UNEXPECTED_ERROR: "Unexpected Error Occured!",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or Expired Token!",
  PAYLOAD_MISSING_OR_INVALID: "User Payload is Missing or Invalid!",
  MISSING_OR_INVALID: "is Missing or Invalid!",
  THIS_NOT_FOUND: "Not Found or Inactive!",
  USER_NOT_FOUND: "User Not Found or Inactive!",
  ROLE_NOT_RECOGNIZED: "Role Not Recognized!",
  MISSING_REQUIRED_FIELD: "Missing Required Fields for Creation of"
}

interface UserPayload {
  userId: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
}

export default UserPayload;

export interface CustomRequest extends Request {
  payload?: UserPayload;
}

export const generateUniqueId = async (
  model: any,
  prefix: string
): Promise<string> => {
  try {
    const lastEntry = await model.findOne().sort({ _id: -1 });

    let newUniqueId: string;

    if (lastEntry && lastEntry.id) {
      const lastNumericPart = parseInt(lastEntry.id.replace(prefix, ""), 10);

      const nextId = lastNumericPart + 1;

      newUniqueId = `${prefix}${String(nextId).padStart(4, "0")}`;
    } else {
      newUniqueId = `${prefix}0001`;
    }

    return newUniqueId;
  } catch (error) {
    console.error(`Error generating unique ID for ${prefix}:`, error);
    throw error;
  }
};
