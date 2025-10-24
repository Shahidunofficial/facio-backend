import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { LectureDataController } from './lectureData.controller';
import { LectureDataService } from './lectureData.service';
import { LectureSchema } from './schemas/lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lecture', schema: LectureSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [LectureDataController],
  providers: [LectureDataService],
  exports: [LectureDataService],
})
export class LectureDataModule {}
