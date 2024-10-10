import { Response } from "express";
import userModel from "../model/userModel";
import {
  CustomRequest,
  generateUniqueId,
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
        .json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    const { firstName, lastName, leadEmail, contactNumber } = request.body;

    const existingUser = await userModel.findOne({
      $or: [{ email: leadEmail }, { contactNumber }],
    });

    if (existingUser) {
      return response
        .status(StatusCodes.ALREADY_EXIST)
        .json({ error: "User already exists." });
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
        .json({ error: "User creation failed." });
    }

    return response
      .status(StatusCodes.CREATED)
      .json({ userId, message: "User created successfully." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An unexpected error occurred." });
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
    throw new Error("User creation failed.");
  }

  return userId;
};
