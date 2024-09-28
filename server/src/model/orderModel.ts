import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
    orderId: string;
    userId: string;
    coursesPurchased: string;
    finalAmount: number;
    discount: number;
    transactionId: string;
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
                ref: "course",
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
    },
    { versionKey: false, timestamps: true }
);

export default mongoose.model<Order>("Orders", OrderSchema);
