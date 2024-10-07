import { Schema, model, Document } from "mongoose";

interface Status extends Document {
  id: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updaterRole: string;
  isActive: boolean;
}

const statusSchema = new Schema<Status>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    creatorRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
    isActive: {type:Boolean, required: true}
  },
  { versionKey: false, timestamps: true }
);

export default model<Status>("statusMaster", statusSchema, "statusMaster");
