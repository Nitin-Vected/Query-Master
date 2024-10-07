import mongoose, { Schema, Document } from "mongoose";

export interface IRoleMaster extends Document {
  userId: string;
  roleId: string;
  permissions: [string];
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updaterRole: string;
  isActive: boolean
}

const accessRightsSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "user", required: true },
    roleId: { type: String, ref: "roleMaster", required: true },
    permissions: [String],
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    creatorRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
    isActive: { type: Boolean, required: true },
  },
  { versionKey: false, timestamps: true }
);

export const AccessRights = mongoose.model("accessRights", accessRightsSchema);
