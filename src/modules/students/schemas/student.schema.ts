import { Schema } from 'mongoose';

export const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
