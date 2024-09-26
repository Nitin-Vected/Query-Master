import { Schema, model, Document } from "mongoose";

interface CourseApplication {
  courseId: string;
  statusId: string;
  appliedAt: Date;
}

const courseApplicationSchema = new Schema<CourseApplication>(
  {
    courseId: { type: String, required: true, ref: "Course" },
    statusId: { type: String, required: true, ref: "Status" },
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

interface Lead extends Document {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  feesAmount?: number;
  discount?: number;
  channel?: string;
  createdAt: Date;
  createdBy: string;
  createrRole: string;
  updatedAt?: Date;
  updatedBy?: string;
  updaterRole?: string;
  courseApplications: CourseApplication[];
}

const leadSchema = new Schema<Lead>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, default: "" },
    email: { type: String, required: true },
    feesAmount: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 15 },
    channel: { type: String },
    createdBy: { type: String, ref: "User", required: true },
    createrRole: { type: String, required: true },
    updatedBy: { type: String, ref: "User" },
    updaterRole: { type: String },
    courseApplications: [courseApplicationSchema],
  },
  { timestamps: true }
);

export default model<Lead>("Lead", leadSchema);
