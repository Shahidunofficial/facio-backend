import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StudentAttendanceService } from './studentAttendance.service';
import { MarkAttendanceDto, BulkMarkAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
import { AuthGuard } from '../../common/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('attendance')
@UseGuards(AuthGuard)
export class StudentAttendanceController {
  constructor(private readonly attendanceService: StudentAttendanceService) {}

  @Post('mark')
  async markAttendance(
    @Body() markAttendanceDto: MarkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.markAttendance(markAttendanceDto, user.id);
  }

  @Post('bulk-mark')
  async bulkMarkAttendance(
    @Body() bulkMarkAttendanceDto: BulkMarkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.bulkMarkAttendance(bulkMarkAttendanceDto, user.id);
  }

  @Get('student/:studentId')
  async getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, moduleId);
  }

  @Get('my-attendance')
  async getMyAttendance(
    @CurrentUser() user: any,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.attendanceService.getStudentAttendance(user.id, moduleId);
  }

  @Get('lecture/:lectureId')
  async getLectureAttendance(@Param('lectureId') lectureId: string) {
    return this.attendanceService.getLectureAttendance(lectureId);
  }

  @Get('module/:moduleId')
  async getModuleAttendance(@Param('moduleId') moduleId: string) {
    return this.attendanceService.getModuleAttendance(moduleId);
  }

  @Get('stats/student/:studentId')
  async getAttendanceStats(
    @Param('studentId') studentId: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.attendanceService.getAttendanceStats(studentId, moduleId);
  }

  @Get('stats/my-stats')
  async getMyAttendanceStats(
    @CurrentUser() user: any,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.attendanceService.getAttendanceStats(user.id, moduleId);
  }

  @Get('stats/module/:moduleId')
  async getModuleAttendanceStats(@Param('moduleId') moduleId: string) {
    return this.attendanceService.getModuleAttendanceStats(moduleId);
  }

  @Put(':id')
  async updateAttendance(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto);
  }

  @Delete(':id')
  async deleteAttendance(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(id);
  }
}
