import mongoose, { Schema, Document } from "mongoose";

export interface IRoleMaster extends Document {
  userId: string;
  roleId: string;
  permissions: [string];
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
  isActive: boolean;
}

const accessRightsSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "user", required: true },
    roleId: { type: String, ref: "roleMaster", required: true },
    permissions: [String],
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    createrRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("accessRights", accessRightsSchema);
