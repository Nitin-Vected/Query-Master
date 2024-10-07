import express, { Request, Response, NextFunction } from "express";
import userModel from "../model/userModel";
import { tokenVerifier } from "../utilities/jwt";
import { CustomRequest, StatusCodes, USER_SECRET_KEY } from "../config";

export const userViewProfileController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    console.log("result", request.payload);
    let userId = request.payload?.userId;
    if (!userId) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token not found" });
    }
    const result = await userModel.findOne({ userId });
    if (!result) {
      return response.status(StatusCodes.NOT_FOUND).json({ message: "The Account You are Trying to Access not find..!" });
    } else if (result?.statusId) {
      console.log("result", result?.roleId);
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

export const userAddContactNumberController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const userEmail = request.payload?.email;
    const { contactNumber } = request.body;
    if (!userEmail) {
      response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token not found" });
    } else {
      const result = await userModel.updateOne(
        { email: userEmail },
        { $set: { contactNumber: contactNumber } }
      );
      console.log("ContactNumber updated ", result);

      if (result?.acknowledged) {
        response
          .status(StatusCodes.OK)
          .json({ message: "Contact number updated successfully ..!" });
      } else {
        response.status(StatusCodes.UNAUTHORIZED).json({
          message: "The account you are trying to access has been deactivated!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const userAuthenticationController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    console.log("Inside userAuthenticationController");
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    console.log("token inside userAuthenticationController -> ", token);
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
      message: "Authenntication Successfull ..!",
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
    console.log("request.headers", request.headers);
    console.log("authHeader", authHeader);

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
