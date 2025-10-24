import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';

export class MarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  lectureId: string;

  @IsEnum(['present', 'absent', 'late'])
  status: string;

  @IsEnum(['face_recognition', 'bluetooth_beacon', 'manual'])
  method: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  verificationData?: any;
}

export class BulkMarkAttendanceDto {
  @IsArray()
  @IsNotEmpty()
  attendanceRecords: MarkAttendanceDto[];
}

export class UpdateAttendanceDto {
  @IsEnum(['present', 'absent', 'late'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

