import {
  COUNSELLOR_SECRET_KEY,
  CustomRequest,
  STUDENT_ROLE_ID,
  StatusCodes,
  generateUniqueId,
} from "../config";
import { Request, Response, NextFunction } from "express";
import { tokenVerifier } from "../utilities/jwt";
import leadModel from "../model/leadModel";
import studentModel from "../model/studentModel";
import userModel from "../model/userModel";
import transactionModel from "../model/transactionModel";
import { deleteFile } from "../utilities/deleteUploadedFile";
import orderModel from "../model/orderModel";
import mongoose from "mongoose";

export const counsellorManageLeadStatusController = async (
  request: Request,
  response: Response
) => {
  try {
    const { email, statusId } = request.body;
    console.log("Lead email: ", email, "  action: ", statusId);

    if (!email || !statusId) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email, Course ID, and action are required" });
    }
    const result = await leadModel.updateOne(
      { email: email },
      { $set: { statusId: statusId } }
    );

    console.log(result);

    if (result?.acknowledged) {
      return response
        .status(StatusCodes.OK)
        .json({ message: "Lead status has been updated successfully!" });
    } else {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead or course not found." });
    }
  } catch (error) {
    console.error("Error updating lead status: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong, please try again." });
  }
};

export const counsellorAddNewLeadsController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    const leads = Array.isArray(request.body) ? request.body : [request.body];
    const leadId = await generateUniqueId(leadModel, "LEAD");

    const result = [];
    for (const leadData of leads) {
      console.log("Lead does not exist. Creating a new lead.");
      const newLeadData = {
        id: leadId,
        ...leadData,
        createdBy: email,
        updatedBy: email,
        createrRole: roleName,
        updaterRole: roleName,
      };

      const newLead = await leadModel.create(newLeadData);
      result.push(newLead);
    }

    console.log("Result: ", result);
    return response
      .status(StatusCodes.CREATED)
      .json({ data: result, message: "Leads processed successfully." });
  } catch (error) {
    console.error("Error occurred in addNewLeads: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
  }
};

