import { Schema, model, Document } from 'mongoose';

interface Status extends Document {
  statusName: string;
}

const statusSchema = new Schema<Status>({
  statusName: { type: String, required: true },
});

export default model<Status>('Status', statusSchema);
