import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LecturerLoginDto, LecturerSignupDto, UpdateLecturerDto } from './dto/lecturer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LecturersService {
  constructor(
    @InjectModel('Lecturer') private lecturerModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async loginLecturer(lecturerLoginDto: LecturerLoginDto) {
    const { email, password } = lecturerLoginDto;
    const lecturer = await this.lecturerModel.findOne({ email });

    if (!lecturer || !(await bcrypt.compare(password, lecturer.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ 
      id: lecturer._id, 
      email: lecturer.email,
      role: 'lecturer',
      employeeId: lecturer.employeeId,
    });

    return { 
      message: 'Login successful',
      data: {
        token,
        lecturer: {
          id: lecturer._id,
          name: lecturer.name,
          email: lecturer.email,
          employeeId: lecturer.employeeId,
          department: lecturer.department,
        },
      },
    };
  }

  async signupLecturer(lecturerSignupDto: LecturerSignupDto) {
    const { email, password, employeeId, ...rest } = lecturerSignupDto;
    
    const existingLecturer = await this.lecturerModel.findOne({ 
      $or: [{ email }, { employeeId }] 
    });
    
    if (existingLecturer) {
      throw new UnauthorizedException('Email or Employee ID already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const lecturer = await this.lecturerModel.create({
      email,
      password: hashedPassword,
      employeeId,
      ...rest,
    });

    const token = this.jwtService.sign({ 
      id: lecturer._id, 
      email: lecturer.email,
      role: 'lecturer',
      employeeId: lecturer.employeeId,
    });

    return { 
      message: 'Signup successful',
      data: {
        token,
        lecturer: {
          id: lecturer._id,
          name: lecturer.name,
          email: lecturer.email,
          employeeId: lecturer.employeeId,
          department: lecturer.department,
        },
      },
    };
  }

  async getLecturerProfile(lecturerId: string) {
    const lecturer = await this.lecturerModel
      .findById(lecturerId)
      .select('-password');

    if (!lecturer) {
      throw new NotFoundException('Lecturer not found');
    }

    return {
      message: 'Lecturer profile retrieved successfully',
      data: lecturer,
    };
  }

  async updateLecturerProfile(lecturerId: string, updateLecturerDto: UpdateLecturerDto) {
    const lecturer = await this.lecturerModel
      .findByIdAndUpdate(
        lecturerId,
        { ...updateLecturerDto, updatedAt: new Date() },
        { new: true },
      )
      .select('-password');

    if (!lecturer) {
      throw new NotFoundException('Lecturer not found');
    }

    return {
      message: 'Profile updated successfully',
      data: lecturer,
    };
  }

  async getAllLecturers() {
    const lecturers = await this.lecturerModel
      .find()
      .select('-password')
      .sort({ name: 1 });

    return {
      message: 'Lecturers retrieved successfully',
      data: lecturers,
    };
  }
}

