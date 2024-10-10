import { Response, NextFunction } from "express";
import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import UserPayload, { CustomRequest, Messages, StatusCodes } from "../config";

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
        .json({ message: Messages.AUTHORIZATION_TOKEN_MISSING });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.decode(token) as jwt.JwtPayload;

    if (!payload || !payload.roleId) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token " + Messages.MISSING_OR_INVALID + " or Does not contain a Role" });
    }

    const secretKey = secretKeys[payload.roleName];
    if (!secretKey) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.ROLE_NOT_RECOGNIZED });
    }
    const verifiedPayload = jwt.verify(token, secretKey) as UserPayload;
    request.payload = verifiedPayload;

    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: Messages.INVALID_OR_EXPIRED_TOKEN });
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
        .json({ message: Messages.AUTHORIZATION_TOKEN_MISSING });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.decode(token) as jwt.JwtPayload;
    console.log(payload);

    if (!payload || !payload.roleId) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token " + Messages.MISSING_OR_INVALID + " or Does not contain a Role" });
    }
    const secretKey = secretKeys[payload.roleName];
    if (!secretKey) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.ROLE_NOT_RECOGNIZED });
    }
    const verifiedPayload = jwt.verify(token, secretKey) as UserPayload;
    const user = await userModel.findOne({ email: verifiedPayload.email });

    if (!user) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.USER_NOT_FOUND });
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
      message: Messages.AUTHENTICATION_SUCCESS,
    });
  } catch (err) {
    console.log("Error in authenticationController", err);
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: Messages.INVALID_OR_EXPIRED_TOKEN });
  }
};
