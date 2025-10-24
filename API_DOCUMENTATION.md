# Facio Attendance System - API Documentation

## Base URL
```
http://localhost:3000
```

## Standard API Response Format

All API endpoints follow this standardized response format:

```json
{
  "message": "string - describes the operation result",
  "data": "object|array|null - contains the response data",
  "error": "string|null - contains error message if any"
}
```

### Success Response Example
```json
{
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": { ... }
  },
  "error": null
}
```

### Error Response Example
```json
{
  "message": "Invalid credentials",
  "data": null,
  "error": "Email or password is incorrect"
}
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The JWT token contains:
- `id`: User ID
- `email`: User email
- `role`: 'student' | 'lecturer'
- Additional role-specific data

---

## 1. Student Endpoints

### POST /students/signup
Register a new student.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "studentId": "S12345"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "data": {
    "token": "jwt_token",
    "student": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "studentId": "S12345"
    }
  },
  "error": null
}
```

### POST /students/login
Login as a student.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET /students/upcoming-lectures
Get upcoming lectures for the authenticated student.

**Auth Required:** Yes

**Response:**
```json
{
  "message": "Upcoming lectures retrieved successfully",
  "data": [
    {
      "_id": "...",
      "title": "Introduction to AI",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T11:30:00Z",
      "moduleId": { "moduleCode": "CS101", "moduleName": "Computer Science" },
      "lecturerId": { "name": "Dr. Smith" }
    }
  ],
  "error": null
}
```

### GET /students/timetable
Get weekly timetable for the authenticated student.

**Auth Required:** Yes

---

## 2. Lecturer Endpoints

### POST /lecturers/signup
Register a new lecturer.

