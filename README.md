
# TechieKraft - Educational Technology Platform

A full-featured education platform built with React, TypeScript, Django, and Express, designed to facilitate learning through interactive tools, virtual labs, and collaborative features.

## Features

- **User Authentication & Authorization**
  - Student, Teacher, and Parent roles
  - Secure login and registration
  - Profile management with image upload

- **Learning Management**
  - Course creation and management
  - Assignment submission and grading
  - Progress tracking and reporting
  - Virtual laboratories and interactive tools

- **Communication Tools**
  - Messaging system
  - Discussion forums
  - Parent-teacher communication
  - School announcements

- **Interactive Learning Tools**
  - Math Problem Solver
  - Essay Writing Assistant
  - Language Translator
  - Research Paper Generator
  - Grammar Coach
  - Vocabulary Builder
  - Study Schedule Planner

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Query
- React Hook Form

### Backend
- Django (Python)
- Express.js (Node.js)
- PostgreSQL
- REST APIs

## Project Structure

```
├── backend/           # Django backend
├── client/           # React frontend
├── server/           # Express server
├── shared/           # Shared types/schemas
└── db/               # Database configuration
```

## Getting Started

1. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt
```

2. Start the development servers:
```bash
# Start frontend development server
npm run dev

# Start Django backend
python backend/manage.py runserver

# Start Express server
npm run server
```

3. Access the application:
- Frontend: http://localhost:5000
- Django Admin: http://localhost:8000/admin
- API Documentation: http://localhost:8000/api/docs

## Environment Setup

The application requires the following environment variables:

```env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Courses
- GET `/api/courses` - List all courses
- POST `/api/courses` - Create new course
- GET `/api/courses/:id` - Get course details

### Assignments
- GET `/api/assignments` - List assignments
- POST `/api/assignments` - Create assignment
- PUT `/api/assignments/:id` - Update assignment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
