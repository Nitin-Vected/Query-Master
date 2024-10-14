import jwt from "jsonwebtoken";
import {
  ADMIN_SECRET_KEY,
  COUNSELLOR_SECRET_KEY,
  USER_SECRET_KEY,
} from "../config";

interface Payload {
  name: string;
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
  googleToken: string;
}

const getSecretKey = (roleName: string): string | undefined => {

  switch (roleName) {
    case "Admin":
      return ADMIN_SECRET_KEY;
    case "Counsellor":
      return COUNSELLOR_SECRET_KEY;
    case "User":
      return USER_SECRET_KEY;
    default:
      return undefined;
  }
};

export const tokenGenerator = (data: Payload) => {
  const { roleName } = data;

  const secretKey = getSecretKey(roleName);

  if (!secretKey) {
    throw new Error(`Secret key for role ${roleName} not found`);
  }

  const token = jwt.sign(data, secretKey, { expiresIn: "1d" });

  console.log("Generated Token ==> ", token);
  return token;
};

export const tokenVerifier = (token: any, secretKey: string) => {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error: any) {
    console.log("Token verification failed:", error.message);
    return error;
  }
};
