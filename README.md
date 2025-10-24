# Facio Attendance System - Backend

A comprehensive attendance management system built with NestJS, MongoDB, and JWT authentication. This system supports student and lecturer authentication, course module management, lecture scheduling, and attendance tracking with multiple verification methods (face recognition, bluetooth beacon, manual).

## Features

### Core Modules

1. **Authentication System**
   - Student authentication (signup/login with JWT)
   - Lecturer authentication (signup/login with JWT)
   - Role-based access control
   - Secure password hashing with bcrypt

2. **Course Module Management**
   - Create and manage course modules
   - Module properties: code, name, semester, lecture hall, day, time
   - Student enrollment/unenrollment
   - Lecturer assignment

3. **Lecture Management**
   - Create scheduled lectures linked to modules
   - Track conducted lecture numbers
   - Lecture status tracking (scheduled, ongoing, completed, cancelled)
   - Attendance marking status

4. **Attendance Tracking**
   - Mark attendance with multiple methods:
     - Face recognition
     - Bluetooth beacon
     - Manual entry
   - Required data: moduleId, studentId, lectureId
   - Bulk attendance marking
   - Attendance statistics per student/module
   - Update and delete attendance records

### Standardized API Response Format

All endpoints return responses in this format:

```json
{
  "message": "string - describes the operation result",
  "data": "object|array|null - contains the response data",
  "error": "string|null - contains error message if any"
}
```

## Technology Stack

- **Framework:** NestJS 11.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** class-validator, class-transformer
- **Password Hashing:** bcrypt
- **Language:** TypeScript

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd facio-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory (use `.env.example` as template):
   
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/facio
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # If using MongoDB service
   mongod
   
   # Or if installed as a service
   sudo service mongodb start
   ```

5. **Run the application**
   
   Development mode:
   ```bash
   npm run start:dev
   ```
   
   Production mode:
   ```bash
   npm run build
   npm run start:prod
   ```

The server will start on `http://localhost:3000` (or the PORT specified in .env)

## Project Structure

```
src/
├── common/
│   ├── decorators/
│   │   └── current-user.decorator.ts    # Extract current user from JWT
│   ├── filters/
│   │   └── http-exception.filter.ts     # Global exception handler
│   ├── guards/
│   │   └── auth.guards.ts               # JWT authentication guard
│   ├── interceptors/
│   │   └── response.interceptor.ts      # Standardize API responses
│   └── dto/
│       └── response.dto.ts              # Response DTO helper
├── modules/
│   ├── courseModule/                    # Course module management
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── courseModule.controller.ts
│   │   ├── courseModule.service.ts
│   │   └── courseModule.module.ts
│   ├── lectureData/                     # Lecture management
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── lectureData.controller.ts
│   │   ├── lectureData.service.ts
│   │   └── lectureData.module.ts
│   ├── lecturers/                       # Lecturer authentication
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── lecturers.controller.ts
│   │   ├── lecturers.service.ts
│   │   └── lecturers.module.ts
│   ├── studentAttendance/               # Attendance tracking
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── studentAttendance.controller.ts
│   │   ├── studentAttendance.service.ts
│   │   └── studentAttendance.module.ts
│   └── students/                        # Student authentication
│       ├── dto/
│       ├── schemas/
│       ├── students.controller.ts
│       ├── students.service.ts
│       └── students.module.ts
├── app.module.ts                        # Root module
└── main.ts                              # Application entry point
```

## API Documentation

Comprehensive API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

#### Authentication Endpoints
- `POST /students/signup` - Register student
- `POST /students/login` - Login student
- `POST /lecturers/signup` - Register lecturer
- `POST /lecturers/login` - Login lecturer

#### Module Endpoints
- `POST /modules` - Create course module
- `GET /modules` - Get all modules
- `GET /modules/my-modules` - Get user's modules
- `POST /modules/:moduleId/enroll` - Enroll student

#### Lecture Endpoints
- `POST /lectures` - Create lecture
- `GET /lectures` - Get all lectures
- `GET /lectures/upcoming` - Get upcoming lectures
- `GET /lectures/today` - Get today's lectures

#### Attendance Endpoints
- `POST /attendance/mark` - Mark attendance
- `POST /attendance/bulk-mark` - Bulk mark attendance
- `GET /attendance/my-attendance` - Get my attendance
- `GET /attendance/stats/my-stats` - Get my statistics

## Data Models

### Module (Course)
```typescript
{
  moduleCode: string;        // e.g., "CS101"
  moduleName: string;
  semester: string;          // e.g., "2024-Spring"
  lectureHall: string;       // e.g., "Room 301"
  day: string;               // Monday, Tuesday, etc.
  startTime: string;         // "HH:mm" format
  endTime: string;           // "HH:mm" format
  lecturerId: ObjectId;
  enrolledStudents: ObjectId[];
}
```

### Lecture
```typescript
{
  moduleId: ObjectId;
  conductedLectureNumber: number;  // Sequential lecture number
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  lectureHall: string;
  lecturerId: ObjectId;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  attendanceMarked: boolean;
}
```

### Attendance
```typescript
{
  studentId: ObjectId;       // Required
  moduleId: ObjectId;        // Required
  lectureId: ObjectId;       // Required
  status: 'present' | 'absent' | 'late';
  method: 'face_recognition' | 'bluetooth_beacon' | 'manual';
  timestamp: Date;
  location: string;
  verificationData: any;     // For face recognition data, etc.
  markedBy: ObjectId;        // Lecturer who marked
}
```

## Authentication

The system uses JWT tokens for authentication. After login, include the token in requests:

```
Authorization: Bearer <your_jwt_token>
```

JWT payload contains:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "student" | "lecturer",
  "studentId": "S12345",      // for students
  "employeeId": "L001"        // for lecturers
}
```

## Validation

All request bodies are validated using class-validator decorators. Invalid requests return:

```json
{
  "message": "Validation failed",
  "data": null,
  "error": "email must be a valid email, password must be at least 6 characters"
}
```

## Error Handling

All errors are caught and formatted with the standard response format:

- **400 Bad Request** - Validation errors, duplicate entries
- **401 Unauthorized** - Invalid credentials, missing/invalid token
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Unexpected errors

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

### Adding New Endpoints

1. Create DTOs for request validation
2. Add service methods with business logic
3. Create controller endpoints
4. Return standardized responses:
   ```typescript
   return {
     message: 'Success message',
     data: result,
   };
   ```

### Database Indexes

Key indexes are automatically created:
- `moduleCode + semester` (unique) on Module
- `moduleId + conductedLectureNumber` (unique) on Lecture
- `studentId + lectureId` (unique) on Attendance

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Enable MongoDB authentication
4. Configure proper CORS origins
5. Use environment-specific database
6. Enable logging and monitoring

## Security Considerations

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 24 hours
- CORS is configured for specific origins
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

## Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Add proper DTOs for validation
4. Return standardized responses
5. Update API documentation

## License

[Your License Here]

## Support

For issues and questions, please contact the development team.

---

**Built with ❤️ using NestJS**
