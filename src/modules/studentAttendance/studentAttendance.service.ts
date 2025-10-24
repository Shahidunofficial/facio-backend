import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarkAttendanceDto, BulkMarkAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class StudentAttendanceService {
  constructor(
    @InjectModel('Attendance') private attendanceModel: Model<any>,
    @InjectModel('Lecture') private lectureModel: Model<any>,
  ) {}

  async markAttendance(markAttendanceDto: MarkAttendanceDto, markedBy?: string) {
    try {
      // Check if attendance already exists
      const existingAttendance = await this.attendanceModel.findOne({
        studentId: markAttendanceDto.studentId,
        lectureId: markAttendanceDto.lectureId,
      });

      if (existingAttendance) {
        throw new BadRequestException('Attendance already marked for this lecture');
      }

      const attendanceData = {
        ...markAttendanceDto,
        markedBy,
        timestamp: new Date(),
      };

      const newAttendance = new this.attendanceModel(attendanceData);
      const savedAttendance = await newAttendance.save();

      await savedAttendance.populate([
        { path: 'studentId', select: 'name studentId email' },
        { path: 'moduleId', select: 'moduleCode moduleName semester' },
        { path: 'lectureId', select: 'title conductedLectureNumber date' },
      ]);

      return {
        message: 'Attendance marked successfully',
        data: savedAttendance,
      };
    } catch (error) {
      throw error;
    }
  }

  async bulkMarkAttendance(bulkMarkAttendanceDto: BulkMarkAttendanceDto, markedBy?: string) {
    const results: any[] = [];
    const errors: any[] = [];

    for (const record of bulkMarkAttendanceDto.attendanceRecords) {
      try {
        const result = await this.markAttendance(record, markedBy);
        results.push(result.data);
      } catch (error: any) {
        errors.push({
          studentId: record.studentId,
          error: error.message,
        });
      }
    }

    return {
      message: `Bulk attendance marked: ${results.length} successful, ${errors.length} failed`,
      data: {
        successful: results,
        failed: errors,
      },
    };
  }

  async getStudentAttendance(studentId: string, moduleId?: string) {
    const query: any = { studentId };
    if (moduleId) query.moduleId = moduleId;

    const attendance = await this.attendanceModel
      .find(query)
      .populate('moduleId', 'moduleCode moduleName semester')
      .populate('lectureId', 'title conductedLectureNumber date startTime endTime')
      .populate('markedBy', 'name email')
      .sort({ timestamp: -1 });

    return {
      message: 'Student attendance retrieved successfully',
      data: attendance,
    };
  }

  async getLectureAttendance(lectureId: string) {
    const attendance = await this.attendanceModel
      .find({ lectureId })
      .populate('studentId', 'name studentId email')
      .populate('moduleId', 'moduleCode moduleName')
      .populate('markedBy', 'name email')
      .sort({ timestamp: -1 });

    return {
      message: 'Lecture attendance retrieved successfully',
      data: attendance,
    };
  }

  async getModuleAttendance(moduleId: string) {
    const attendance = await this.attendanceModel
      .find({ moduleId })
      .populate('studentId', 'name studentId email')
      .populate('lectureId', 'title conductedLectureNumber date')
      .sort({ timestamp: -1 });

    return {
      message: 'Module attendance retrieved successfully',
      data: attendance,
    };
  }

  async getAttendanceStats(studentId: string, moduleId?: string) {
    const query: any = { studentId };
    if (moduleId) query.moduleId = moduleId;

    const records = await this.attendanceModel.find(query);
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    
    const stats = {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
    };

    return {
      message: 'Attendance statistics retrieved successfully',
      data: stats,
    };
  }

  async getModuleAttendanceStats(moduleId: string) {
    const attendance = await this.attendanceModel.find({ moduleId });
    const totalLectures = await this.lectureModel.countDocuments({ 
      moduleId, 
      status: 'completed' 
    });

    const studentStats = {};
    
    attendance.forEach(record => {
      const studentId = record.studentId.toString();
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          studentId,
          present: 0,
          absent: 0,
          late: 0,
          total: 0,
        };
      }
      
      studentStats[studentId][record.status]++;
      studentStats[studentId].total++;
    });

    const statsArray = Object.values(studentStats).map((stats: any) => ({
      ...stats,
      percentage: totalLectures > 0 ? Math.round(((stats.present + stats.late) / totalLectures) * 100) : 0,
    }));

    return {
      message: 'Module attendance statistics retrieved successfully',
      data: {
        totalLectures,
        studentStats: statsArray,
      },
    };
  }

  async updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.attendanceModel
      .findByIdAndUpdate(
        id,
        { ...updateAttendanceDto, updatedAt: new Date() },
        { new: true },
      )
      .populate('studentId', 'name studentId email')
      .populate('moduleId', 'moduleCode moduleName')
      .populate('lectureId', 'title conductedLectureNumber date');

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return {
      message: 'Attendance updated successfully',
      data: attendance,
    };
  }

  async deleteAttendance(id: string) {
    const attendance = await this.attendanceModel.findByIdAndDelete(id);

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return {
      message: 'Attendance deleted successfully',
      data: attendance,
    };
  }
}
