import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LectureDataService } from './lectureData.service';
import { CreateLectureDto, UpdateLectureDto } from './dto/lecture.dto';
import { AuthGuard } from '../../common/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('lectures')
@UseGuards(AuthGuard)
export class LectureDataController {
  constructor(private readonly lectureService: LectureDataService) {}

  @Get()
  async getAllLectures(
    @Query('lecturerId') lecturerId?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.lectureService.getAllLectures(lecturerId, moduleId);
  }

  @Get('upcoming')
  async getUpcomingLectures(
    @Query('lecturerId') lecturerId?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.lectureService.getUpcomingLectures(lecturerId, moduleId);
  }

  @Get('today')
  async getTodayLectures(@Query('lecturerId') lecturerId?: string) {
    return this.lectureService.getTodayLectures(lecturerId);
  }

  @Get('my-lectures')
  async getMyLectures(@CurrentUser() user: any) {
    if (user.role === 'lecturer') {
      return this.lectureService.getAllLectures(user.id);
    }
    return { message: 'Unauthorized', data: null, error: 'Only lecturers can access this endpoint' };
  }

  @Get('module/:moduleId')
  async getLecturesByModule(@Param('moduleId') moduleId: string) {
    return this.lectureService.getLecturesByModule(moduleId);
  }

  @Get(':id')
  async getLectureById(@Param('id') id: string) {
    return this.lectureService.getLectureById(id);
  }

  @Post()
  async createLecture(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.createLecture(createLectureDto);
  }

  @Put(':id')
  async updateLecture(
    @Param('id') id: string,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    return this.lectureService.updateLecture(id, updateLectureDto);
  }

  @Delete(':id')
  async deleteLecture(@Param('id') id: string) {
    return this.lectureService.deleteLecture(id);
  }
}
