import { Request, Response } from "express";
import userModel from "../model/userModel";
import { generateUniqueId, StatusCodes, STUDENT_ROLE_ID } from "../config";
import mongoose from "mongoose";

export const createUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { firstName, lastName, leadEmail, contactNumber, email, roleName } =
      req.body;

    if (!firstName || !lastName || !leadEmail || !contactNumber) {
      return res
        .status(400)
        .json({ error: "Missing required fields for user creation." });
    }

    const userId = await generateUniqueId(userModel, "USER");

    const userData = {
      id: userId,
      firstName,
      lastName,
      email: leadEmail,
      contactNumber,
      roleId: STUDENT_ROLE_ID || "",
      status: true,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const userResult = await userModel.create(userData);

    if (!userResult) {
      return res.status(500).json({ error: "User creation failed." });
    }

    return res
      .status(201)
      .json({ userId, message: "User created successfully." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// For orchestration
export const createUser = async (
  data: any,
  session: mongoose.ClientSession
) => {
  const { firstName, lastName, leadEmail, contactNumber, email, roleName } =
    data;

  if (!firstName || !lastName || !leadEmail || !contactNumber) {
    throw new Error("Missing required fields for user creation.");
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

  const userResult = await userModel.create([userData], { session });
  console.log("user created successfully-------");

  if (!userResult) {
    throw new Error("User creation failed.");
  }

  return userId;
};

export const viewUserListController = async (
  request: Request,
  response: Response
) => {
  try {
    const userList = await userModel
      .find({}, { _id: 0 })
      .select("name email contactNumber role profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (userList && userList.length > 0) {
      response.status(StatusCodes.OK).json({
        userList: userList,
        message: "Registered user fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in viewUserListController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};