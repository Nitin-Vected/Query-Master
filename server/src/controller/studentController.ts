import { Request, Response } from "express";
import studentModel from "../model/studentModel";
import { generateUniqueId } from "../config";
import mongoose from "mongoose";

export const enrollStudentController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      userId,
      transactionId,
      orderId,
      products,
      finalAmount,
      transactionDate,
      email,
      roleName,
    } = req.body;

    // Validate request body
    if (!userId || !transactionId || !orderId) {
      return res
        .status(400)
        .json({ error: "Missing required fields for student enrollment." });
    }

    // Generate unique enrollment number for the student
    const enrollmentNumber = await generateUniqueId(studentModel, "VSA");

    // Prepare student data for insertion
    const studentData = {
      enrollmentNumber,
      products,
      userId,
      transactions: [transactionId],
      amount: finalAmount,
      enrollmentDate: transactionDate,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    // Insert student into database
    const studentResult = await studentModel.create(studentData);

    if (!studentResult) {
      return res.status(500).json({ error: "Student enrollment failed." });
    }

    return res
      .status(201)
      .json({ enrollmentNumber, message: "Student enrolled successfully." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// For orchestration
export const enrollStudent = async (
  data: any,
  session: mongoose.ClientSession
) => {
  const {
    userId,
    transactionId,
    orderId,
    products,
    finalAmount,
    transactionDate,
    email,
    roleName,
  } = data;

  if (!userId || !transactionId || !orderId) {
    throw new Error("Missing required fields for student enrollment.");
  }

  const enrollmentNumber = await generateUniqueId(studentModel, "VSA");

  const studentData = {
    enrollmentNumber,
    products,
    userId,
    transactions: [transactionId],
    amount: finalAmount,
    enrollmentDate: transactionDate,
    createdBy: email,
    updatedBy: email,
    createrRole: roleName,
    updaterRole: roleName,
  };

  const studentResult = await studentModel.create([studentData], { session });

  if (!studentResult) {
    throw new Error("Student enrollment failed.");
  }

  console.log("student created successfully -----");
  return enrollmentNumber;
};
