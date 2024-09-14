import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  profileImg: string,
  role: string
  status: string
}

const UserSchema: mongoose.Schema = new Schema({
  userName: {
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
    default: 'Student',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },

}, { versionKey: false, timestamps: true });

export default mongoose.model<IUser>('user', UserSchema, 'user');
