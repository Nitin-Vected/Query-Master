import { Schema, model, Document } from "mongoose";

interface Courses {
  courseId: string;
  appliedAt: Date;
}

interface Lead extends Document {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  finalAmount?: number;
  discount?: number;
  channel?: string;
  createdAt: Date;
  createdBy: string;
  creatorRole: string;
  updatedAt?: Date;
  updatedBy?: string;
  updaterRole?: string;
  statusId: string;
  courses: Courses[];
}

const leadSchema = new Schema<Lead>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, default: "" },
    email: { type: String, required: true },
    finalAmount: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 15 },
    channel: { type: String },
    createdBy: { type: String, ref: "user", required: true },
    creatorRole: { type: String, required: true },
    updatedBy: { type: String, ref: "user" },
    updaterRole: { type: String },
    statusId: { type: String, required: true, ref: "Status" },
    courses: [
      {
        type: String,
        ref: "Course",
        required: true,
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export default model<Lead>("Lead", leadSchema);
