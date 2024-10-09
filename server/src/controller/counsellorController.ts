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
import { Audit, Comment } from "../model/leadModel";

export const counsellorAddNewLeadController = async (
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

    const result = [];
    for (const leadData of leads) {
      const {
        firstName,
        lastName,
        leadEmail,
        contactNumber,
        productAmount,
        discount,
        channelId,
        statusId,
        productId,
        description,
      } = leadData;

      let existingLead = await leadModel.findOne({ email: leadEmail });

      if (existingLead) {
        if (existingLead.productId === productId) {
          return response.status(StatusCodes.ALREADY_EXIST).json({
            message: "Product already exists in the lead products.",
          });
        }
      } else {
        const leadId = await generateUniqueId(leadModel, "LEAD");
        const newLeadData = {
          id: leadId,
          firstName,
          lastName,
          email: leadEmail,
          contactNumber,
          productAmount,
          discount,
          channelId,
          statusId,
          productId,
          description,
          createdBy: email,
          updatedBy: email,
          createrRole: roleName,
          updaterRole: roleName,
        };
        const newLead = await leadModel.create(newLeadData);
        result.push(newLead);
      }
    }

    return response
      .status(StatusCodes.CREATED)
      .json({ data: result, message: "Lead added successfully." });
  } catch (error) {
    console.error("Error occurred in addNewLeadController: ", error);
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

export const counsellorUpdateLeadController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { email, roleName } = request.payload || {};
    const { leadId } = request.params;

    if (!email || !roleName) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }

    const {
      firstName,
      lastName,
      contactNumber,
      productAmount,
      discount,
      channelId,
      statusId,
      productId,
      description,
      assignedTo,
      comment,
      isActive,
    } = request.body;

    const existingLead = await leadModel.findOne({ id: leadId });

    if (!existingLead) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead not found." });
    }

    const auditLogs: Audit[] = [];

    const addAuditLog = (field: string, oldValue: string, newValue: string) => {
      auditLogs.push({
        field,
        oldValue,
        newValue,
        editedBy: email!,
        editorRole: roleName!,
      } as Audit);
    };

    if (firstName && firstName !== existingLead.firstName) {
      addAuditLog("firstName", existingLead.firstName, firstName);
      existingLead.firstName = firstName;
    }

    if (lastName && lastName !== existingLead.lastName) {
      addAuditLog("lastName", existingLead.lastName, lastName);
      existingLead.lastName = lastName;
    }

    if (contactNumber && contactNumber !== existingLead.contactNumber) {
      addAuditLog(
        "contactNumber",
        existingLead.contactNumber.toString(),
        contactNumber.toString()
      );
      existingLead.contactNumber = contactNumber;
    }

    if (productAmount && productAmount !== existingLead.productAmount) {
      addAuditLog(
        "productAmount",
        existingLead.productAmount?.toString() || "",
        productAmount.toString()
      );
      existingLead.productAmount = productAmount;
    }

    if (discount && discount !== existingLead.discount) {
      addAuditLog(
        "discount",
        existingLead.discount?.toString() || "",
        discount.toString()
      );
      existingLead.discount = discount;
    }

    if (channelId && channelId !== existingLead.channelId) {
      addAuditLog("channelId", existingLead.channelId || "", channelId);
      existingLead.channelId = channelId;
    }

    if (statusId && statusId !== existingLead.statusId) {
      addAuditLog("statusId", existingLead.statusId || "", statusId);
      existingLead.statusId = statusId;
    }

    if (productId && productId !== existingLead.productId) {
      addAuditLog("productId", existingLead.productId || "", productId);
      existingLead.productId = productId;
    }

    if (description && description !== existingLead.description) {
      addAuditLog("description", existingLead.description || "", description);
      existingLead.description = description;
    }

    if (isActive && isActive !== existingLead.isActive) {
      addAuditLog(
        "isActive",
        existingLead.isActive ? "true" : "false",
        isActive ? "true" : "false"
      );
      existingLead.isActive = isActive;
    }

    if (assignedTo && assignedTo !== existingLead.assignedTo) {
      addAuditLog(
        "assignedTo",
        existingLead.assignedTo || "Unassigned",
        assignedTo
      );
      existingLead.assignedTo = assignedTo;
    }

    if (auditLogs.length > 0) {
      existingLead.auditLogs.push(...auditLogs);
    }

    if (comment) {
      existingLead.comments.push({
        comment,
        commentedBy: email!,
      } as Comment);
    }

    existingLead.updatedBy = email!;
    existingLead.updaterRole = roleName!;

    await existingLead.save();

    return response
      .status(StatusCodes.OK)
      .json({ message: "Lead updated successfully.", lead: existingLead });
  } catch (error) {
    console.error("Error occurred in updateLeadController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
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
      productsPurchased,
      statusId,
    } = request.body;

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
        products: productsPurchased,
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

    const transactionId = await generateUniqueId(
      transactionModel,
      "TRANSACTION"
    );
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
      productsPurchased: productsPurchased,
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
      productsEnrolled: productsPurchased,
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
