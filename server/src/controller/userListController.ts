import { Request, Response } from "express";
import { StatusCodes, COUNSELLOR_ROLE_ID, Messages } from "../config";
import userModel from "../model/userModel";
import studentModel from "../model/studentModel";

export const viewStudentListController = async (
  request: Request,
  response: Response
) => {
  const page = request.query.page ? parseInt(request.query.page as string) : 1;
  const limit = request.query.limit ? parseInt(request.query.limit as string) : null;
  const skip = page && limit ? (page - 1) * limit : 0;

  try {
    const studentListQuery = studentModel.aggregate([
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
          "profileDetails.id": 0,
          "profileDetails.roleId": 0,
          "profileDetails.createdAt": 0,
          "profileDetails.updatedAt": 0,
          "profileDetails.createrRole": 0,
          "profileDetails.updaterRole": 0,
          "profileDetails.createdBy": 0,
          "profileDetails.updatedBy": 0,
          "profileDetails.isActive": 0,
          "createdAt": 0,
          "updatedAt": 0,
          "createrRole": 0,
          "updaterRole": 0,
          "createdBy": 0,
          "updatedBy": 0,
        },
      },
    ]);

    if (page && limit) {
      studentListQuery.skip(skip).limit(limit);
    }

    const studentList = await studentListQuery.exec();

    const totalStudents = await studentModel.countDocuments();

    const totalPages = limit ? Math.ceil(totalStudents / limit) : 1;

    if (studentList && studentList.length > 0) {
      return response.status(StatusCodes.OK).json({
        data: studentList,
        totalPages: totalPages,
        message: "Students " + Messages.FETCHED_SUCCESSFULLY,
      });
    }
    return response.status(StatusCodes.NOT_FOUND).json({
      data: [],
      message: "Students " + Messages.THIS_NOT_FOUND,
    });
  } catch (error) {
    console.log("Error occurred in viewStudentListController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};


export const viewCounsellorListController = async (
  request: Request,
  response: Response
) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit;

  try {
    const counsellorList = await userModel
      .find({ roleId: COUNSELLOR_ROLE_ID })
      .select("-_id id firstName lastName contactNumber email profileImg")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit || 0);

    const totalCounsellors = await userModel.countDocuments({
      roleId: COUNSELLOR_ROLE_ID,
    });

    const totalPages = limit ? Math.ceil(totalCounsellors / limit) : 1;

    if (counsellorList && counsellorList.length > 0) {
      return response.status(StatusCodes.OK).json({
        counsellorList: counsellorList,
        totalPages: totalPages,
        message: "Counsellors " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Counsellor list " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in viewCounsellorListController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};