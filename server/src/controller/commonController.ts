import { Request, Response, NextFunction } from "express";
import userModel from "../model/userModel";
import { CustomRequest, StatusCodes } from "../config";

export const viewProfileController = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        console.log("result", request.payload);
        let userId = request.payload?.userId;
        if (!userId) {
            return response
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "Token not found" });
        }
        const result = await userModel.findOne({ userId });
        if (!result) {
            return response.status(StatusCodes.NOT_FOUND).json({ message: "The Account You are Trying to Access not find..!" });
        } else if (result?.statusId) {
            console.log("result", result?.roleId);
            const userData = {
                name: result?.firstName + " " + result?.lastName,
                email: result?.email,
                contactNumber: result?.contactNumber,
                profileImg: result?.profileImg,
                role: request.payload?.roleName,
            };
            response.status(StatusCodes.OK).json({
                userData: userData,
                message: "UserData fetched successfully ..!",
            });
        }
    } catch (error) {
        console.log(error);
        response
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong ..!" });
    }
};