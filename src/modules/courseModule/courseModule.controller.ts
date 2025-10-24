import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CourseModuleService } from './courseModule.service';
import { CreateModuleDto, UpdateModuleDto, EnrollStudentDto } from './dto/module.dto';
import { AuthGuard } from '../../common/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('modules')
@UseGuards(AuthGuard)
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Post()
  async createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.courseModuleService.createModule(createModuleDto);
  }

  @Get()
  async getAllModules(@Query('lecturerId') lecturerId?: string) {
    return this.courseModuleService.getAllModules(lecturerId);
  }

  @Get('student/:studentId')
  async getStudentModules(@Param('studentId') studentId: string) {
    return this.courseModuleService.getStudentModules(studentId);
  }

  @Get('my-modules')
  async getMyModules(@CurrentUser() user: any) {
    if (user.role === 'student') {
      return this.courseModuleService.getStudentModules(user.id);
    } else if (user.role === 'lecturer') {
      return this.courseModuleService.getAllModules(user.id);
    }
  }

  @Get(':id')
  async getModuleById(@Param('id') id: string) {
    return this.courseModuleService.getModuleById(id);
  }

  @Get('code/:moduleCode')
  async getModuleByCode(
    @Param('moduleCode') moduleCode: string,
    @Query('semester') semester: string,
  ) {
    return this.courseModuleService.getModuleByCode(moduleCode, semester);
  }

  @Put(':id')
  async updateModule(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.courseModuleService.updateModule(id, updateModuleDto);
  }

  @Delete(':id')
  async deleteModule(@Param('id') id: string) {
    return this.courseModuleService.deleteModule(id);
  }

  @Post(':moduleId/enroll')
  async enrollStudent(
    @Param('moduleId') moduleId: string,
    @Body() enrollStudentDto: EnrollStudentDto,
  ) {
    return this.courseModuleService.enrollStudent(moduleId, enrollStudentDto.studentId);
  }

  @Delete(':moduleId/unenroll/:studentId')
  async unenrollStudent(
    @Param('moduleId') moduleId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.courseModuleService.unenrollStudent(moduleId, studentId);
  }
}

