import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureDataModule } from './modules/lectureData/lectureData.module';
import { StudentAttendanceModule } from './modules/studentAttendance/studentAttendance.module';
import { StudentsModule } from './modules/students/students.module';
import { LecturersModule } from './modules/lecturers/lecturers.module';
import { CourseModuleModule } from './modules/courseModule/courseModule.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/facio',
    ),
    LectureDataModule,
    StudentAttendanceModule,
    StudentsModule,
    LecturersModule,
    CourseModuleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