**Body:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "employeeId": "L001",
  "department": "Computer Science",
  "phone": "+1234567890",
  "specialization": "Artificial Intelligence"
}
```

### POST /lecturers/login
Login as a lecturer.

**Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

### GET /lecturers/profile
Get lecturer's profile.

**Auth Required:** Yes

### PUT /lecturers/profile
Update lecturer's profile.

**Auth Required:** Yes

**Body:**
```json
{
  "name": "Dr. Jane Smith",
  "department": "Computer Science",
  "phone": "+1234567890",
  "specialization": "Machine Learning"
}
```

### GET /lecturers/all
Get all lecturers.

**Auth Required:** Yes

---

## 3. Course Module Endpoints

### POST /modules
Create a new course module.

**Auth Required:** Yes

**Body:**
```json
{
  "moduleCode": "CS101",
  "moduleName": "Introduction to Computer Science",
  "semester": "2024-Spring",
  "lectureHall": "Room 301",
  "day": "Monday",
  "startTime": "10:00",
  "endTime": "11:30",
  "lecturerId": "lecturer_id_here",
  "description": "Basic computer science concepts",
  "credits": 3,
  "enrolledStudents": []
}
```

**Response:**
```json
{
  "message": "Module created successfully",
  "data": {
    "_id": "...",
    "moduleCode": "CS101",
    "moduleName": "Introduction to Computer Science",
    "semester": "2024-Spring",
    "lectureHall": "Room 301",
    "day": "Monday",
    "startTime": "10:00",
    "endTime": "11:30",
    "lecturerId": { ... },
    "credits": 3
  },
  "error": null
}
```

### GET /modules
Get all modules (or filter by lecturerId).

**Auth Required:** Yes

**Query Parameters:**
- `lecturerId` (optional): Filter by lecturer

### GET /modules/my-modules
Get modules for the authenticated user (lecturer or student).

**Auth Required:** Yes

### GET /modules/:id
Get a specific module by ID.

**Auth Required:** Yes

### GET /modules/code/:moduleCode?semester=2024-Spring
Get a module by code and semester.

**Auth Required:** Yes

### GET /modules/student/:studentId
Get all modules for a specific student.

**Auth Required:** Yes

### PUT /modules/:id
Update a module.

**Auth Required:** Yes

### DELETE /modules/:id
Delete a module.

**Auth Required:** Yes

### POST /modules/:moduleId/enroll
Enroll a student in a module.

**Auth Required:** Yes

**Body:**
```json
{
  "studentId": "student_id_here"
}
```

### DELETE /modules/:moduleId/unenroll/:studentId
Unenroll a student from a module.

**Auth Required:** Yes

---

## 4. Lecture Endpoints

### POST /lectures
Create a new lecture.

**Auth Required:** Yes

**Body:**
```json
{
  "moduleId": "module_id_here",
  "conductedLectureNumber": 1,
  "title": "Introduction to AI - Lecture 1",
  "date": "2024-01-15",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:30:00Z",
  "lectureHall": "Room 301",
  "lecturerId": "lecturer_id_here",
  "notes": "Bring your laptops"
}
```

**Response:**
```json
{
  "message": "Lecture created successfully",
  "data": {
    "_id": "...",
    "moduleId": { "moduleCode": "CS101", "moduleName": "..." },
    "conductedLectureNumber": 1,
    "title": "Introduction to AI - Lecture 1",
    "status": "scheduled",
    "attendanceMarked": false
  },
  "error": null
}
```

### GET /lectures
Get all lectures (with optional filters).

**Auth Required:** Yes

**Query Parameters:**
- `lecturerId` (optional): Filter by lecturer
- `moduleId` (optional): Filter by module

### GET /lectures/upcoming
Get upcoming lectures.

**Auth Required:** Yes

**Query Parameters:**
- `lecturerId` (optional)
- `moduleId` (optional)

### GET /lectures/today
Get today's lectures.

**Auth Required:** Yes

**Query Parameters:**
- `lecturerId` (optional)

### GET /lectures/my-lectures
Get lectures for the authenticated lecturer.

**Auth Required:** Yes (Lecturer only)

### GET /lectures/module/:moduleId
Get all lectures for a specific module.

**Auth Required:** Yes

### GET /lectures/:id
Get a specific lecture by ID.

**Auth Required:** Yes

### PUT /lectures/:id
Update a lecture.

**Auth Required:** Yes

**Body:**
```json
{
  "status": "completed",
  "attendanceMarked": true,
  "notes": "Updated notes"
}
```

### DELETE /lectures/:id
Delete a lecture.

**Auth Required:** Yes

---

## 5. Attendance Endpoints

### POST /attendance/mark
Mark attendance for a student.

**Auth Required:** Yes

**Body:**
```json
{
  "studentId": "student_id_here",
  "moduleId": "module_id_here",
  "lectureId": "lecture_id_here",
  "status": "present",
  "method": "face_recognition",
  "location": "Room 301",
  "notes": "On time",
  "verificationData": { }
}
```

**Status values:** "present", "absent", "late"
**Method values:** "face_recognition", "bluetooth_beacon", "manual"

**Response:**
```json
{
  "message": "Attendance marked successfully",
  "data": {
    "_id": "...",
    "studentId": { "name": "John Doe", "studentId": "S12345" },
    "moduleId": { "moduleCode": "CS101" },
    "lectureId": { "title": "..." },
    "status": "present",
    "method": "face_recognition",
    "timestamp": "2024-01-15T10:05:00Z"
  },
  "error": null
}
```

### POST /attendance/bulk-mark
Mark attendance for multiple students at once.

**Auth Required:** Yes

**Body:**
```json
{
  "attendanceRecords": [
    {
      "studentId": "student_id_1",
      "moduleId": "module_id",
      "lectureId": "lecture_id",
      "status": "present",
      "method": "face_recognition"
    },
    {
      "studentId": "student_id_2",
      "moduleId": "module_id",
      "lectureId": "lecture_id",
      "status": "absent",
      "method": "manual"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Bulk attendance marked: 2 successful, 0 failed",
  "data": {
    "successful": [ ... ],
    "failed": []
  },
  "error": null
}
```

### GET /attendance/student/:studentId
Get attendance records for a specific student.

**Auth Required:** Yes

**Query Parameters:**
- `moduleId` (optional): Filter by module

### GET /attendance/my-attendance
Get attendance records for the authenticated student.

**Auth Required:** Yes

**Query Parameters:**
- `moduleId` (optional): Filter by module

### GET /attendance/lecture/:lectureId
Get attendance records for a specific lecture.

**Auth Required:** Yes

### GET /attendance/module/:moduleId
Get all attendance records for a specific module.

**Auth Required:** Yes

### GET /attendance/stats/student/:studentId
Get attendance statistics for a student.

**Auth Required:** Yes

**Query Parameters:**
- `moduleId` (optional): Filter by module

**Response:**
```json
{
  "message": "Attendance statistics retrieved successfully",
  "data": {
    "total": 20,
    "present": 16,
    "absent": 2,
    "late": 2,
    "percentage": 90
  },
  "error": null
}
```

### GET /attendance/stats/my-stats
Get attendance statistics for the authenticated student.

**Auth Required:** Yes

**Query Parameters:**
- `moduleId` (optional): Filter by module

### GET /attendance/stats/module/:moduleId
Get attendance statistics for all students in a module.

**Auth Required:** Yes

**Response:**
```json
{
  "message": "Module attendance statistics retrieved successfully",
  "data": {
    "totalLectures": 20,
    "studentStats": [
      {
        "studentId": "...",
        "present": 16,
        "absent": 2,
        "late": 2,
        "total": 20,
        "percentage": 90
      }
    ]
  },
  "error": null
}
```

### PUT /attendance/:id
Update an attendance record.

**Auth Required:** Yes

**Body:**
```json
{
  "status": "late",
  "notes": "Updated status"
}
```

### DELETE /attendance/:id
Delete an attendance record.

**Auth Required:** Yes

---

## Data Models

### Student
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "studentId": "string (unique)",
  "createdAt": "Date"
}
```

### Lecturer
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "employeeId": "string (unique)",
  "department": "string",
  "phone": "string",
  "specialization": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Module (Course Module)
```json
{
  "_id": "ObjectId",
  "moduleCode": "string (unique)",
  "moduleName": "string",
  "semester": "string",
  "lectureHall": "string",
  "day": "string (enum: days of week)",
  "startTime": "string (HH:mm)",
  "endTime": "string (HH:mm)",
  "lecturerId": "ObjectId (ref: Lecturer)",
  "description": "string",
  "credits": "number",
  "enrolledStudents": ["ObjectId (ref: Student)"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Lecture
```json
{
  "_id": "ObjectId",
  "moduleId": "ObjectId (ref: Module)",
  "conductedLectureNumber": "number",
  "title": "string",
  "date": "Date",
  "startTime": "Date",
  "endTime": "Date",
  "lectureHall": "string",
  "lecturerId": "ObjectId (ref: Lecturer)",
  "status": "string (enum: scheduled, ongoing, completed, cancelled)",
  "attendanceMarked": "boolean",
  "notes": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Attendance
```json
{
  "_id": "ObjectId",
  "studentId": "ObjectId (ref: Student)",
  "moduleId": "ObjectId (ref: Module)",
  "lectureId": "ObjectId (ref: Lecture)",
  "status": "string (enum: present, absent, late)",
  "method": "string (enum: face_recognition, bluetooth_beacon, manual)",
  "timestamp": "Date",
  "location": "string",
  "notes": "string",
  "markedBy": "ObjectId (ref: Lecturer)",
  "verificationData": "Mixed (for face recognition data, etc.)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Error Codes

- **400** - Bad Request (validation errors, duplicate entries)
- **401** - Unauthorized (invalid credentials, missing token)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/facio

# JWT
JWT_SECRET=your-secret-key-here

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## Running the Application

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## Testing Endpoints

You can test the endpoints using tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- cURL

Example cURL request:
```bash
curl -X POST http://localhost:3000/students/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

Example with authentication:
```bash
curl -X GET http://localhost:3000/attendance/my-attendance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

