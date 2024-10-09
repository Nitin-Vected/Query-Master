import { Response, NextFunction } from "express";
import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import UserPayload, { CustomRequest, StatusCodes } from "../config";

const secretKeys: { [key: string]: string } = {
  Admin: process.env.ADMIN_SECRET_KEY as string,
  Counsellor: process.env.COUNSELLOR_SECRET_KEY as string,
  User: process.env.USER_SECRET_KEY as string,
};

export const authenticateJWT = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.decode(token) as jwt.JwtPayload;

    if (!payload || !payload.role) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token is invalid or does not contain a role" });
    }

    const secretKey = secretKeys[payload.role];
    if (!secretKey) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Role not recognized" });
    }
    const verifiedPayload = jwt.verify(token, secretKey) as UserPayload;
    request.payload = verifiedPayload;

    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};

export const authenticationController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.decode(token) as jwt.JwtPayload;
    console.log(payload);

    if (!payload || !payload.roleId) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token is invalid or does not contain a role" });
    }
    const secretKey = secretKeys[payload.roleName];
    if (!secretKey) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Role not recognized" });
    }
    const verifiedPayload = jwt.verify(token, secretKey) as UserPayload;
    const user = await userModel.findOne({ email: verifiedPayload.email });

    if (!user) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not found or inactive" });
    }
    const userData = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contactNumber: user.contactNumber,
      role: user.roleId,
      profileImg: user.profileImg,
    };
    return response.status(StatusCodes.OK).json({
      userData: userData,
      token: token,
      message: "Authentication successful!",
    });
  } catch (err) {
    console.log("Error in authenticationController", err);
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};

export const viewProfileController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    let userId = request.payload?.userId;
    if (!userId) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token not found" });
    }
    const result = await userModel.findOne({ id: userId });
    if (!result) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "The Account You are Trying to Access not find..!" });
    } else if (result?.status) {
      const userData = {
        name: result?.firstName + " " + result?.lastName,
        email: result?.email,
        contactNumber: result?.contactNumber,
        profileImg: result?.profileImg,
        role: request.payload?.roleName,
      };
      response.status(StatusCodes.OK).json({
        userData: userData,
        message: "UserData fetched successfully ..!",
      });
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};
