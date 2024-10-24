import { Schema, model, Document } from "mongoose";

interface Channel extends Document {
  id: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
  isActive: boolean;
}

const channelSchema = new Schema<Channel>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    createrRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default model<Channel>("channelMaster", channelSchema, "channelMaster");
