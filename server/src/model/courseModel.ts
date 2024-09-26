import { Schema, model, Document } from "mongoose";

interface Course extends Document {
  courseId: string;
  courseName: string;
  courseCategory: string;
  courseFees: number;
  courseDescription: string;
  createdBy: string;
  updatedBy: string;
  creatorRole: string;
  updaterRole: string;
}

const courseSchema = new Schema<Course>(
  {
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    courseCategory: { type: String, required: true },
    courseFees: { type: Number, required: true, min: 0 },
    courseDescription: { type: String, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    creatorRole: { type: String, required: true },
    updaterRole: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default model<Course>("Course", courseSchema);
