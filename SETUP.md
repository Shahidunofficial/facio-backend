# Facio Backend Setup Guide

## New Features Implemented

### 1. Lecture Data Module
Endpoints to manage and retrieve lecture information:
- `GET /lectures` - Get all lectures
- `GET /lectures/upcoming` - Get upcoming lectures
- `GET /lectures/:id` - Get lecture by ID
- `POST /lectures` - Create new lecture

### 2. Student Attendance Module
Endpoints to track student attendance:
- `POST /attendance/mark` - Mark attendance for a lecture
- `GET /attendance/student/:studentId` - Get attendance records for a student
- `GET /attendance/lecture/:lectureId` - Get attendance records for a lecture
- `GET /attendance/stats/:studentId` - Get attendance statistics

## Database Models

### Lecture Schema
```typescript
{
  title: string (required)
  startTime: Date (required)
  endTime: Date (required)
  room: string (required)
  instructor: string (required)
  createdAt: Date (default: now)
}
```

### Attendance Schema
```typescript
{
  studentId: ObjectId (required, ref: Student)
  lectureId: ObjectId (required, ref: Lecture)
  status: 'present' | 'absent' | 'late' (required)
  method: 'face_recognition' | 'bluetooth_beacon' | 'manual' (required)
  timestamp: Date (default: now)
  location: string
  notes: string
}
```

## Running the Backend

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

## Environment Configuration

Create a `.env` file in the backend root:
```
MONGODB_URI=mongodb://localhost:27017/facio
JWT_SECRET=your-secret-key
```

## Scalable Folder Structure

```
src/
├── modules/
│   ├── lectureData/
│   │   ├── schemas/
│   │   │   └── lecture.schema.ts
│   │   ├── lectureData.controller.ts
│   │   ├── lectureData.service.ts
│   │   └── lectureData.module.ts
│   ├── studentAttendance/
│   │   ├── schemas/
│   │   │   └── attendance.schema.ts
│   │   ├── studentAttendance.controller.ts
│   │   ├── studentAttendance.service.ts
│   │   └── studentAttendance.module.ts
│   └── students/
│       ├── dto/
│       ├── schemas/
│       └── ...
├── common/
│   ├── decorators/
│   ├── guards/
│   └── ...
├── app.module.ts
└── main.ts
```
