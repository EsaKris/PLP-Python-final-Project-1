// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  profile_image: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  full_name?: string;
}

export type UserRole = 'student' | 'teacher' | 'admin_teacher' | 'parent' | 'admin';

export interface Teacher extends User {
  subject_specialization: string | null;
  years_of_experience: number | null;
}

export interface Student extends User {
  grade_level: string | null;
}

export interface Parent extends User {
  children: Student[];
}

// Course Types
export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  subject_id: number;
  teacher_id: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  teacher?: Teacher;
  subject?: Subject;
  modules?: Module[];
}

export interface Subject {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  course_id: number;
  order: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrollment_date: string;
  progress: number;
  status: 'active' | 'completed' | 'dropped';
  created_at: string;
  updated_at: string;
  student?: Student;
  course?: Course;
}

// Assignment Types
export interface Assignment {
  id: number;
  title: string;
  description: string;
  course_id: number | null;
  teacher_id: number;
  due_date: string;
  points_possible: number;
  assignment_type: 'quiz' | 'essay' | 'project' | 'practice';
  created_at: string;
  updated_at: string;
  teacher?: Teacher;
  course?: Course;
  submissions?: Submission[];
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_date: string;
  content: string;
  file_url: string | null;
  grade: number | null;
  feedback: string | null;
  status: 'submitted' | 'graded' | 'late';
  created_at: string;
  updated_at: string;
  student?: Student;
  assignment?: Assignment;
}

// Messaging Types
export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
  recipient?: User;
}

// Forum Types
export interface ForumTopic {
  id: number;
  title: string;
  description: string;
  created_by: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  created_by_user?: User;
  posts_count?: number;
  latest_post?: ForumPost;
}

export interface ForumPost {
  id: number;
  topic_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Lab Types
export interface Lab {
  id: number;
  title: string;
  description: string;
  lab_type: 'science' | 'math' | 'programming' | 'language';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  subject_id: number | null;
  created_at: string;
  updated_at: string;
  subject?: Subject;
}

// Learning Tool Types
export interface LearningTool {
  id: number;
  name: string;
  description: string;
  tool_type: string;
  url: string;
  icon: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface LoginFormValues {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
  role: UserRole;
  phone_number?: string;
  date_of_birth?: string;
}

export interface PasswordChangeFormValues {
  old_password: string;
  new_password: string;
  new_password2: string;
}

export interface ProfileUpdateFormValues {
  first_name: string;
  last_name: string;
  bio?: string;
  phone_number?: string;
  date_of_birth?: string;
  subject_specialization?: string;
  years_of_experience?: number;
  grade_level?: string;
  profile_image?: File;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Auth Types
export interface SessionResponse {
  authenticated: boolean;
  user?: User;
}