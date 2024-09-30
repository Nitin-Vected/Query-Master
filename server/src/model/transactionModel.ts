import mongoose, { Schema, Document } from "mongoose";

interface Transaction extends Document {
  transactionId: string;
  userId: string;
  paymentMode: string;
  paymentType: string;
  transactionDate: Date;
  transactionAmount: number;
  transactionProof?: string;
  createdBy: string,
  updatedBy: string,
  creatorRole: string,
  updaterRole: string
}

// Sub-schema for EMI details


const TransactionSchema = new Schema<Transaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["OneTime Payment", "EMI"],
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    transactionProof: {
      type: String, // URL for the proof of transaction
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

export default mongoose.model<Transaction>("Transaction", TransactionSchema);
