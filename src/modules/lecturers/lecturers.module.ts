import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { LecturersController } from './lecturers.controller';
import { LecturersService } from './lecturers.service';
import { LecturerSchema } from './schemas/lecturer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lecturer', schema: LecturerSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [LecturersController],
  providers: [LecturersService],
  exports: [LecturersService],
})
export class LecturersModule {}

