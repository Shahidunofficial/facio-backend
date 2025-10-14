import { Schema } from 'mongoose';

export const LectureSchema = new Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  room: { type: String, required: true },
  instructor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
