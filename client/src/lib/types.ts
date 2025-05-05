// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Course types
export interface Course {
  id: number;
  name: string;
  description: string | null;
  subjectId: number;
  teacherId: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  teacher?: User;
  subject?: Subject;
}

export interface Subject {
  id: number;
  name: string;
  description: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment types
export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  progress: number;
  enrolledAt: string;
  lastAccessedAt: string;
  course?: Course;
}

// Assignment types
export interface Assignment {
  id: number;
  title: string;
  description: string | null;
  courseId: number;
  dueDate: string;
  estimatedTime: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  course?: Course;
}

// Message types
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean;
  sentAt: string;
  readAt: string | null;
  sender?: User;
  receiver?: User;
}

// Learning tool types
export interface LearningTool {
  id: number;
  name: string;
  description: string | null;
  category: string;
  iconClass: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

// Session types
export interface Session {
  authenticated: boolean;
  user?: User;
}
