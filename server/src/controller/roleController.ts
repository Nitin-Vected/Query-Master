import { Request, Response } from "express";

import {
  CustomRequest,
  generateUniqueId,
  Messages,
  StatusCodes,
} from "../config";
import roleModel from "../model/roleModel";

export const addNewRoleController = async (
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

    const { userRole, access } = request.body;
    const roleId = await generateUniqueId(roleModel, "ROLE");
    const data = {
      id: roleId,
      name: userRole,
      access,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };
    console.log("data ", data);

    const newRole = await roleModel.create(data);
    if (newRole) {
      response.status(StatusCodes.CREATED).json({
        message: "Role " + Messages.CREATED_SUCCESSFULLY,
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: Messages.SOMETHING_WENT_WRONG,
      });
    }
  } catch (error) {
    console.error("Error in addNewRoleController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
};

export const getAllRolesController = async (
  request: CustomRequest,
  response: Response
) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit;

  try {
    const roleList = await roleModel
      .find()
      .select("-_id id name access")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRoles = await roleModel.countDocuments();

    const totalPages = Math.ceil(totalRoles / limit);

    if (roleList && roleList.length > 0) {
      response.status(StatusCodes.OK).json({
        roleList: roleList,
        totalPages: totalPages,
        message: "Roles " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Roles " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in getAllRolesController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getRoleByIdController = async (
  request: Request,
  response: Response
) => {
  const { roleId } = request.params;
  try {
    const role = await roleModel.findOne({ id: roleId })
      .select("-_id id name access");
    if (!role) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Role " + Messages.THIS_NOT_FOUND });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: role, message: "Role " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occured in getRoleById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const updateRoleController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { roleId } = request.params;
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }

    const { email, roleName } = request.payload;
    const { userRole, access } = request.body;

    const updatedRole = await roleModel.findOneAndUpdate(
      { id: roleId },
      {
        ...(userRole && { name: userRole }),
        ...(access && { access }),
        updatedBy: email,
        updaterRole: roleName,
      },
      { new: true }
    );

    if (!updatedRole) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Role " + Messages.THIS_NOT_FOUND });
    }

    response.status(StatusCodes.OK).json({
      message: "Role " + Messages.UPDATED_SUCCESSFULLY,
      role: updatedRole,
    });
  } catch (error) {
    console.error("Error in updateRoleController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
};
