import mongoose, { Schema, Document } from "mongoose";

interface Courses {
    courseId: string;
}

interface Order extends Document {
    orderId: string;
    userId: string;
    coursesPurchased: Courses[];
    finalAmount: number;
    discount: number;
    transactionId: string;
    createdBy: string,
    updatedBy: string,
    creatorRole: string,
    updaterRole: string
}

const CoursesPurchasedSchema: Schema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        ref: "Course"
    },
});

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
        coursesPurchased: [CoursesPurchasedSchema],
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
