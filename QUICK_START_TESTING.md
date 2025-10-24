# Quick Start Testing Guide

This guide will help you quickly test all the features of the Facio Attendance System.

## Prerequisites

1. MongoDB running on `localhost:27017`
2. Backend server running on `localhost:3000`

```bash
npm install
npm run start:dev
```

## Step-by-Step Testing

### 1. Register and Login Users

#### Register a Lecturer

```bash
POST http://localhost:3000/lecturers/signup
Content-Type: application/json

{
  "name": "Dr. Jane Smith",
  "email": "jane@university.edu",
  "password": "password123",
  "employeeId": "L001",
  "department": "Computer Science",
  "specialization": "Artificial Intelligence"
}
```

**Expected Response:**
```json
{
  "message": "Signup successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "lecturer": {
      "id": "...",
      "name": "Dr. Jane Smith",
      "email": "jane@university.edu",
      "employeeId": "L001",
      "department": "Computer Science"
    }
  },
  "error": null
}
```

**Save the lecturer token and ID!**

#### Register Students

```bash
POST http://localhost:3000/students/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@student.edu",
  "password": "password123",
  "studentId": "S12345"
}
```

**Save student1 token and ID!**

Register another student:

```bash
POST http://localhost:3000/students/signup
Content-Type: application/json

{
  "name": "Jane Wilson",
  "email": "jane.w@student.edu",
  "password": "password123",
  "studentId": "S12346"
}
```

**Save student2 token and ID!**

---

### 2. Create a Course Module

Use the **lecturer token** from step 1:

```bash
POST http://localhost:3000/modules
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "moduleCode": "CS101",
  "moduleName": "Introduction to Computer Science",
  "semester": "2024-Spring",
  "lectureHall": "Room 301",
  "day": "Monday",
  "startTime": "10:00",
  "endTime": "11:30",
  "lecturerId": "<LECTURER_ID>",
  "description": "Basic concepts of computer science",
  "credits": 3
}
```

**Expected Response:**
```json
{
  "message": "Module created successfully",
  "data": {
    "_id": "...",
    "moduleCode": "CS101",
    "moduleName": "Introduction to Computer Science",
    ...
  },
  "error": null
}
```

**Save the module ID!**

---

### 3. Enroll Students in the Module

```bash
POST http://localhost:3000/modules/<MODULE_ID>/enroll
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "studentId": "<STUDENT1_ID>"
}
```

Repeat for student 2:

```bash
POST http://localhost:3000/modules/<MODULE_ID>/enroll
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "studentId": "<STUDENT2_ID>"
}
```

---

### 4. Create a Lecture

```bash
POST http://localhost:3000/lectures
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "moduleId": "<MODULE_ID>",
  "conductedLectureNumber": 1,
  "title": "Introduction to CS - Lecture 1",
  "date": "2024-01-15",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:30:00.000Z",
  "lectureHall": "Room 301",
  "lecturerId": "<LECTURER_ID>",
  "notes": "Bring your laptops"
}
```

**Expected Response:**
```json
{
  "message": "Lecture created successfully",
  "data": {
    "_id": "...",
    "moduleId": { ... },
    "conductedLectureNumber": 1,
    "title": "Introduction to CS - Lecture 1",
    "status": "scheduled",
    "attendanceMarked": false,
    ...
  },
  "error": null
}
```

**Save the lecture ID!**

---

### 5. Mark Attendance

#### Single Attendance (Face Recognition)

```bash
POST http://localhost:3000/attendance/mark
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "studentId": "<STUDENT1_ID>",
  "moduleId": "<MODULE_ID>",
  "lectureId": "<LECTURE_ID>",
  "status": "present",
  "method": "face_recognition",
  "location": "Room 301",
  "verificationData": {
    "confidence": 0.95,
    "timestamp": "2024-01-15T10:05:00Z"
  }
}
```

#### Bulk Attendance Marking

```bash
POST http://localhost:3000/attendance/bulk-mark
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "attendanceRecords": [
    {
      "studentId": "<STUDENT1_ID>",
      "moduleId": "<MODULE_ID>",
      "lectureId": "<LECTURE_ID>",
      "status": "present",
      "method": "face_recognition"
    },
    {
      "studentId": "<STUDENT2_ID>",
      "moduleId": "<MODULE_ID>",
      "lectureId": "<LECTURE_ID>",
      "status": "late",
      "method": "manual",
      "notes": "Arrived 10 minutes late"
    }
  ]
}
```

**Expected Response:**
```json
{
  "message": "Bulk attendance marked: 2 successful, 0 failed",
  "data": {
    "successful": [...],
    "failed": []
  },
  "error": null
}
```

---

### 6. Query Data

#### Get Student's Attendance Records

```bash
GET http://localhost:3000/attendance/my-attendance
Authorization: Bearer <STUDENT1_TOKEN>
```

#### Get Attendance Statistics for Student

```bash
GET http://localhost:3000/attendance/stats/my-stats
Authorization: Bearer <STUDENT1_TOKEN>
```

**Expected Response:**
```json
{
  "message": "Attendance statistics retrieved successfully",
  "data": {
    "total": 5,
    "present": 4,
    "absent": 0,
    "late": 1,
    "percentage": 100
  },
  "error": null
}
```

#### Get Module Attendance Statistics (Lecturer)

```bash
GET http://localhost:3000/attendance/stats/module/<MODULE_ID>
Authorization: Bearer <LECTURER_TOKEN>
```

