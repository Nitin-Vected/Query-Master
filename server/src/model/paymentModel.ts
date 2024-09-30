import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
    paymentId: string;
    orderId: string;
    emiDetails?: {
        emiCount: number;
        installments: Array<{
            dueDate: Date;
            paymentDate?: Date;
            amount: number;
            status: string;
        }>;
    };
    createdBy: string,
    updatedBy: string,
    creatorRole: string,
    updaterRole: string
}

const InstallmentSchema = new Schema(
    {
        dueDate: {
            type: Date,
            required: true,
        },
        paymentDate: {
            type: Date,
            default: ''
        },
        transactionAmount: {
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

const PaymentSchema = new Schema<Order>(
    {
        paymentId: {
            type: String,
            required: true,
            unique: true,
        },
        orderId: {
            type: String,
            ref: "Order",
            required: true,
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

export default mongoose.model<Order>("Payments", PaymentSchema);
