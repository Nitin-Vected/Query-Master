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
    const { firstName, lastName, userEmail, contactNumber } = request.body;

    const existingUser = await userModel.findOne({ email: userEmail });

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
      email: userEmail,
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
    const user = await userModel.aggregate([
      {
        $match: { id: userId } // Match the user by ID
      },
      {
        $lookup: {
          from: "roleMaster", // Assuming you have a roles collection
          localField: "roleId", // Field in userModel that holds role IDs
          foreignField: "id", // Field in the roles collection to match with role IDs
          as: "roleDetails", // Name for the resulting role details array
        },
      },
      {
        $unwind: {
          path: "$roleDetails",
          preserveNullAndEmptyArrays: true, // Keep users without a role
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          firstName: 1,
          lastName: 1,
          contactNumber: 1,
          email: 1,
          profileImg: 1,
          isActive: 1,
          role: "$roleDetails.name", // Include role name from roleDetails
        },
      },
    ]);

    if (!user || user.length === 0) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User " + Messages.THIS_NOT_FOUND });
    }

    response
      .status(StatusCodes.OK)
      .json({ data: user[0], message: "User " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occurred in getUserById : ", error);
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
    const userList = await userModel.aggregate([
      {
        $lookup: {
          from: "roleMaster", 
          localField: "roleId",
          foreignField: "id",
          as: "roleDetails",
        },
      },
      {
        $unwind: {
          path: "$roleDetails",
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          firstName: 1,
          lastName: 1,
          contactNumber: 1,
          email: 1,
          profileImg: 1,
          isActive: 1,
          role: "$roleDetails.name", 
        },
      },
      { $sort: { updatedAt: -1, createdAt: -1 } },
      { $skip: skip },
    ]);
    if (limit > 0) {
      userList.push({ $limit: limit });
  }
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