export const counsellorGetAllLeadsController = async (
  request: Request,
  response: Response
) => {
  try {
    const leads = await leadModel.find();
    if (leads) {
      return response.status(StatusCodes.OK).json({
        leads: leads,
        message: "Leads Fetched Successfully!",
      });
    } else {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ leads: null, message: "Leads Not Found!" });
    }
  } catch (error) {
    console.log("Error occured in getAllLeads : ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const counsellorGetLeadByIdController = async (
  request: Request,
  response: Response
) => {
  try {
    const { leadId } = request.params;
    const lead = await leadModel.findOne({ id: leadId });

    if (!lead) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead not found" });
    }
    response.status(200).json({ data: lead, message: "Lead of given id" });
  } catch (error) {
    console.log("Error occured in getLeadById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const counsellorRegisterLeadAsUserController = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  let uploadedFilePath = "";
  let session: mongoose.ClientSession | null = null;
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    session = await mongoose.startSession();
    session.startTransaction();

    const { email: counsellorEmail, roleName } = request.payload;
    let {
      email: leadEmail,
      name,
      contactNumber,
      paymentMode,
      paymentType,
      transactionDate,
      transactionAmount,
      discount,
      finalAmount,
      coursesPurchased,
      statusId,
    } = request.body;

    console.log("leadEmail ==> ", leadEmail);
    const [firstName, lastName] = name.split(" ");

    const existingLead = await leadModel.findOne({ email: leadEmail });
    if (!existingLead) {
      const leadData = {
        firstName,
        lastName,
        email: leadEmail,
        contactNumber,
        finalAmount,
        discount,
        courses: coursesPurchased,
        statusId,
        createdBy: counsellorEmail,
        updatedBy: counsellorEmail,
        createrRole: roleName,
        updaterRole: roleName,
      };
      const leadRegistrationResult = await leadModel.create([leadData], {
        session,
      });
      if (!leadRegistrationResult) {
        throw new Error(
          "Student Registration Failed, Please register the Lead first ..!"
        );
      }
    }

    const missingField = Object.entries(request.body).find(
      ([key, value]) => !value
    );

    if (missingField) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        message: "Please Enter all the required fields and try again ..!",
      });
    }

    const transactionProof = request.file?.path;
    if (transactionProof) {
      uploadedFilePath = transactionProof;
    }

    const userId = await generateUniqueId(userModel, "USER");
    const dataToRegister = {
      id: userId,
      email: leadEmail,
      firstName,
      lastName,
      status: true,
      roleId: STUDENT_ROLE_ID,
      contactNumber,
    };

    const result = await userModel.create([dataToRegister], { session });
    if (!result) {
      throw new Error("Failed to create user");
    }

    const transactionId = await generateUniqueId(transactionModel, "TRANSACTION");
    const transactionData = {
      id: transactionId,
      userId,
      paymentMode,
      paymentType,
      transactionDate,
      transactionAmount,
      transactionProof,
      createdBy: counsellorEmail,
      updatedBy: counsellorEmail,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const newTransaction = await transactionModel.create([transactionData], {
      session,
    });
    if (!newTransaction) {
      throw new Error("Transaction creation failed");
    }

    const orderId = await generateUniqueId(orderModel, "ORDER");
    const orderData = {
      id: orderId,
      userId,
      transactionId,
      coursesPurchased: coursesPurchased,
      finalAmount: finalAmount,
      discount: discount,
      createdBy: counsellorEmail,
      updatedBy: counsellorEmail,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const newOrder = await orderModel.create([orderData], { session });
    if (!newOrder) {
      throw new Error("Order creation failed");
    }

    const leadStatusResult = await leadModel.updateOne(
      { email: leadEmail },
      { $set: { statusId: statusId } },
      { session }
    );

    if (!leadStatusResult?.acknowledged) {
      throw new Error("Lead status update failed");
    }

    const enrollmentNumber = await generateUniqueId(studentModel, "VSA");

    const studentData = {
      enrollmentNumber,
      coursesEnrolled: coursesPurchased,
      userId,
      transactions: [transactionId],
      fees: finalAmount,
      discount,
      enrollmentDate: transactionDate,
      createdBy: counsellorEmail,
      updatedBy: counsellorEmail,
      createrRole: roleName,
      updaterRole: roleName,
    };
    const studentResult = await studentModel.create([studentData], { session });
    if (!studentResult) {
      throw new Error("Student registration failed");
    }
    await session.commitTransaction();
    session.endSession();

    response
      .status(StatusCodes.CREATED)
      .json({ message: "Student Enrolled Successfully ..!" });
  } catch (error) {
    await userModel.deleteOne({ email: request.body.email });
    deleteFile(uploadedFilePath);
    console.error("Error registering lead as user: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong, please try again." });
  }
};

export const counsellorAddNewLeadController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response.status(StatusCodes.UNAUTHORIZED).json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    const leads = Array.isArray(request.body) ? request.body : [request.body];

    const result: object[] = [];
    for (const leadData of leads) {
      const { firstName, lastName, contactNumber, productAmount, comment, discount, statusId, description, assignedTo, leadEmail, productId } = leadData;
      console.log(leadData)

      let existingLead = await leadModel.findOne({ email: leadEmail });

      if (existingLead) {
        console.log("Lead already exists", existingLead);
        if (existingLead.productId === productId) {
          console.log("This Product already exists in this Lead");
          return response
            .status(StatusCodes.ALREADY_EXIST)
            .json({ data: result, message: "Course already exists in the lead’s courses." });
        }

      } else {
        console.log("Lead does not exist. Creating a new lead.");
        const leadId = await generateUniqueId(leadModel, "LEAD")
        const newLeadData = {
          id: leadId,
          firstName,
          lastName,
          email: leadEmail,
          contactNumber,
          productAmount,
          discount,
          statusId,
          assignedTo,
          description,
          comments: [{
            comment,
            commentedBy: email
          }],
          createdBy: email,
          updatedBy: email,
          createrRole: roleName,
          updaterRole: roleName,
        };
        const newLead = await leadModel.create(newLeadData);
        result.push(newLead);
      }
    }
    console.log("Result: ", result);
    return response
      .status(StatusCodes.CREATED)
      .json({ data: result, message: "Leads processed successfully." });
  } catch (error) {
    console.error("Error occurred in addNewLeads: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
  }
};

export const counsellorAuthenticateJWT = async (
  request: CustomRequest,
  response: Response,
  next: Function
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader?.split(" ")[1];
    const payload = await tokenVerifier(token, COUNSELLOR_SECRET_KEY);
    request.payload = payload;
    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired Candidate token" });
  }
};
