import { Request, Response } from "express";

import {
  CustomRequest,
  generateUniqueId,
  Messages,
  StatusCodes,
} from "../config";
import statusModel from "../model/statusModel";

export const addNewStatusController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }
    const { email, roleName } = request.payload;
    console.log("request.payload ", request.payload);

    const { statusName } = request.body;
    const statusId = await generateUniqueId(statusModel, "STATUS");
    const data = {
      id: statusId,
      name: statusName,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const newStatus = await statusModel.create(data);
    if (newStatus) {
      response.status(StatusCodes.CREATED).json({
        message: "Status " + Messages.CREATED_SUCCESSFULLY,
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: Messages.SOMETHING_WENT_WRONG,
      });
    }
  } catch (error) {
    console.error("Error in addNewStatusController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
};

export const getAllStatusController = async (
  request: CustomRequest,
  response: Response
) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit;

  try {
    const statusList = await statusModel
      .find()
      .select("-_id id name")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit || 0);

    const totalStatuses = await statusModel.countDocuments();

    const totalPages = limit ? Math.ceil(totalStatuses / limit) : 1;

    if (statusList && statusList.length > 0) {
      return response.status(StatusCodes.OK).json({
        statusList: statusList,
        totalPages: totalPages,
        message: "Status " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Statuslist " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in getAllStatusController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getStatusByIdController = async (
  request: Request,
  response: Response
) => {
  const { statusId } = request.params;
  try {
    const status = await statusModel.findOne({ id: statusId })
      .select("-_id id name");
    if (!status) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Status " + Messages.THIS_NOT_FOUND });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: status, message: "Status " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occured in getStatusById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const updateStatusController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { statusId } = request.params;

    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }

    const { email, roleName } = request.payload;
    const { statusName } = request.body;

    const updatedStatus = await statusModel.findOneAndUpdate(
      { id: statusId },
      {
        name: statusName,
        updatedBy: email,
        updaterRole: roleName,
      },
      { new: true }
    );

    if (!updatedStatus) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Status " + Messages.THIS_NOT_FOUND });
    }

    response.status(StatusCodes.OK).json({
      message: "Status " + Messages.UPDATED_SUCCESSFULLY,
      status: updatedStatus,
    });
  } catch (error) {
    console.error("Error in updateStatusController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
};
