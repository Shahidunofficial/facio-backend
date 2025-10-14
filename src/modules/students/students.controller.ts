import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentLoginDTO, StudentSignupDTO } from './dto/student.dto';
import { AuthGuard } from '../../common/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('login')
  async loginStudent(@Body() studentLoginDTO: StudentLoginDTO) {
    return this.studentsService.loginStudent(studentLoginDTO);
  }

  @Post('signup')
  async signupStudent(@Body() studentSignupDTO: StudentSignupDTO) {
    return this.studentsService.signupStudent(studentSignupDTO);
  }

  @Get('upcoming-lectures')
  @UseGuards(AuthGuard)
  async getUpcomingLectures(@CurrentUser() studentId: string) {
    return this.studentsService.getUpcomingLectures(studentId);
  }

  @Get('timetable')
  @UseGuards(AuthGuard)
  async getLectureTimeTable(@CurrentUser() studentId: string) {
    return this.studentsService.getLectureTimeTable(studentId);
  }
}