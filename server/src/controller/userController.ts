import express from "express";
import userModel from "../model/userModel";
import { tokenVerifier } from "../utilities/jwt";
import { StatusCodes, USER_SECRET_KEY } from "../config";
import queryModel from "../model/queryModel";

export const userViewProfileController = async (
  request: any,
  response: express.Response
) => {
  try {
    const email = request.payload.email;
    if (!email) {
      response.status(404).json({ message: "Token not found" });
    } else {
      const userData = await userModel.findOne({ email });
      if (userData?.status) {
        response.status(StatusCodes.CREATED).json({
          userData: userData,
          message: "This is your dersired data ..!",
        });
      } else {
        response.status(404).json({
          userData: null,
          message:
            "The Account You are Trying to Acces has been Deactivated ..!",
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

export const userAddContactNumberController = async (
  request: any,
  response: express.Response
) => {
  try {
    const userEmail = request.payload.email;
    const { contactNumber } = request.body;
    // console.log('Hello from userAddContactNumberController ..!',userEmail,'  ',contactNumber);
    if (!userEmail) {
      response.status(404).json({ message: "Token not found" });
    } else {
      const userData = await userModel.findOneAndUpdate(
        { email: userEmail },
        { contactNumber },
        { new: true }
      );
      if (userData?.status) {
        return response.status(StatusCodes.CREATED).json({
          userData: userData,
          message: "Contact number updated successfully!",
        });
      } else {
        return response.status(StatusCodes.UNAUTHORIZED).json({
          userData: null,
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
    const { name, email, role } = request.payload;
    const { subject, message } = request.body;

    const similaryExistingQuery = await queryModel.findOne({
      userEmail: email,
      userRole: role,
      subject,
      message,
    });
    console.log("email", email);
    console.log("role", role);
    console.log("subject", subject);
    console.log("message", message);
    console.log("similaryExistingQuery", similaryExistingQuery);

    if (!similaryExistingQuery) {
      console.log("Inside if block of userRaiseQueryController ..!");

      const updatedQuery = await queryModel.create({
        userEmail: email,
        userRole: role,
        subject,
        message,
        conversation: [
          {
            sender: name,
            email: email,
            message: message,
            role: role,
            timestamp: new Date(),
          },
        ],
      });
      return response.status(StatusCodes.CREATED).json({
        updatedQuery,
        message: "Your query has been successfully published ..!",
      });
    } else {
      return response
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

// according to pagination page = current Page Number, limit = number of Documents
export const userGetQueriesController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, role } = request.payload;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 4;

    const numberOfDocsToSkip = (page - 1) * limit;
    const total = await queryModel.countDocuments(); // 3
    const myQueries = await queryModel
      .find({ userEmail: email, userRole: role })
      .skip(numberOfDocsToSkip)
      .limit(limit);
    console.log("My Queries : ", myQueries);
    console.log("Page  : ", page);
    console.log("limit : ", limit);
    console.log("Total Queries : ", total);

    response.json({
      page,
      limit,
      total,
      myQueries: myQueries,
    });
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
    const { email, role } = request.payload;
    const myQueries = await queryModel.find({
      userEmail: email,
      userRole: role,
    });
    console.log(`RaisedQuery by  ${myQueries} : `);
    if (myQueries) {
      return response.status(StatusCodes.CREATED).json({
        myQueries: myQueries,
        message: "These are the recently raised queries by you ..!",
      });
    } else {
      throw new Error("Queries not found ..!");
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
    const { name, email, role } = request.payload;
    const { queryId } = request.params;
    const { message } = request.body;
    console.log("QueryId : ", queryId);

    // Find the query by its _id
    const query = await queryModel.findOne({ _id: Object(queryId) });
    if (!query) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Query not found" });
    } else if (query.status === "Open") {
      console.log("Query ", query);
      query.conversation.push({
        sender: name,
        email: email,
        message,
        role: role,
        timestamp: new Date(),
      });
      await query.save();
      response.status(StatusCodes.CREATED).json({
        query,
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
    const { name, email, role } = request.payload;
    const { queryId, status } = request.params;
    console.log("query id : ", queryId, "   query status : ", status);
    if (!queryId || !status) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Query ID and status are required" });
    }

    const query = await queryModel.findOneAndUpdate(
      { _id: Object(queryId), userEmail: email },
      { status: status },
      { new: true }
    );
    if (!query) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Query not found or email mismatch" });
    }

    console.log("Query status updated successfully");
    response
      .status(StatusCodes.CREATED)
      .json({ message: "Query status updated to Closed successfully", query });
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
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    console.log("Token : ", token);
    const payload = await tokenVerifier(token, USER_SECRET_KEY);
    const userData = await userModel.findOne({ email: payload.email });
    console.log(
      "userData : ",
      userData,
      "  token in userAuthenticationController : ",
      token
    );
    response.status(StatusCodes.CREATED).json({
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

// for backend
export const userAuthenticateJWT = async (
  request: any,
  response: express.Response,
  next: Function
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    console.log("Token : ", token);
    const payload = await tokenVerifier(token, USER_SECRET_KEY);
    request.payload = payload;
    next();
  } catch (error) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired User token" });
  }
};
