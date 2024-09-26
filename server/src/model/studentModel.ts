import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  enrollmentNumber: string;
  userId: string;
  batchId: string;
  courseId: string;
  queryId: string;
  transactions: [string];
  fees: string;
  discount: number;
  enrollmentDate: string;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updatorRole: string;
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
    batchId: {
      type: String,
      ref: "batch",
      required: true,
    },
    courseId: {
      type: String,
      ref: "course",
      required: true,
    },
    queryId: {
      type: String,
      ref: "querylists",
      required: true,
    },
    transactions: [
      {
        type: String,
        ref: "transactions",
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
    updatorRole: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IStudent>("Student", StudentSchema, "student");
