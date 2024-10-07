import { Schema, model, Document } from "mongoose";

interface Product extends Document {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number;
  description: string;
  assets: {
    image: string;
    document: string;
  };
  createdBy: string;
  updatedBy: string;
  createrRole: string;
  updaterRole: string;
  isActive: boolean;
}

const productSchema = new Schema<Product>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    assets: {
      image: { type: String },
      document: { type: String },
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    createrRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default model<Product>("Product", productSchema);
