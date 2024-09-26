import mongoose, { Schema, Document } from 'mongoose';

// Batch interface extending mongoose Document
interface Batch extends Document {
    batchId: string;
    courseId: string;
    trainerId: string;
    batchName: string;
    startDate: string;
    endDate: string;
    creatorRole: string;
    updatorRole: string;
    createdBy: string;
    updatedBy: string;
}

//Batch Schema
const batchSchema: Schema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    trainerId: {
        type: String,
        required: true
    },
    batchName: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    creatorRole: {
        type: String,
        required: true
    },
    updatorRole: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
}, { versionKey: false, timestamps: true });

export default mongoose.model<Batch>('batch', batchSchema);