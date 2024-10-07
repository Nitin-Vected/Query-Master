import mongoose, { Schema, Document } from "mongoose";

export interface Student extends Document {
  enrollmentNumber: string;
  userId: string;
  products: string[];
  transactions: string[];
  amount: number;
  enrollmentDate: Date;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updatorRole: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<Student>(
  {
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    products: {
      type: [String],
      ref: "Product",
      required: true,
    },
    transactions: {
      type: [String],
      ref: "Transaction",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    enrollmentDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
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

export default mongoose.model<Student>("Student", StudentSchema, "students");
