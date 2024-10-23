import {
  CustomRequest,
  Messages,
  STATUS_ENROLLED,
  StatusCodes,
  generateUniqueId,
} from "../config";
import { Request, Response } from "express";
import leadModel from "../model/leadModel";
import userModel from "../model/userModel";
import { deleteFile } from "../utilities/deleteUploadedFile";
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
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }
    const { email, roleName } = request.payload;
    const leads = Array.isArray(request.body) ? request.body : [request.body];

    const result = [];
    for (const leadData of leads) {
      const {
        fullName,
        leadEmail,
        contactNumber,
        productAmount,
        discount,
        channelId,
        statusId,
        productId,
        description,
      } = leadData;
      const [firstName, lastName] = fullName.split(" ")
      let existingLead = await leadModel.findOne({ email: leadEmail });

      if (existingLead) {
        if (existingLead.productId === productId) {
          return response.status(StatusCodes.ALREADY_EXIST).json({
            message: "Product " + Messages.ALREADY_EXIST,
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
      .json({ data: result, message: "Lead " + Messages.CREATED_SUCCESSFULLY });
  } catch (error) {
    console.error("Error occurred in addNewLeadController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getAllLeadsController = async (
  request: Request,
  response: Response
) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit

  try {
    const leadAggregation: any[] = [
      {
        $lookup: {
          from: "statusMaster",
          localField: "statusId",
          foreignField: "id",
          as: "statusDetail",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "id",
          as: "productDetail",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "id",
          as: "assignedCounsellor",
        },
      },
      {
        $lookup: {
          from: "channelMaster",
          localField: "channelId",
          foreignField: "id",
          as: "channelDetail",
        },
      },
      {
        $unwind: "$statusDetail",
      },
      {
        $unwind: "$productDetail",
      },
      {
        $unwind: "$channelDetail",
      },
      {
        $unwind: {
          path: "$assignedCounsellor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          fullName: {
            $concat: [
              { $ifNull: ["$firstName", ""] },
              " ",
              { $ifNull: ["$lastName", ""] },
            ],
          },
          email: 1,
          contactNumber: 1,
          productAmount: 1,
          discount: 1,
          auditLogs: 1,
          comments: 1,
          channel: "$channelDetail.name",
          status: "$statusDetail.name",
          product: "$productDetail.name",
          description: 1,
          assignedTo: {
            $cond: {
              if: { $ifNull: ["$assignedCounsellor", false] },
              then: {
                $concat: [
                  { $ifNull: ["$assignedCounsellor.firstName", ""] },
                  " ",
                  { $ifNull: ["$assignedCounsellor.lastName", ""] },
                ],
              },
              else: "Unassigned",
            },
          },
        },
      },
      { $sort: { id: -1 } },
      { $skip: skip },
    ];
    if (limit > 0) {
      leadAggregation.push({ $limit: limit });
    }
    const leads = await leadModel.aggregate(leadAggregation);
    const totalLeads = await leadModel.countDocuments();

    const totalPages = limit ? Math.ceil(totalLeads / limit) : 1;

    if (leads && leads.length > 0) {
      response.status(StatusCodes.OK).json({
        leads: leads,
        totalPages: totalPages,
        message: "Leads " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ leads: null, message: "Leads " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in getAllLeads: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getLeadByIdController = async (
  request: Request,
  response: Response
) => {
  try {
    const { leadId } = request.params;
    const lead = await leadModel.aggregate([
      {
        $match: { id: leadId },
      },
      {
        $lookup: {
          from: "statusMaster",
          localField: "statusId",
          foreignField: "id",
          as: "statusDetail",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "id",
          as: "productDetail",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "id",
          as: "assignedCounsellor",
        },
      },
      {
        $lookup: {
          from: "channelMaster",
          localField: "channelId",
          foreignField: "id",
          as: "channelDetail",
        },
      },
      {
        $unwind: "$statusDetail",
      },
      {
        $unwind: "$productDetail",
      },
      {
        $unwind: {
          path: "$channelDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$assignedCounsellor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          fullName: {
            $concat: [
              { $ifNull: ["$firstName", ""] },
              " ",
              { $ifNull: ["$lastName", ""] },
            ],
          },
          email: 1,
          contactNumber: 1,
          productAmount: 1,
          discount: 1,
          description: 1,
          auditLogs: 1,
          comments: 1,
          status: "$statusDetail.name",
          product: "$productDetail.name",
          channel: "$channelDetail.name",
          assignedTo: {
            $cond: {
              if: { $ifNull: ["$assignedCounsellor", false] },
              then: {
                $concat: [
                  { $ifNull: ["$assignedCounsellor.firstName", ""] },
                  " ",
                  { $ifNull: ["$assignedCounsellor.lastName", ""] },
                ],
              },
              else: "Unassigned",
            },
          },
        },
      },
    ]);

    if (!lead || lead.length === 0) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead " + Messages.THIS_NOT_FOUND });
    }

    response
      .status(StatusCodes.OK)
      .json({
        data: lead[0],
        message: "Lead " + Messages.FETCHED_SUCCESSFULLY,
      });
  } catch (error) {
    console.log("Error occurred in getLeadById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
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
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }

    const {
      fullName,
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
    console.log("request.body", request.body);

    const existingLead = await leadModel.findOne({ id: leadId });

    if (!existingLead) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead " + Messages.THIS_NOT_FOUND });
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

    if (fullName) {
      const [firstName, lastName] = fullName.split(" ");

      if (firstName && firstName !== existingLead.firstName) {
        addAuditLog("firstName", existingLead.firstName, firstName);
        existingLead.firstName = firstName;
      }

      if (lastName && lastName !== existingLead.lastName) {
        addAuditLog("lastName", existingLead.lastName, lastName);
        existingLead.lastName = lastName;
      }
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
    console.log(existingLead);

    return response
      .status(StatusCodes.OK)
      .json({
        message: "Lead " + Messages.UPDATED_SUCCESSFULLY,
        lead: existingLead,
      });
  } catch (error) {
    console.error("Error occurred in updateLeadController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const enrollLeadController = async (
  request: CustomRequest,
  response: Response
) => {
  if (!request.payload) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
  }
  const { email, roleName } = request.payload;
  const { leadEmail, contactNumber } = request.body;
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const existingLead = await userModel.findOne({
      $or: [{ email: leadEmail }, { contactNumber }],
    });

    if (existingLead) {
      return response
        .status(StatusCodes.ALREADY_EXIST)
        .json({ message: "Lead " + Messages.ALREADY_EXIST });
    }

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
    // const result = await leadModel.updateOne(
    //   { email: leadEmail }, // Filter by document's unique identifier
    //   { $set: { statusId: STATUS_ENROLLED } } // Use $set to update only the specified field
    // );

    await session.commitTransaction();
    session.endSession();

    return response
      .status(StatusCodes.CREATED)
      .json({ message: "Student " + Messages.REGISTERED_SUCCESSFULLY });
  } catch (error) {
    if (request.file?.path) {
      deleteFile(request.file.path);
    }

    await session?.abortTransaction();
    session?.endSession();

    console.error("Error during enrollment: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};
