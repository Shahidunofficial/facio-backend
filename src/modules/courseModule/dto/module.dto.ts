import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleCode: string;

  @IsString()
  @IsNotEmpty()
  moduleName: string;

  @IsString()
  @IsNotEmpty()
  semester: string;

  @IsString()
  @IsNotEmpty()
  lectureHall: string;

  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  day: string;

  @IsString()
  @IsNotEmpty()
  startTime: string; // Format: "HH:mm"

  @IsString()
  @IsNotEmpty()
  endTime: string; // Format: "HH:mm"

  @IsString()
  @IsNotEmpty()
  lecturerId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsArray()
  @IsOptional()
  enrolledStudents?: string[];
}

export class UpdateModuleDto {
  @IsString()
  @IsOptional()
  moduleName?: string;

  @IsString()
  @IsOptional()
  semester?: string;

  @IsString()
  @IsOptional()
  lectureHall?: string;

  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  @IsOptional()
  day?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  credits?: number;
}

export class EnrollStudentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;
}

