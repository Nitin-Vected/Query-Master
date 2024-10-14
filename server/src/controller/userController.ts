import { Request, Response } from "express";
import userModel from "../model/userModel";
import {
  CustomRequest,
  generateUniqueId,
  Messages,
  StatusCodes,
  STUDENT_ROLE_ID,
} from "../config";
import mongoose from "mongoose";

export const createUserController = async (
  request: CustomRequest,
  response: Response
): Promise<Response> => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }
    const { email, roleName } = request.payload;
    const { firstName, lastName, leadEmail, contactNumber } = request.body;

    const existingUser = await userModel.findOne({
      $or: [{ email: leadEmail }, { contactNumber }],
    });

    if (existingUser) {
      return response
        .status(StatusCodes.ALREADY_EXIST)
        .json({ error: "User " + Messages.ALREADY_EXIST });
    }

    const userId = await generateUniqueId(userModel, "USER");

    const userData = {
      id: userId,
      firstName,
      lastName,
      email: leadEmail,
      contactNumber,
      roleId: STUDENT_ROLE_ID,
      status: true,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const userResult = await userModel.create(userData);

    if (!userResult) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "User " + Messages.CREATION_FAILED });
    }

    return response
      .status(StatusCodes.CREATED)
      .json({ userId, message: "User " + Messages.CREATED_SUCCESSFULLY });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.UNEXPECTED_ERROR });
  }
};

export const getUserByIdController = async (
  request: Request,
  response: Response
) => {
  const { userId } = request.params;
  try {
    const role = await userModel.findOne({ id: userId })
      .select("-_id id firstName lastName contactNumber email profileImg roleId");
    if (!role) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User " + Messages.THIS_NOT_FOUND });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: role, message: "User " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occured in getUserById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

// For orchestration
export const createUser = async (
  data: any,
  session: mongoose.ClientSession
) => {
  const { firstName, lastName, leadEmail, contactNumber, email, roleName } =
    data;

  const userId = await generateUniqueId(userModel, "USER");

  const userData = {
    id: userId,
    firstName,
    lastName,
    email: leadEmail,
    contactNumber,
    roleId: STUDENT_ROLE_ID,
    status: true,
    createdBy: email,
    updatedBy: email,
    createrRole: roleName,
    updaterRole: roleName,
  };

  const userResult = await userModel.create([userData], { session });
  console.log("user created successfully-------");

  if (!userResult) {
    throw new Error("User " + Messages.CREATION_FAILED);
  }

  return userId;
};

export const viewUserListController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit;

  try {
    const userList = await userModel
      .find()
      .select("-_id id firstName lastName contactNumber email profileImg roleId")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit || 0);

    const totalUsers = await userModel.countDocuments();

    const totalPages = limit ? Math.ceil(totalUsers / limit) : 1;

    if (userList && userList.length > 0) {
      return response.status(StatusCodes.OK).json({
        userList: userList,
        totalPages: totalPages,
        message: "Userdata " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Userdata " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in viewUserListController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};
