import { Request, Response } from "express";
import transactionModel from "../model/transactionModel";
import { CustomRequest, generateUniqueId, Messages, StatusCodes } from "../config";
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
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }

    const { email, roleName } = request.payload;
    const { paymentMode, transactionDate, transactionAmount, orderId } =
      request.body;

    if (!paymentMode || !transactionDate || !transactionAmount || !orderId) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: Messages.MISSING_REQUIRED_FIELD + "Transaction" });
    }

    const order = await orderModel.findOne({ id: orderId });
    if (!order) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found." });
    }

    const dueAmount = order.dueAmount;

    if (transactionAmount > dueAmount) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        error: "Transaction amount exceeds the due amount.",
      });
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
        .json({ error: "Transaction " + Messages.CREATION_FAILED });
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { id: orderId },
      {
        $set: { dueAmount: dueAmount - transactionAmount },
        $push: { transactions: transactionId },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order " + Messages.THIS_NOT_FOUND });
    }

    return response
      .status(StatusCodes.CREATED)
      .json({ transactionId, message: "Transaction " + Messages.CREATED_SUCCESSFULLY });
  } catch (error: unknown) {
    console.log("Error occurred in createTransactionController: ", error);
    if (error instanceof Error) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.SOMETHING_WENT_WRONG });
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
    throw new Error("Transaction " + Messages.CREATION_FAILED);
  }

  console.log("transaction created successfully -----");
  return transactionId;
};

export const getTransactionByIdController = async (request: Request, response: Response) => {
  const { transactionId } = request.params;
  try {
    const transaction = await transactionModel.findOne({ id: transactionId })
      .select("-_id id orderId amount date proof");
    if (!transaction) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Transaction " + Messages.THIS_NOT_FOUND });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: transaction, message: "Transaction " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occured in getTransactionById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
}

export const getAllTransactionsController = async (request: Request, response: Response) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit

  try {
    const transactionList = await transactionModel
      .find()
      .select("-_id id orderId amount date proof mode")
      .sort({ id: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await transactionModel.countDocuments();

    const totalPages = limit ? Math.ceil(totalTransactions / limit) : 1;

    if (transactionList && transactionList.length > 0) {
      response.status(StatusCodes.OK).json({
        transactionList,
        totalPages,
        message: "Transactions " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Transactions " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in getAllTransactionsController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};