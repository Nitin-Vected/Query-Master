import orderModel from "../model/orderModel";
import { generateUniqueId } from "../config";
import mongoose from "mongoose";

// For orchestration
export const createOrder = async (
  data: any,
  session: mongoose.ClientSession
) => {
  const { userId, products, finalAmount, dueDate, dueAmount, email, roleName } =
    data;

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
