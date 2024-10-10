import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  roleId: string;
  status: string;
  profileImg: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
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
    roleId: {
      type: String,
      required: true,
      ref: "roleMaster",
    },
    status: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
    createrRole: {
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

export default mongoose.model<User>("User", UserSchema, "users");
