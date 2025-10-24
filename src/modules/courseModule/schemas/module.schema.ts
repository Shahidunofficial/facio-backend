import { Schema } from 'mongoose';

export const ModuleSchema = new Schema({
  moduleCode: { type: String, required: true, unique: true },
  moduleName: { type: String, required: true },
  semester: { type: String, required: true },
  lectureHall: { type: String, required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  startTime: { type: String, required: true }, // Format: "HH:mm"
  endTime: { type: String, required: true }, // Format: "HH:mm"
  lecturerId: { type: Schema.Types.ObjectId, ref: 'Lecturer', required: true },
  description: { type: String },
  credits: { type: Number },
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ModuleSchema.index({ moduleCode: 1, semester: 1 });

