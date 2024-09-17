import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string;
  role: 'Student' | 'SupportAdmin';
  status: string;
}

const UserSchema: mongoose.Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  contactNumber: {
    type: String,
    default: "",
  },
  profileImg: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'SupportAdmin'], 
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, { versionKey: false, timestamps: true });

export default mongoose.model<IUser>('User', UserSchema, 'user');
