import studentModel from "../model/studentModel";
import { generateUniqueId } from "../config";
import mongoose from "mongoose";

// For orchestration
export const enrollStudent = async (
  data: any,
  session: mongoose.ClientSession
) => {
  const {
    userId,
    transactionId,
    products,
    finalAmount,
    transactionDate,
    email,
    roleName,
  } = data;

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
