import mongoose, { Schema, Document } from "mongoose";

export interface IRoleMaster extends Document {
  id: string;
  name: string;
  access: string[];
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
  isActive: boolean;
}

const RoleMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    access: { type: [String], required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    createrRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
    isActive: { type: Boolean, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IRoleMaster>(
  "roleMaster",
  RoleMasterSchema,
  "roleMaster"
);
