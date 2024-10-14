import { Request, Response } from "express";

import {
  CustomRequest,
  generateUniqueId,
  Messages,
  StatusCodes,
} from "../config";
import channelModel from "../model/channelModel";

export const addNewChannelController = async (
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
    const { channelName } = request.body;

    const channelId = await generateUniqueId(channelModel, "CHANNEL");
    const data = {
      id: channelId,
      name: channelName,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const newChannel = await channelModel.create(data);
    if (newChannel) {
      response.status(StatusCodes.CREATED).json({
        message: "Channel " + Messages.CREATED_SUCCESSFULLY,
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: Messages.SOMETHING_WENT_WRONG,
      });
    }
  } catch (error) {
    console.error("Error in addNewChannelController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
};

export const getAllChannelsController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const chanelList = await channelModel
      .find()
      .select("-_id id name")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (chanelList && chanelList.length > 0) {
      response.status(StatusCodes.OK).json({
        chanelList: chanelList,
        message: "Channels " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Channel list " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occure in getAllChannelsController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getChannelByIdController = async (
  request: Request,
  response: Response
) => {
  const { channelId } = request.params;
  try {
    const channel = await channelModel.findOne({ id: channelId })
    .select("-_id id name");
    if (!channel) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Channel " + Messages.THIS_NOT_FOUND });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: channel, message: "Channel " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occured in getChannelById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const updateChannelController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { channelId } = request.params;

    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }

    const { email, roleName } = request.payload;
    const { channelName } = request.body;

    const updatedChannel = await channelModel.findOneAndUpdate(
      { id: channelId },
      {
        name: channelName,
        updatedBy: email,
        updaterRole: roleName,
      },
      { new: true }
    );

    if (!updatedChannel) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Channel " + Messages.THIS_NOT_FOUND });
    }

    response.status(StatusCodes.OK).json({
      message: "Channel " + Messages.UPDATED_SUCCESSFULLY,
      channel: updatedChannel,
    });
  } catch (error) {
    console.error("Error in updateChannelController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
};
