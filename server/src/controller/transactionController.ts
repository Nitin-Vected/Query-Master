import { Response } from "express";
import transactionModel from "../model/transactionModel";
import { CustomRequest, generateUniqueId, StatusCodes } from "../config";
import mongoose from "mongoose";
import orderModel from "../model/orderModel";

export const createTransactionController = async (
  request: CustomRequest,
  response: Response
): Promise<Response> => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }

    const { email, roleName } = request.payload;
    const { paymentMode, transactionDate, transactionAmount, orderId } =
      request.body;

    if (!paymentMode || !transactionDate || !transactionAmount || !orderId) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing required fields for transaction creation." });
    }

    const transactionId = await generateUniqueId(
      transactionModel,
      "TRANSACTION"
    );

    const transactionData = {
      id: transactionId,
      orderId,
      amount: transactionAmount,
      date: transactionDate,
      mode: paymentMode,
      proof: request.file?.path || "",
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const newTransaction = await transactionModel.create(transactionData);

    if (!newTransaction) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Transaction creation failed." });
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { id: orderId },
      { $push: { transactions: transactionId } },
      { new: true }
    );

    if (!updatedOrder) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found or failed to update." });
    }

    return response
      .status(StatusCodes.CREATED)
      .json({ transactionId, message: "Transaction created successfully." });
  } catch (error: unknown) {
    console.log("Error occurred in createTransactionController: ", error);
    if (error instanceof Error) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An unexpected error occurred." });
  }
};

// For orchestration
export const createTransaction = async (
  data: any,
  orderId: string,
  session: mongoose.ClientSession
) => {
  const { paymentMode, transactionDate, transactionAmount, email, roleName } =
    data;

  const transactionId = await generateUniqueId(transactionModel, "TRANSACTION");

  const transactionData = {
    id: transactionId,
    orderId,
    mode: paymentMode,
    date: transactionDate,
    amount: transactionAmount,
    proof: data.file?.path || "",
    createdBy: email,
    updatedBy: email,
    createrRole: roleName,
    updaterRole: roleName,
  };

  const newTransaction = await transactionModel.create([transactionData], {
    session,
  });

  if (!newTransaction) {
    throw new Error("Transaction creation failed.");
  }

  console.log("transaction created successfully -----");
  return transactionId;
};
