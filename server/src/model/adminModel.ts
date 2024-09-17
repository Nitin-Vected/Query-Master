import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    profileImg: string,
    role: string
    status: string
}

const AdminSchema: mongoose.Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    contactNumber: {
        type: String,
        default: "",
    },
    profileImg: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'supportAdmin',
        required: true,
    },
    status: {
        type: String,
        required: true,
    },

}, { versionKey: false, timestamps: true });

export default mongoose.model<IAdmin>('supportAdmin', AdminSchema, 'supportAdmin');
