import { Request, Response } from "express";
import { StatusCodes, COUNSELLOR_ROLE_ID } from "../config";
import userModel from "../model/userModel";
import studentModel from "../model/studentModel";

export const viewStudentListController = async (
  request: Request,
  response: Response
) => {
  try {
    const studentList = await studentModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id",
          as: "profileDetails",
        },
      },
      { $unwind: "$profileDetails" },
      {
        $project: {
          _id: 0,
          "profileDetails._id": 0,
          "profileDetails.userId": 0,
          "profileDetails.createdAt": 0,
          "profileDetails.updatedAt": 0,
        },
      },
    ]);
    if (studentList && studentList.length > 0) {
      return response.status(StatusCodes.OK).json({
        studentList,
        message: "These are the registered students!",
      });
    }
    return response.status(StatusCodes.OK).json({
      studentList,
      message: "There are no registered students!",
    });
  } catch (error) {
    console.log("Error occurred in viewStudentListController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const viewConsellorListController = async (
  request: Request,
  response: Response
) => {
  try {
    const consellorList = await userModel
      .find({ roleId: COUNSELLOR_ROLE_ID }, { _id: 0 })
      .select("name email contactNumber role profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (consellorList && consellorList.length > 0) {
      response.status(StatusCodes.OK).json({
        consellorList: consellorList,
        message: "These are the registered consellors..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "consellor list not found!" });
    }
  } catch (error) {
    console.log("Error occure in viewConsellorListController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const viewUserListController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const userList = await userModel
      .find({}, { _id: 0 })
      .select("name email contactNumber role profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (userList && userList.length > 0) {
      return response.status(StatusCodes.OK).json({
        userList: userList,
        message: "Registered user fetched successfully  ..!",
      });
    } else {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in viewUserListController : ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};
