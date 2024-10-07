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
    createdBy: string,
    updatedBy: string,
    creatorRole: string,
    updatorRole: string,
    createdAt: string;
    updatedAt: string;
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
            required: true
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

export default mongoose.model<Order>("Order", OrderSchema, "orders");