import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { LecturerLoginDto, LecturerSignupDto, UpdateLecturerDto } from './dto/lecturer.dto';
import { AuthGuard } from '../../common/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('lecturers')
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Post('login')
  async loginLecturer(@Body() lecturerLoginDto: LecturerLoginDto) {
    return this.lecturersService.loginLecturer(lecturerLoginDto);
  }

  @Post('signup')
  async signupLecturer(@Body() lecturerSignupDto: LecturerSignupDto) {
    return this.lecturersService.signupLecturer(lecturerSignupDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.lecturersService.getLecturerProfile(user.id);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async getAllLecturers() {
    return this.lecturersService.getAllLecturers();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getLecturerById(@Param('id') id: string) {
    return this.lecturersService.getLecturerProfile(id);
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateLecturerDto: UpdateLecturerDto,
  ) {
    return this.lecturersService.updateLecturerProfile(user.id, updateLecturerDto);
  }
}

