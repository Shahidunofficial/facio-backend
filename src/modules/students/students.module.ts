import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { StudentSchema } from './schemas/student.schema';
import { LectureSchema } from '../lectureData/schemas/lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Lecture', schema: LectureSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
