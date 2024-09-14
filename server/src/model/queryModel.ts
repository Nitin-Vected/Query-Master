import mongoose, { Schema, Document } from 'mongoose';

export interface IQuery extends Document {
    userName: string;
    userEmail: string;
    userContactNumber: string,
    subject: string;
    message: string;
    adminResponse: string;
    respondedAt: string
    status: string

}

const QuerySchema: mongoose.Schema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
    },
    userContactNumber: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    adminResponse: {
        type: String,
        default: "",
    },
    respondedAt: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "Pending",
        required: true,
    }

}, { versionKey: false, timestamps: true });

export default mongoose.model<IQuery>('queries', QuerySchema, 'queries');
