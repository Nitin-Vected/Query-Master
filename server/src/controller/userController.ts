import express, { Request, Response, NextFunction } from "express";
import userModel from "../model/userModel";
import { tokenVerifier } from "../utilities/jwt";
import { generateUniqueId, StatusCodes, USER_SECRET_KEY } from "../config";
import queryModel from "../model/queryModel";

export const userViewProfileController = async (
  request: any,
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
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "The Account You are Trying to Access not find..!" });
    } else if (result?.status) {
      console.log("result", result?.roleId);
      const userData = {
        name: result?.firstName + " " + result?.lastName,
        email: result?.email,
        contactNumber: result?.contactNumber,
        profileImg: result?.profileImg,
        role: request.payload.roleName,
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

export const userAddContactNumberController = async (
  request: any,
  response: express.Response
) => {
  try {
    const userEmail = request.payload.email;
    const { contactNumber } = request.body;
    if (!userEmail) {
      response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token not found" });
    } else {
      const result = await userModel.updateOne(
        { email: userEmail },
        { $set: { contactNumber: contactNumber } }
      );
      console.log("ContactNumber updated ", result);

      if (result?.acknowledged) {
        response
          .status(StatusCodes.OK)
          .json({ message: "Contact number updated successfully ..!" });
      } else {
        response.status(StatusCodes.UNAUTHORIZED).json({
          message: "The account you are trying to access has been deactivated!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const userRaiseQueryController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { name, email, roleName } = request.payload;
    const { subject, message } = request.body;

    const similaryExistingQuery = await queryModel.findOne({
      userEmail: email,
      userRole: roleName,
      subject,
      message,
    });
    if (!similaryExistingQuery) {
      console.log("Inside if block of userRaiseQueryController ..!");
      const queryId = await generateUniqueId("query", email, roleName);
      console.log("Unique QueryId inside userRaiseQueryController ", queryId);
      const updatedQuery = await queryModel.create({
        queryId: queryId,
        userEmail: email,
        userRole: roleName,
        subject,
        message,
        conversation: [
          {
            sender: name,
            email: email,
            message: message,
            role: roleName,
            timestamp: new Date(),
          },
        ],
      });
      if (updatedQuery) {
        console.log("query raised successfull ..!", updatedQuery);
        response
          .status(StatusCodes.OK)
          .json({ message: "Your query has been successfully published ..!" });
      } else {
        response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ userData: null, message: "Something went wrong ..!" });
      }
    } else {
      response
        .status(StatusCodes.ALREADY_EXIST)
        .json({ message: "A similar query has already been added by you ..!" });
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create query" });
  }
};

export const userViewMyQueriesController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, roleName } = request.payload;
    const myQueries = await queryModel
      .find(
        { userEmail: email, userRole: roleName },
        { "conversation._id": 0, _id: 0 }
      )
      .sort({ updatedAt: -1, createdAt: -1 });
    console.log(`RaisedQuery by  ${myQueries} : `);
    if (myQueries) {
      response.status(StatusCodes.OK).json({
        myQueries: myQueries,
        message: "These are the recently raised queries by you ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ myQueries: null, message: "No Queries are added by You ..!" });
    }
  } catch (error) {
    console.log("Error occure in userRaiseQueryController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const userAddCommentController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { name, email, roleName } = request.payload;
    const { queryId } = request.params;
    const { message } = request.body;
    console.log("QueryId : ", name, email, roleName);

    // Find the query by its _id
    const query = await queryModel.findOne({ queryId });
    if (!query) {
      response.status(StatusCodes.NOT_FOUND).json({ error: "Query not found" });
    } else if (query.status !== "Closed") {
      console.log("Query ", query);
      query.conversation.push({
        sender: name,
        email: email,
        message,
        role: roleName,
        timestamp: new Date(),
      });
      await query.save();
      response.status(StatusCodes.OK).json({
        message: "Your response has been sent to the trail successfully!",
      });
    } else {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Query has been closed by the user ..!" });
    }
    console.log("Query in userAddCommentController : ", query);
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to find query" });
  }
};

export const userManageQueryStatusController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { queryId, status } = request.params;
    console.log("query id : ", queryId, "   query status : ", status);
    if (!queryId || !status) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Query ID and status are required" });
    }
    const result = await queryModel.updateOne(
      { queryId: queryId },
      { $set: { status: status } }
    );
    console.log("Query Status :", result);

    if (!result?.acknowledged) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Query not found or email mismatch" });
    }
    console.log("Query status updated successfully");
    response
      .status(StatusCodes.CREATED)
      .json({ message: "Query status updated successfully" });
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to find query" });
  }
};

export const userAuthenticationController = async (
  request: any,
  response: express.Response
) => {
  try {
    console.log("Inside userAuthenticationController");

    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    console.log("token inside userAuthenticationController -> ", token);
    const payload = await tokenVerifier(token, USER_SECRET_KEY);
    const result = await userModel.findOne({ email: payload.email });
    const userData = {
      name: result?.firstName + " " + result?.lastName,
      email: result?.email,
      contactNumber: result?.contactNumber,
      role: result?.roleId,
      profileImg: result?.profileImg,
    };
    response.status(StatusCodes.OK).json({
      userData: userData,
      token: token,
      message: "Authenntication Successfull ..!",
    });
  } catch (err) {
    console.log("Error while user authentication Controller", err);
    response.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token Not verify please login then try to access ..!",
    });
  }
};

export const userGetQueryDataController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { queryId } = request.params;
    const queryData = await queryModel.findOne(
      { queryId: queryId },
      { "conversation._id": 0, _id: 0 }
    );
    if (queryData) {
      response
        .status(StatusCodes.OK)
        .json({ queryData: queryData, message: "Query has been f ..!" });
    } else {
      response.status(StatusCodes.NOT_FOUND).json({
        queryData: null,
        message: "Query Not found with this Id  ..!",
      });
    }
  } catch (err) {
    console.log("Error while user authentication Controller", err);
    response.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token Not verify please login then try to access ..!",
    });
  }
};

// for backend
export const userAuthenticateJWT = async (
  request: any,
  response: express.Response,
  next: Function
) => {
  try {
    const authHeader = request.headers["authorization"];
    console.log("request.headers", request.headers);
    console.log("authHeader", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    const payload = await tokenVerifier(token, USER_SECRET_KEY);
    request.payload = payload;
    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired User token" });
  }
};
