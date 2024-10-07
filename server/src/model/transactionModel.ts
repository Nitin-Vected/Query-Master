import mongoose, { Schema, Document } from "mongoose";

interface Transaction extends Document {
  id: string;
  amount: number;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
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
    amount: {
      type: Number,
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
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<Transaction>("Transaction", TransactionSchema);
