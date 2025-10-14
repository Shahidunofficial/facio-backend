import { IsEmail, IsString, MinLength } from 'class-validator';

export class StudentLoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class StudentSignupDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  studentId: string;
}

export class LectureResponseDTO {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  room: string;
  instructor: string;
}
