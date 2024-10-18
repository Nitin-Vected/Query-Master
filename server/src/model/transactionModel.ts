import mongoose, { Schema, Document } from "mongoose";

interface Transaction extends Document {
  id: string;
  orderId: string;
  amount: number;
  date: string;
  mode: string;
  proof: string;
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
  isActive: boolean;
}

const TransactionSchema = new Schema<Transaction>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
      ref:"Order"
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    proof: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.model<Transaction>("Transaction", TransactionSchema);