#### Get Lecture Attendance List

```bash
GET http://localhost:3000/attendance/lecture/<LECTURE_ID>
Authorization: Bearer <LECTURER_TOKEN>
```

#### Get Student's Modules

```bash
GET http://localhost:3000/modules/my-modules
Authorization: Bearer <STUDENT1_TOKEN>
```

#### Get Upcoming Lectures

```bash
GET http://localhost:3000/lectures/upcoming
Authorization: Bearer <STUDENT1_TOKEN>
```

#### Get Today's Lectures

```bash
GET http://localhost:3000/lectures/today
Authorization: Bearer <LECTURER_TOKEN>
```

---

### 7. Update Operations

#### Update Lecture Status

```bash
PUT http://localhost:3000/lectures/<LECTURE_ID>
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "status": "completed",
  "attendanceMarked": true
}
```

#### Update Attendance Status

```bash
PUT http://localhost:3000/attendance/<ATTENDANCE_ID>
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "status": "present",
  "notes": "Status corrected"
}
```

#### Update Module Information

```bash
PUT http://localhost:3000/modules/<MODULE_ID>
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "lectureHall": "Room 401",
  "notes": "Room changed"
}
```

---

## Testing Error Cases

### 1. Unauthorized Access (No Token)

```bash
GET http://localhost:3000/modules
# WITHOUT Authorization header
```

**Expected Response:**
```json
{
  "message": "Invalid token",
  "data": null,
  "error": "Invalid token"
}
```

### 2. Invalid Credentials

```bash
POST http://localhost:3000/students/login
Content-Type: application/json

{
  "email": "wrong@example.com",
  "password": "wrongpassword"
}
```

**Expected Response:**
```json
{
  "message": "Invalid credentials",
  "data": null,
  "error": "Invalid credentials"
}
```

### 3. Validation Error

```bash
POST http://localhost:3000/students/signup
Content-Type: application/json

{
  "name": "Test",
  "email": "invalid-email",
  "password": "123"
}
```

**Expected Response:**
```json
{
  "message": "email must be a valid email, password must be at least 6 characters",
  "data": null,
  "error": "..."
}
```

### 4. Duplicate Attendance

Try marking attendance twice for the same student in the same lecture:

```bash
POST http://localhost:3000/attendance/mark
Authorization: Bearer <LECTURER_TOKEN>
Content-Type: application/json

{
  "studentId": "<STUDENT1_ID>",
  "moduleId": "<MODULE_ID>",
  "lectureId": "<LECTURE_ID>",
  "status": "present",
  "method": "manual"
}
```

**Expected Response:**
```json
{
  "message": "Attendance already marked for this lecture",
  "data": null,
  "error": "Attendance already marked for this lecture"
}
```

---

## Testing with Postman Collection

You can import this into Postman:

1. Create a new collection
2. Add environment variables:
   - `baseUrl`: http://localhost:3000
   - `lecturerToken`: (after login)
   - `studentToken`: (after login)
   - `moduleId`: (after creating module)
   - `lectureId`: (after creating lecture)

3. Use `{{baseUrl}}` and `{{lecturerToken}}` in requests

---

## Quick Verification Checklist

- [ ] Lecturer signup works
- [ ] Student signup works
- [ ] JWT tokens are generated
- [ ] Protected routes require authentication
- [ ] Module creation works
- [ ] Student enrollment works
- [ ] Lecture creation works
- [ ] Single attendance marking works
- [ ] Bulk attendance marking works
- [ ] Attendance statistics calculated correctly
- [ ] Attendance queries return proper data
- [ ] All responses follow standardized format
- [ ] Error handling works correctly
- [ ] Validation prevents invalid data
- [ ] Duplicate prevention works (attendance, modules, etc.)

---

## Database Verification

You can verify data in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use the database
use facio

# Check collections
show collections

# View data
db.students.find().pretty()
db.lecturers.find().pretty()
db.modules.find().pretty()
db.lectures.find().pretty()
db.attendances.find().pretty()

# Check attendance with populated data
db.attendances.aggregate([
  {
    $lookup: {
      from: "students",
      localField: "studentId",
      foreignField: "_id",
      as: "student"
    }
  }
])
```

---

## Sample Test Scenario

**Complete Flow:**

1. ✅ Register lecturer → Get token
2. ✅ Register 2 students → Get tokens
3. ✅ Lecturer creates module
4. ✅ Lecturer enrolls both students
5. ✅ Lecturer creates lecture for module
6. ✅ Lecturer marks attendance for both students
7. ✅ Student checks their attendance records
8. ✅ Student checks their statistics
9. ✅ Lecturer views lecture attendance list
10. ✅ Lecturer views module statistics

**All operations should return standardized responses with message, data, and error fields!**

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### MongoDB Connection Error
```bash
# Check MongoDB is running
mongosh

# If not running, start it
mongod
```

### JWT Token Expired
- Login again to get a new token
- Tokens expire after 24 hours

### Module Not Found Errors
- Make sure you're using the correct IDs
- Check that you saved the IDs from previous responses

---

## Next Steps

After testing the backend:

1. Integrate with React Native frontend
2. Implement face recognition on mobile
3. Add Bluetooth beacon detection
4. Create dashboards using the statistics endpoints
5. Add real-time attendance updates (WebSockets)
6. Implement attendance reports generation

---

**Happy Testing! 🎉**

