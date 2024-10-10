import { Request, Response } from "express";
import orderModel from "../model/orderModel";
import { generateUniqueId } from "../config";
import mongoose from "mongoose";

export const createOrderController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      userId,
      transactionId,
      products,
      finalAmount,
      dueDate,
      dueAmount,
      email,
      roleName,
    } = req.body;

    // Validate request body
    if (!userId || !transactionId || !products || !finalAmount) {
      return res
        .status(400)
        .json({ error: "Missing required fields for order creation." });
    }

    // Generate unique ID for the order
    const orderId = await generateUniqueId(orderModel, "ORDER");

    // Prepare order data for insertion
    const orderData = {
      id: orderId,
      userId,
      transactions: [transactionId],
      products,
      amount: finalAmount,
      dueAmount,
      dueDate,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    // Insert order into database
    const newOrder = await orderModel.create(orderData);

    if (!newOrder) {
      return res.status(500).json({ error: "Order creation failed." });
    }

    return res
      .status(201)
      .json({ orderId, message: "Order created successfully." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// For orchestration
export const createOrder = async (
  data: any,
  session: mongoose.ClientSession
) => {
  const { userId, products, finalAmount, dueDate, dueAmount, email, roleName } =
    data;
  
  if (!userId || !products || !finalAmount) {
    throw new Error("Missing required fields for order creation.");
  }

  const orderId = await generateUniqueId(orderModel, "ORDER");

  const orderData = {
    id: orderId,
    userId,
    products,
    amount: finalAmount,
    dueAmount,
    dueDate,
    createdBy: email,
    updatedBy: email,
    createrRole: roleName,
    updaterRole: roleName,
  };

  const newOrder = await orderModel.create([orderData], { session });

  console.log("order created successfully -----");

  if (!newOrder) {
    throw new Error("Order creation failed.");
  }

  return orderId;
};

// For orchestration
export const updateOrderWithTransactionId = async (
  orderId: string,
  transactionId: string,
  session: mongoose.ClientSession
) => {
  const updatedOrder = await orderModel.findOneAndUpdate(
    { id: orderId },
    { $push: { transactions: transactionId } },
    { new: true, session }
  );

  if (!updatedOrder) {
    throw new Error("Order update failed.");
  }

  return updatedOrder;
};
