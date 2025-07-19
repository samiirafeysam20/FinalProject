# ExamPro - Exam Management System

A comprehensive exam management system built with Spring Boot backend and React frontend.

## 🚀 Features

### Backend (Spring Boot)
- **Authentication & Authorization**: JWT-based security with role-based access control
- **User Management**: Admin, Teacher, and Student roles
- **Question Bank**: Create and manage questions with different types (Multiple Choice, True/False, Essay, Short Answer)
- **Exam Management**: Create, schedule, and manage exams
- **Attempt Tracking**: Track student exam attempts and submissions
- **Grading System**: Automated and manual grading capabilities
- **RESTful APIs**: Comprehensive API endpoints for all functionalities

### Frontend (React + TypeScript)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Role-based Dashboards**: Customized interfaces for Admin, Teacher, and Student
- **Real-time Exam Taking**: Interactive exam interface with timer and progress tracking
- **Question Management**: CRUD operations for question bank
- **Results & Analytics**: Comprehensive reporting and analytics
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠 Technology Stack

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Security (JWT Authentication)
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React (Icons)
- Vite

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## 🚀 Getting Started

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exam-management-system
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE exam_management_db;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE exam_management_db TO postgres;
   ```

3. **Configure Application Properties**
   Update `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/exam_management_db
       username: postgres
       password: password
   ```

4. **Run the Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 🔐 Default Users

The system comes with demo accounts for testing:

- **Admin**: username: `admin`, password: `admin123`
- **Teacher**: username: `teacher`, password: `teacher123`
- **Student**: username: `student`, password: `student123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### User Management (Admin)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/role/{role}` - Get users by role
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

### Question Management (Teacher/Admin)
- `GET /api/teacher/questions` - Get questions
- `POST /api/teacher/questions` - Create question
- `PUT /api/teacher/questions/{id}` - Update question
- `DELETE /api/teacher/questions/{id}` - Delete question

### Exam Management (Teacher/Admin)
- `GET /api/teacher/exams` - Get exams
- `POST /api/teacher/exams` - Create exam
- `PUT /api/teacher/exams/{id}` - Update exam
- `DELETE /api/teacher/exams/{id}` - Delete exam

### Student Endpoints
- `GET /api/student/exams/active` - Get active exams
- `POST /api/student/exams/{examId}/start` - Start exam
- `PUT /api/student/attempts/{attemptId}` - Update attempt
- `POST /api/student/attempts/{attemptId}/submit` - Submit exam

## 🏗 Project Structure

```
exam-management-system/
├── backend/
│   ├── src/main/java/com/exammanagement/
│   │   ├── controller/          # REST Controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── model/               # JPA Entities
│   │   ├── repository/          # Data Repositories
│   │   ├── security/            # Security Configuration
│   │   └── service/             # Business Logic
│   └── src/main/resources/
│       └── application.yml      # Configuration
├── frontend/
│   ├── src/
│   │   ├── components/          # React Components
│   │   ├── contexts/            # React Contexts
│   │   ├── services/            # API Services
│   │   ├── types/               # TypeScript Types
│   │   └── App.tsx              # Main App Component
│   ├── public/                  # Static Assets
│   └── package.json             # Dependencies
└── README.md
```

## 🎨 Features Overview

### Admin Dashboard
- User management and statistics
- System-wide analytics
- Exam and question oversight
- System health monitoring

### Teacher Dashboard
- Exam creation and management
- Question bank management
- Student progress tracking
- Grading interface

### Student Dashboard
- Available and upcoming exams
- Exam taking interface
- Results and performance tracking
- Progress analytics

## 🔧 Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

#### Backend
```bash
cd backend
mvn clean package
java -jar target/exam-management-backend-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- Tailwind CSS for the utility-first CSS framework
- Lucide React for the beautiful icons