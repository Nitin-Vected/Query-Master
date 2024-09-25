import { Schema, model, Document } from "mongoose";

interface Course extends Document {
  courseId: string;
  courseName: string;
  courseCategory: string;
  courseFees: number;
  courseDescription: string;
}

const courseSchema = new Schema<Course>({
  courseId: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  courseCategory: { type: String, required: true },
  courseFees: { type: Number, required: true, min: 0 },
  courseDescription: { type: String, required: true },
});

export default model<Course>("Course", courseSchema);
