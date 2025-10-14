import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentLoginDTO, StudentSignupDTO } from './dto/student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel('Student') private studentModel: Model<any>,
    @InjectModel('Lecture') private lectureModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async loginStudent(studentLoginDTO: StudentLoginDTO) {
    const { email, password } = studentLoginDTO;
    const student = await this.studentModel.findOne({ email });

    if (!student || !(await bcrypt.compare(password, student.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: student._id, email: student.email });
    return { token };
  }

  async signupStudent(studentSignupDTO: StudentSignupDTO) {
    const { email, password, name, studentId } = studentSignupDTO;
    
    const existingStudent = await this.studentModel.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    
    if (existingStudent) {
      throw new UnauthorizedException('Email or Student ID already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await this.studentModel.create({
      email,
      password: hashedPassword,
      name,
      studentId,
    });

    const token = this.jwtService.sign({ id: student._id, email: student.email });
    return { token };
  }

  async getUpcomingLectures(studentId: string) {
    const now = new Date();
    return this.lectureModel.find({
      startTime: { $gt: now },
    }).sort({ startTime: 1 }).limit(5);
  }

  async getLectureTimeTable(studentId: string) {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    return this.lectureModel.find({
      startTime: { $gte: startOfWeek, $lt: endOfWeek },
    }).sort({ startTime: 1 });
  }
}
