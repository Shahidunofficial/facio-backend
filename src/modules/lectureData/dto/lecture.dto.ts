import { IsString, IsNotEmpty, IsDate, IsEnum, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLectureDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsNumber()
  @IsNotEmpty()
  conductedLectureNumber: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsString()
  @IsNotEmpty()
  lectureHall: string;

  @IsString()
  @IsNotEmpty()
  lecturerId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateLectureDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startTime?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endTime?: Date;

  @IsString()
  @IsOptional()
  lectureHall?: string;

  @IsEnum(['scheduled', 'ongoing', 'completed', 'cancelled'])
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  attendanceMarked?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

