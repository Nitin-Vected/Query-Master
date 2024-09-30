import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  enrollmentNumber: string;
  userId: string;
  coursesEnrolled: [string];
  transactions: [string];
  fees: string;
  discount: number;
  enrollmentDate: string;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updaterRole: string;
}

const StudentSchema: mongoose.Schema = new Schema(
  {
    enrollmentNumber: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    coursesEnrolled: [
      {
        type: String,
        ref: "Course",
        required: true,
      },
    ],
    transactions: [
      {
        type: String,
        ref: "Transaction",
      },
    ],
    fees: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    enrollmentDate: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
    creatorRole: {
      type: String,
      required: true,
    },
    updaterRole: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IStudent>("Student", StudentSchema, "student");
