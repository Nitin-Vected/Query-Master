import { Response } from "express";
import userModel from "../model/userModel";
import { CustomRequest, Messages, StatusCodes } from "../config";

export const viewProfileController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    let userId = request.payload?.userId;
    if (!userId) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }
    const result = await userModel.findOne({ id: userId });
    if (!result) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Account " + Messages.THIS_NOT_FOUND });
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
        message: "Userdata " + Messages.FETCHED_SUCCESSFULLY
      });
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const UpdateProfileController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { email, roleName } = request.payload || {};
    if (!email || !roleName) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }
    const { userId } = request.params;
    const user = await userModel.findOne({ id: userId });
    if (!user) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: Messages.USER_NOT_FOUND });
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

    return response.status(StatusCodes.OK).json({
      message: "Profile " + Messages.UPDATED_SUCCESSFULLY,
      updatedUser,
    });
  } catch (error) {
    console.error("Error in UpdateProfile:", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};
