import { Response } from "express";
import userModel from "../model/userModel";
import { tokenVerifier } from "../utilities/jwt";
import { CustomRequest, StatusCodes, USER_SECRET_KEY } from "../config";

export const UpdateProfile = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { email, roleName } = request.payload || {};
    if (!email || !roleName) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { userId } = request.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const { firstName, lastName, userEmail, contactNumber, roleId, isActive } =
      request.body;
    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
    }
    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
    }
    if (userEmail && userEmail !== user.email) {
      user.email = userEmail;
    }
    if (contactNumber && contactNumber !== user.contactNumber) {
      user.contactNumber = contactNumber;
    }
    if (roleId && roleId !== user.roleId) {
      user.roleId = roleId;
    }
    if (typeof isActive !== "undefined" && isActive !== user.isActive) {
      user.isActive = isActive;
    }
    user.updatedBy = email!;
    user.updaterRole = roleName!;
    const updatedUser = await user.save();

    response.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error in UpdateProfile:", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong while updating profile" });
  }
};

export const userAuthenticationController = async (
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
    const payload = await tokenVerifier(token, USER_SECRET_KEY);
    const result = await userModel.findOne({ email: payload.email });
    const userData = {
      name: result?.firstName + " " + result?.lastName,
      email: result?.email,
      contactNumber: result?.contactNumber,
      role: result?.roleId,
      profileImg: result?.profileImg,
    };
    response.status(StatusCodes.OK).json({
      userData: userData,
      token: token,
      message: "Authentication Successfull ..!",
    });
  } catch (err) {
    console.log("Error while user authentication Controller", err);
    response.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token Not verify please login then try to access ..!",
    });
  }
};

export const userAuthenticateJWT = async (
  request: CustomRequest,
  response: Response,
  next: Function
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader?.split(" ")[1];
    const payload = await tokenVerifier(token, USER_SECRET_KEY);
    request.payload = payload;
    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired User token" });
  }
};
