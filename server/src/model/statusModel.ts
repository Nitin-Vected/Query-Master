import { Schema, model, Document } from "mongoose";

interface Status extends Document {
  statusId: string;
  statusName: string;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updaterRole: string;
}

const statusSchema = new Schema<Status>(
  {
    statusId: { type: String, required: true, unique: true },
    statusName: { type: String, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    creatorRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default model<Status>("Status", statusSchema);
