import mongoose, { Schema, Document } from "mongoose";

interface Students {
  enrollmentNumber: string;
}

interface Batch extends Document {
  batchId: string;
  courseId: string;
  trainerId: string;
  batchName: string;
  students: Students[];
  startDate: string;
  endDate: string;
  creatorRole: string;
  updaterRole: string;
  createdBy: string;
  updatedBy: string;
}

const StudentsSchema: Schema = new mongoose.Schema({
  enrollmentNumber: {
    type: String,
    required: true,
  },
});

const BatchSchema: Schema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true
    },
    courseId: {
      type: String,
      ref: "Course",
    },
    trainerId: {
      type: String,
      ref: "Employee",
    },
    batchName: {
      type: String,
      required: true,
    },
    students: [StudentsSchema],
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
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
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<Batch>("batch", BatchSchema);
