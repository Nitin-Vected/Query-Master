import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
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
