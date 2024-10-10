import { Request, Response } from "express";
import transactionModel from "../model/transactionModel";
import { generateUniqueId } from "../config";
import mongoose from "mongoose";

export const createTransactionController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      paymentMode,
      transactionDate,
      transactionAmount,
      orderId,
      email,
      roleName,
    } = req.body;

    // Validate request body
    if (!paymentMode || !transactionDate || !transactionAmount || !orderId) {
      return res
        .status(400)
        .json({ error: "Missing required fields for transaction creation." });
    }

    // Generate unique ID for the transaction
    const transactionId = await generateUniqueId(
      transactionModel,
      "TRANSACTION"
    );

    // Prepare transaction data for insertion
    const transactionData = {
      id: transactionId,
      orderId,
      mode: paymentMode,
      date: transactionDate,
      amount: transactionAmount,
      proof: req.file?.path || "",
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    // Insert transaction into database
    const newTransaction = await transactionModel.create(transactionData);

    if (!newTransaction) {
      return res.status(500).json({ error: "Transaction creation failed." });
    }

    return res
      .status(201)
      .json({ transactionId, message: "Transaction created successfully." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred." });
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

  if (!paymentMode || !transactionDate || !transactionAmount) {
    throw new Error("Missing required transaction fields.");
  }

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
