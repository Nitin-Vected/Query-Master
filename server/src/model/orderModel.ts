import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
  id: string;
  userId: string;
  transactions: string[];
  products: string[];
  amount: number;
  dueAmount: number;
  dueDate: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<Order>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
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
    amount: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    transactions: {
      type: [String],
      ref: "Transaction",
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
    createrRole: {
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

export default mongoose.model<Order>("Order", OrderSchema, "orders");
