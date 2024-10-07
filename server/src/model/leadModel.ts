import { Schema, model, Document } from "mongoose";

interface Comment extends Document {
  comment: string;
  commentedBy: string;
  commentedAt: string;
}

interface Audit extends Document {
  field: string;
  oldValue: string;
  newValue: string;
  editedBy: string;
  editorRole: string;
  editedAt: string;
}

interface Lead extends Document {
  id: string;
  firstName: string;
  lastName: string;
  contactNumber: number;
  email: string;
  discount?: number;
  channelId: string;
  statusId: string;
  assignedTo: string;
  description: string;
  productId: string;
  productAmount?: number;
  auditLogs: Audit[];
  comments: Comment[];
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
}

const auditSchema = new Schema<Audit>({
  field: { type: String, required: true },
  oldValue: { type: String, required: true },
  newValue: { type: String, required: true },
  editedBy: { type: String, required: true },
  editorRole: { type: String, required: true },
  editedAt: { type: String, required: true },
});

const commentSchema = new Schema<Comment>({
  comment: { type: String, required: true },
  commentedBy: { type: String, required: true },
  commentedAt: { type: String, required: true },
});

const leadSchema = new Schema<Lead>(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: Number, required: true },
    email: { type: String, required: true, lowercase: true },
    productId: { type: String, required: true, ref: "Product" },
    assignedTo: { type: String, required: true },
    auditLogs: [auditSchema],
    comments: [commentSchema],
    productAmount: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 15 },
    description: { type: String, required: true },
    channelId: { type: String, ref: "channelMaster" },
    statusId: { type: String, required: true, ref: "Status" },
    isActive: { type: Boolean, required: true },
    createdBy: { type: String, ref: "user", required: true },
    createrRole: { type: String, required: true },
    updatedBy: { type: String, ref: "user", required: true },
    updaterRole: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default model<Lead>("Lead", leadSchema, "leads");
