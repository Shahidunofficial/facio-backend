import { Schema } from 'mongoose';

export const AttendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'Student' },
  moduleId: { type: Schema.Types.ObjectId, required: true, ref: 'Module' },
  lectureId: { type: Schema.Types.ObjectId, required: true, ref: 'Lecture' },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  method: { type: String, enum: ['face_recognition', 'bluetooth_beacon', 'manual'], required: true },
  timestamp: { type: Date, default: Date.now },
  location: { type: String },
  notes: { type: String },
  markedBy: { type: Schema.Types.ObjectId, ref: 'Lecturer' },
  verificationData: { type: Schema.Types.Mixed }, // For storing face recognition data, etc.
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AttendanceSchema.index({ studentId: 1, lectureId: 1 }, { unique: true });
AttendanceSchema.index({ moduleId: 1, timestamp: -1 });
