import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { StudentAttendanceController } from './studentAttendance.controller';
import { StudentAttendanceService } from './studentAttendance.service';
import { AttendanceSchema } from './schemas/attendance.schema';
import { LectureSchema } from '../lectureData/schemas/lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'Lecture', schema: LectureSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [StudentAttendanceController],
  providers: [StudentAttendanceService],
  exports: [StudentAttendanceService],
})
export class StudentAttendanceModule {}
