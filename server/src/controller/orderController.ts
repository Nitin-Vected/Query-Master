import orderModel from "../model/orderModel";
import { generateUniqueId, Messages, StatusCodes } from "../config";
import mongoose from "mongoose";
import { Request, Response } from "express";

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
    throw new Error("Order " + Messages.CREATION_FAILED);
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
    throw new Error("Order " + Messages.UPDATION_FAILED);
  }

  return updatedOrder;
};

export const getOrderByIdController = async (request: Request, response: Response) => {
  const { orderId } = request.params;
  try {
    const order = await orderModel.findOne({ id: orderId })
      .select("-_id id transactions dueAmount amount dueDate products");
    if (!order) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order " + Messages.THIS_NOT_FOUND });
    }
    return response
      .status(StatusCodes.OK)
      .json({ data: order, message: "Order " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occured in getOrderById : ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
}

export const getAllOrdersController = async (request: Request, response: Response) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit;

  try {
    const orderList = await orderModel
      .find()
      .select("-_id id transactions dueAmount amount dueDate products")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit || 0);

    const totalOrders = await orderModel.countDocuments();

    const totalPages = limit ? Math.ceil(totalOrders / limit) : 1;

    if (orderList && orderList.length > 0) {
      response.status(StatusCodes.OK).json({
        orderList: orderList,
        totalPages: totalPages, 
        message: "Orders " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Orders " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in getAllOrdersController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};
