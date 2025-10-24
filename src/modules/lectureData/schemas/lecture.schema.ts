import { Schema } from 'mongoose';

export const LectureSchema = new Schema({
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  conductedLectureNumber: { type: Number, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  lectureHall: { type: String, required: true },
  lecturerId: { type: Schema.Types.ObjectId, ref: 'Lecturer', required: true },
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' },
  attendanceMarked: { type: Boolean, default: false },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

LectureSchema.index({ moduleId: 1, conductedLectureNumber: 1 }, { unique: true });
