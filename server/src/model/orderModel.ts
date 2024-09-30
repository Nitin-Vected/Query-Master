import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
    orderId: string;
    userId: string;  // opt
    transactionId: string;
    coursesPurchased: [string];
    finalAmount: number;
    discount: number;
    createdBy: string,
    updatedBy: string,
    creatorRole: string,
    updaterRole: string
}



const OrderSchema = new Schema<Order>(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            ref: "user",
            required: true,
        },
        coursesPurchased: [
            {
                type: String,
                ref: "Course",
                required: true,
            },
        ],
        finalAmount: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        transactionId: {
            type: String,
            ref: "Transaction",
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

export default mongoose.model<Order>("Orders", OrderSchema, "orders");
