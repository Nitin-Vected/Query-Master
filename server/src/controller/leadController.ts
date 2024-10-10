import {
  CustomRequest,
  STATUS_ENROLLED,
  STUDENT_ROLE_ID,
  StatusCodes,
  generateUniqueId,
} from "../config";
import { Request, Response } from "express";
import leadModel from "../model/leadModel";
import studentModel from "../model/studentModel";
import userModel from "../model/userModel";
import transactionModel from "../model/transactionModel";
import { deleteFile } from "../utilities/deleteUploadedFile";
import orderModel from "../model/orderModel";
import mongoose from "mongoose";
import { Audit, Comment } from "../model/leadModel";
import { createUser } from "./userController";
import { createTransaction } from "./transactionController";
import { createOrder, updateOrderWithTransactionId } from "./orderController";
import { enrollStudent } from "./studentController";

export const addNewLeadController = async (
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

export const getAllLeadsController = async (
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

export const getLeadByIdController = async (
  request: Request,
  response: Response
) => {
  try {
    const { leadId } = request.params;
    const lead = await leadModel.findOne({ id: leadId });

    if (!lead) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead Not Found" });
    }
    response
      .status(200)
      .json({ data: lead, message: "Lead Fetched Successfully" });
  } catch (error) {
    console.log("Error occured in getLeadById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const updateLeadController = async (
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

export const enrollLeadController = async (
  request: CustomRequest,
  response: Response
) => {
  if (!request.payload) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User payload is missing or invalid." });
  }
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const { email, roleName } = request.payload;
    const userId = await createUser(
      { ...request.body, email, roleName },
      session
    );
    console.log("user created successfully -----");

    const orderId = await createOrder(
      { ...request.body, userId, email, roleName },
      session
    );
    console.log("order created successfully -----");

    const transactionId = await createTransaction(
      { ...request.body, userId, email, roleName },
      orderId,
      session
    );

    console.log("transaction created successfully -----");
    await updateOrderWithTransactionId(orderId, transactionId, session);

    await enrollStudent(
      { ...request.body, userId, orderId, transactionId, email, roleName },
      session
    );
    console.log("student created successfully -----");

    await session.commitTransaction();
    session.endSession();

    return response
      .status(StatusCodes.CREATED)
      .json({ message: "Student Enrolled Successfully!" });
  } catch (error) {
    if (request.file?.path) {
      deleteFile(request.file.path);
    }

    await session?.abortTransaction();
    session?.endSession();

    console.error("Error during enrollment: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Enrollment failed, please try again." });
  }
};

// export const enrollLeadController = async (
//     request: CustomRequest,
//     response: Response
// ) => {
//     let uploadedFilePath = "";
//     let session: mongoose.ClientSession | null = null;
//     try {
//         if (!request.payload) {
//             return response
//                 .status(StatusCodes.UNAUTHORIZED)
//                 .json({ message: "User payload is missing or invalid." });
//         }
//         session = await mongoose.startSession();
//         session.startTransaction();

//         const { email, roleName } = request.payload;
//         const {
//             leadEmail,
//             firstName,
//             lastName,
//             contactNumber,
//             paymentMode,
//             transactionDate,
//             transactionAmount,
//             products,
//             finalAmount,
//             dueDate,
//             dueAmount,
//         } = request.body;

//         // const existingLead = await leadModel.findOne({ email: leadEmail });
//         // if (!existingLead) {
//         //   console.log("Lead does not exist. Creating a new lead.");
//         //   const leadId = await generateUniqueId(leadModel, "LEAD");
//         //   const leadData = {
//         //     id: leadId,
//         //     firstName,
//         //     lastName,
//         //     email: leadEmail,
//         //     contactNumber,
//         //     productAmount: finalAmount,
//         //     discount,
//         //     productId,
//         //     statusId: STATUS_INTERESTED,
//         //     createdBy: email,
//         //     updatedBy: email,
//         //     createrRole: roleName,
//         //     updaterRole: roleName,
//         //   };
//         //   const leadRegistrationResult = await leadModel.create([leadData], {
//         //     session,
//         //   });
//         //   if (!leadRegistrationResult) {
//         //     throw new Error(
//         //       "Student Registration Failed, Please register the Lead first ..!"
//         //     );
//         //   }
//         // }

//         const transactionProof = request.file?.path;
//         if (transactionProof) {
//             uploadedFilePath = transactionProof;
//         }

//         const userId = await generateUniqueId(userModel, "USER");
//         const userData = {
//             id: userId,
//             firstName,
//             lastName,
//             email: leadEmail,
//             contactNumber,
//             roleId: STUDENT_ROLE_ID,
//             status: true,
//             createdBy: email,
//             updatedBy: email,
//             createrRole: roleName,
//             updaterRole: roleName,
//         };

//         const result = await userModel.create([userData], { session });

//         if (!result) {
//             throw new Error("Failed to create user");
//         }

//         const orderId = await generateUniqueId(orderModel, "ORDER");

//         const transactionId = await generateUniqueId(
//             transactionModel,
//             "TRANSACTION"
//         );
//         const transactionData = {
//             id: transactionId,
//             orderId,
//             mode: paymentMode,
//             date: transactionDate,
//             amount: transactionAmount,
//             proof: transactionProof,
//             createdBy: email,
//             updatedBy: email,
//             createrRole: roleName,
//             updaterRole: roleName,
//         };

//         const newTransaction = await transactionModel.create([transactionData], {
//             session,
//         });
//         if (!newTransaction) {
//             throw new Error("Transaction creation failed");
//         }

//         const orderData = {
//             id: orderId,
//             userId,
//             transactions: [transactionId],
//             products,
//             amount: finalAmount,
//             dueAmount,
//             dueDate,
//             createdBy: email,
//             updatedBy: email,
//             createrRole: roleName,
//             updaterRole: roleName,
//         };

//         const newOrder = await orderModel.create([orderData], { session });
//         if (!newOrder) {
//             throw new Error("Order creation failed");
//         }

//         const leadStatusResult = await leadModel.updateOne(
//             { email: leadEmail },
//             { $set: { statusId: STATUS_ENROLLED } },
//             { session }
//         );

//         if (!leadStatusResult?.acknowledged) {
//             throw new Error("Lead status update failed");
//         }

//         const enrollmentNumber = await generateUniqueId(studentModel, "VSA");

//         const studentData = {
//             enrollmentNumber,
//             products,
//             userId,
//             transactions: [transactionId],
//             amount: finalAmount,
//             enrollmentDate: transactionDate,
//             createdBy: email,
//             updatedBy: email,
//             createrRole: roleName,
//             updaterRole: roleName,
//         };
//         const studentResult = await studentModel.create([studentData], { session });
//         if (!studentResult) {
//             throw new Error("Student registration failed");
//         }
//         await session.commitTransaction();
//         session.endSession();

//         response
//             .status(StatusCodes.CREATED)
//             .json({ message: "Student Enrolled Successfully ..!" });
//     } catch (error) {
//         await userModel.deleteOne({ email: request.body.email });
//         deleteFile(uploadedFilePath);
//         console.error("Error registering lead as user: ", error);
//         return response
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({ error: "Something went wrong, please try again." });
//     }
// };
