import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLectureDto, UpdateLectureDto } from './dto/lecture.dto';

@Injectable()
export class LectureDataService {
  constructor(
    @InjectModel('Lecture') private lectureModel: Model<any>,
  ) {}

  async getAllLectures(lecturerId?: string, moduleId?: string) {
    const query: any = {};
    if (lecturerId) query.lecturerId = lecturerId;
    if (moduleId) query.moduleId = moduleId;

    const lectures = await this.lectureModel
      .find(query)
      .populate('moduleId', 'moduleCode moduleName semester')
      .populate('lecturerId', 'name email department')
      .sort({ startTime: 1 });

    return {
      message: 'Lectures retrieved successfully',
      data: lectures,
    };
  }

  async getUpcomingLectures(lecturerId?: string, moduleId?: string) {
    const now = new Date();
    const query: any = { startTime: { $gte: now }, status: { $ne: 'cancelled' } };
    if (lecturerId) query.lecturerId = lecturerId;
    if (moduleId) query.moduleId = moduleId;

    const lectures = await this.lectureModel
      .find(query)
      .populate('moduleId', 'moduleCode moduleName semester')
      .populate('lecturerId', 'name email department')
      .sort({ startTime: 1 })
      .limit(10);

    return {
      message: 'Upcoming lectures retrieved successfully',
      data: lectures,
    };
  }

  async getLectureById(id: string) {
    const lecture = await this.lectureModel
      .findById(id)
      .populate('moduleId', 'moduleCode moduleName semester lectureHall')
      .populate('lecturerId', 'name email department');

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return {
      message: 'Lecture retrieved successfully',
      data: lecture,
    };
  }

  async getLecturesByModule(moduleId: string) {
    const lectures = await this.lectureModel
      .find({ moduleId })
      .populate('lecturerId', 'name email department')
      .sort({ conductedLectureNumber: 1 });

    return {
      message: 'Module lectures retrieved successfully',
      data: lectures,
    };
  }

  async createLecture(createLectureDto: CreateLectureDto) {
    try {
      const existingLecture = await this.lectureModel.findOne({
        moduleId: createLectureDto.moduleId,
        conductedLectureNumber: createLectureDto.conductedLectureNumber,
      });

      if (existingLecture) {
        throw new BadRequestException('Lecture with this number already exists for this module');
      }

      const newLecture = new this.lectureModel(createLectureDto);
      const savedLecture = await newLecture.save();
      
      await savedLecture.populate([
        { path: 'moduleId', select: 'moduleCode moduleName semester' },
        { path: 'lecturerId', select: 'name email department' },
      ]);

      return {
        message: 'Lecture created successfully',
        data: savedLecture,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateLecture(id: string, updateLectureDto: UpdateLectureDto) {
    const lecture = await this.lectureModel
      .findByIdAndUpdate(
        id,
        { ...updateLectureDto, updatedAt: new Date() },
        { new: true },
      )
      .populate('moduleId', 'moduleCode moduleName semester')
      .populate('lecturerId', 'name email department');

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return {
      message: 'Lecture updated successfully',
      data: lecture,
    };
  }

  async deleteLecture(id: string) {
    const lecture = await this.lectureModel.findByIdAndDelete(id);

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return {
      message: 'Lecture deleted successfully',
      data: lecture,
    };
  }

  async getTodayLectures(lecturerId?: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const query: any = {
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    };
    if (lecturerId) query.lecturerId = lecturerId;

    const lectures = await this.lectureModel
      .find(query)
      .populate('moduleId', 'moduleCode moduleName semester')
      .populate('lecturerId', 'name email department')
      .sort({ startTime: 1 });

    return {
      message: 'Today\'s lectures retrieved successfully',
      data: lectures,
    };
  }
}
