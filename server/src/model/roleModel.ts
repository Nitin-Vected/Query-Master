import mongoose, { Schema, Document } from "mongoose";

export interface IRoleMaster extends Document {
  roleId: string;
  roleName: string;
  access: string[];
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updaterRole: string;
}

const RoleMasterSchema: Schema = new Schema(
  {
    roleId: { type: String, required: true, unique: true },
    roleName: { type: String, required: true },
    access: { type: [String], required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    creatorRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IRoleMaster>(
  "roleMaster",
  RoleMasterSchema,
  "rolemaster"
);
