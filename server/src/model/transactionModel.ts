import mongoose, { Schema, Document } from "mongoose";

interface Transaction extends Document {
  transactionId: string;
  paymentMode: string;
  paymentType: string;
  transactionDate: Date;
  transactionAmount: number;
  transactionProof?: string;
  emiDetails?: {
    emiCount: number;
    installments: Array<{
      dueDate: Date;
      paymentDate?: Date;
      amount: number;
      status: string;
    }>;
  };
}

// Sub-schema for EMI details
const InstallmentSchema = new Schema(
  {
    dueDate: {
      type: Date,
      required: true,
    },
    paymentDate: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  { _id: false }
);

const TransactionSchema = new Schema<Transaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["Full", "EMI"],
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
    emiDetails: {
      emiCount: {
        type: Number,
        required: function () {
          return this.type === "EMI";
        },
      },
      installments: [InstallmentSchema],
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<Transaction>("Transaction", TransactionSchema);
