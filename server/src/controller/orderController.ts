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
    const order = await orderModel.aggregate([
      {
        $match: { id: orderId }
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          transactions: 1,
          dueAmount: 1,
          amount: 1,
          dueDate: 1,
          isActive: 1,
          products: {
            $map: {
              input: "$productDetails",
              as: "product",
              in: "$$product.name",
            },
          },
        },
      },
    ]);

    if (!order || order.length === 0) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order " + Messages.THIS_NOT_FOUND });
    }

    return response
      .status(StatusCodes.OK)
      .json({ data: order[0], message: "Order " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occurred in getOrderById : ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getAllOrdersController = async (request: Request, response: Response) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit;

  try {
    const ordersAggregation: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id",
          as: "profileDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "id",
          as: "productDetails",
        },
      },
      { $unwind: "$profileDetails" },
      {
        $project: {
          _id: 0,
          id: 1,
          transactions: 1,
          dueAmount: 1,
          amount: 1,
          dueDate: 1,
          isActive: 1,
          products: {
            $map: {
              input: "$productDetails",
              as: "product",
              in: "$$product.name"
            },
          },
          userName: {
            $concat: [
              { $ifNull: ["$profileDetails.firstName", ""] },
              " ",
              { $ifNull: ["$profileDetails.lastName", ""] }
            ]
          },
          email: "$profileDetails.email",
          contactNumber: "$profileDetails.contactNumber",
        },
      },
      { $sort: { updatedAt: -1, createdAt: -1 } },
      { $skip: skip },
    ];

    if (limit > 0) {
      ordersAggregation.push({ $limit: limit })
    }
    const orders = await orderModel.aggregate(ordersAggregation);
    const totalOrders = await orderModel.countDocuments();
    const totalPages = limit ? Math.ceil(totalOrders / limit) : 1;

    if (orders && orders.length > 0) {
      response.status(StatusCodes.OK).json({
        orderList: orders,
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
