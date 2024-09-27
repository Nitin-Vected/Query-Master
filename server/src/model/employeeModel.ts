import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  employeeId: string;
  userId: string;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updatorRole: string;
}

const EmployeeSchema: mongoose.Schema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      ref: "user",
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
    updatorRole: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IEmployee>(
  "Employee",
  EmployeeSchema,
  "employees"
);
