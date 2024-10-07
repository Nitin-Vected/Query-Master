import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  profileImg: string;
  roleId: string;
  statusId: string;
  isActive: boolean;
  createdBy: string,
  updatedBy: string,
  creatorRole: string,
  updatorRole: string,
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema<User>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
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
      default: "",
    },
    roleId: {
      type: String,
      required: true,
      ref: "roleMaster",
    },
    statusId: {
      type: String,
      required: true,
      ref: "Status"
    },
    isActive: {
      type: Boolean,
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

export default mongoose.model<User>("User", UserSchema, "users");
