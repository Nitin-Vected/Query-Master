import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  profileImg: string;
  roleId: string;
  status: string;
}

const UserSchema: mongoose.Schema = new Schema(
  {
    userId: {
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
    status: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema, "user");
