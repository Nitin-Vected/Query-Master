import mongoose, { Schema, Document } from 'mongoose';

// Conversation interface
interface Conversation {
  sender: string;
  message: string;
  timestamp: Date;
  role: string;
}

// Query interface extending mongoose Document
interface Query extends Document {
  userEmail: string;
  subject: string;
  message: string;
  status: string;
  userRole: string;
  conversation: Conversation[];
}

// Conversation Schema
const ConversationSchema: Schema = new Schema({
  sender: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  role: { 
    type: String, 
    required: true 
  }
});

// Query Schema
const QuerySchema: Schema = new Schema({
  userEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Open'
  },
  userRole: {
    type: String,
    required: true
  },
  conversation: [ConversationSchema]
}, { versionKey: false, timestamps: true });

export default mongoose.model<Query>('QueryList', QuerySchema);

