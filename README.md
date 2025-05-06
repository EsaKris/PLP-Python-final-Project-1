<div align="center">
  <br />
  <img src="[https://raw.githubusercontent.com/EsaKris/TechieKraft/main/generated-icon.png](https://github.com/EsaKris/PLP-Python-final-Project-1/blob/main/generated-icon.png)" alt="TechieKraft Logo" width="80%" style="border-radius: 50px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Django-black?style=for-the-badge&logoColor=white&logo=django&color=092E20" alt="django" />
    <img src="https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=nodedotjs&color=339933" alt="node.js" />
    <img src="https://img.shields.io/badge/-Express-black?style=for-the-badge&logoColor=white&logo=express&color=000000" alt="express.js" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="postgresql" />
  </div>

  <h1 align="center">PLP ACADEMY PYTHON PROJECT - Educational Technology Platform</h1>
  <p align="center">
    A full-featured education platform built with React, TypeScript, Django, and Express, designed to facilitate learning through interactive tools, virtual labs, and collaborative features.
  </p>
</div>

## 🌟 Features

### 👤 User Authentication & Authorization
- Student, Teacher, and Parent roles
- Secure login and registration
- Profile management with image upload

### 📚 Learning Management
- Course creation and management
- Assignment submission and grading
- Progress tracking and reporting
- Virtual laboratories and interactive tools

### 💬 Communication Tools
- Messaging system
- Discussion forums
- Parent-teacher communication
- School announcements

### 🛠 Interactive Learning Tools
- Math Problem Solver
- Essay Writing Assistant
- Language Translator
- Research Paper Generator
- Grammar Coach
- Vocabulary Builder
- Study Schedule Planner

## 🛠 Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui Components
- **State Management**: React Query
- **Forms**: React Hook Form
- **Build Tool**: Vite

### Backend
- **API**: Django REST Framework
- **Server**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT & Session-based

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- PostgreSQL 12+
- npm/yarn

### Installation
```bash
# Clone the repository
git clone hhttps://github.com/EsaKris/PLP-Python-final-Project-1.git


# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Install server dependencies
cd ../server
npm install
```

### Configuration
1. Create `.env` files in each directory (client, backend, server) following the `.env.example` templates
2. Set up your PostgreSQL database
3. Configure environment variables

### Running the Application
```bash
# Start Django backend (port 8000)
cd backend && python manage.py runserver

# Start Express server (port 5000)
cd ../server && npm run server

# Start React frontend (port 3000)
cd ../client && npm run dev
```

## 📂 Project Structure

```
├── backend/           # Django backend
│   ├── core/          # Main application logic
│   ├── users/         # Authentication system
│   ├── courses/       # Learning management
│   └── manage.py      # Django CLI
│
├── client/           # React frontend
│   ├── public/        # Static assets
│   ├── src/           # Application code
│   │   ├── api/       # API services
│   │   ├── components # UI components
│   │   ├── pages/     # Route components
│   │   └── styles/    # Global styles
│
├── server/           # Express server
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   └── routes/        # API endpoints
│
├── shared/           # Shared types/schemas
└── db/               # Database configuration
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment
- `GET /api/assignments/:id/submissions` - Get submissions

## 🔧 Environment Variables

The application requires the following environment variables:

```env
# Django
DATABASE_URL=postgresql://....
SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Node.js
NODE_ENV=development
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql:....

# React
VITE_API_BASE_URL=http://localhost:8000
VITE_SERVER_BASE_URL=http://localhost:5000
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our style guidelines:
- Frontend: ESLint + Prettier configuration
- Backend: PEP 8 style guide
- Meaningful commit messages
- Include tests for new features


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Connect With Me

<div align="center">
  <a href="https://www.linkedin.com/in/ekre-christian-18008b299/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="https://github.com/EsaKris/" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="mailto:stylezgraphics@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
  </a>
</div>



<div align="center">
  Made with ❤️ by Esa Kris | © 2023 TechieKraft
</div>
