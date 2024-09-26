import mongoose from "mongoose";
import { CONNECTION_STRING } from "../config";

export const connectDB = async (): Promise<void> => {
  try {
    const result = await mongoose.connect(CONNECTION_STRING);
    if (result) {
      console.log("Database connection successful");
    }
  } catch (error) {
    console.error("Error while connecting with Database ..!", error);
  }
};
