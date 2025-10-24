import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Injectable()
export class CourseModuleService {
  constructor(
    @InjectModel('Module') private moduleModel: Model<any>,
  ) {}

  async createModule(createModuleDto: CreateModuleDto) {
    try {
      const existingModule = await this.moduleModel.findOne({
        moduleCode: createModuleDto.moduleCode,
        semester: createModuleDto.semester,
      });

      if (existingModule) {
        throw new BadRequestException('Module with this code already exists for this semester');
      }

      const newModule = new this.moduleModel(createModuleDto);
      const savedModule = await newModule.save();
      
      return {
        message: 'Module created successfully',
        data: savedModule,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllModules(lecturerId?: string) {
    const query = lecturerId ? { lecturerId } : {};
    const modules = await this.moduleModel
      .find(query)
      .populate('lecturerId', 'name email')
      .populate('enrolledStudents', 'name studentId email')
      .sort({ moduleCode: 1 });
    
    return {
      message: 'Modules retrieved successfully',
      data: modules,
    };
  }

  async getModuleById(id: string) {
    const module = await this.moduleModel
      .findById(id)
      .populate('lecturerId', 'name email')
      .populate('enrolledStudents', 'name studentId email');

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return {
      message: 'Module retrieved successfully',
      data: module,
    };
  }

  async getModuleByCode(moduleCode: string, semester: string) {
    const module = await this.moduleModel
      .findOne({ moduleCode, semester })
      .populate('lecturerId', 'name email')
      .populate('enrolledStudents', 'name studentId email');

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return {
      message: 'Module retrieved successfully',
      data: module,
    };
  }

  async updateModule(id: string, updateModuleDto: UpdateModuleDto) {
    const module = await this.moduleModel.findByIdAndUpdate(
      id,
      { ...updateModuleDto, updatedAt: new Date() },
      { new: true },
    ).populate('lecturerId', 'name email')
     .populate('enrolledStudents', 'name studentId email');

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return {
      message: 'Module updated successfully',
      data: module,
    };
  }

  async deleteModule(id: string) {
    const module = await this.moduleModel.findByIdAndDelete(id);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return {
      message: 'Module deleted successfully',
      data: module,
    };
  }

  async enrollStudent(moduleId: string, studentId: string) {
    const module = await this.moduleModel.findById(moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (module.enrolledStudents.includes(studentId)) {
      throw new BadRequestException('Student already enrolled in this module');
    }

    module.enrolledStudents.push(studentId);
    module.updatedAt = new Date();
    await module.save();

    return {
      message: 'Student enrolled successfully',
      data: module,
    };
  }

  async unenrollStudent(moduleId: string, studentId: string) {
    const module = await this.moduleModel.findById(moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const index = module.enrolledStudents.indexOf(studentId);
    if (index === -1) {
      throw new BadRequestException('Student not enrolled in this module');
    }

    module.enrolledStudents.splice(index, 1);
    module.updatedAt = new Date();
    await module.save();

    return {
      message: 'Student unenrolled successfully',
      data: module,
    };
  }

  async getStudentModules(studentId: string) {
    const modules = await this.moduleModel
      .find({ enrolledStudents: studentId })
      .populate('lecturerId', 'name email')
      .sort({ day: 1, startTime: 1 });

    return {
      message: 'Student modules retrieved successfully',
      data: modules,
    };
  }
}

