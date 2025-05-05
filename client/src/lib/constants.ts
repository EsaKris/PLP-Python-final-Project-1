// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    SESSION: '/api/auth/session',
    PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile/update',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  COURSES: {
    LIST: '/api/courses',
    DETAIL: (id: number) => `/api/courses/${id}`,
    ENROLL: (id: number) => `/api/courses/${id}/enroll`,
    MY_COURSES: '/api/courses/enrolled',
  },
  ASSIGNMENTS: {
    LIST: '/api/assignments',
    DETAIL: (id: number) => `/api/assignments/${id}`,
    MY_ASSIGNMENTS: '/api/assignments/my-assignments',
    SUBMIT: (id: number) => `/api/assignments/${id}/submit`,
  },
  MESSAGES: {
    LIST: '/api/messages',
    DETAIL: (id: number) => `/api/messages/${id}`,
    SEND: '/api/messages/send',
    UNREAD_COUNT: '/api/messages/unread-count',
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: (id: number) => `/api/users/${id}`,
    TEACHERS: '/api/users/teachers',
    STUDENTS: '/api/users/students',
  },
  FORUM: {
    TOPICS: '/api/forum/topics',
    TOPIC_DETAIL: (id: number) => `/api/forum/topics/${id}`,
    POSTS: '/api/forum/posts',
    POST_DETAIL: (id: number) => `/api/forum/posts/${id}`,
  },
  LABS: {
    LIST: '/api/labs',
    DETAIL: (id: number) => `/api/labs/${id}`,
  },
  TOOLS: {
    LIST: '/api/tools',
    MATH_SOLVER: '/api/tools/math-solver',
    WRITING_ASSISTANT: '/api/tools/writing-assistant',
    LANGUAGE_TRANSLATOR: '/api/tools/language-translator',
  }
};

// Subject Areas
export const SUBJECT_AREAS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'programming', label: 'Programming' },
  { value: 'english', label: 'English' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'art', label: 'Art' },
  { value: 'music', label: 'Music' },
  { value: 'physical_education', label: 'Physical Education' },
  { value: 'languages', label: 'Languages' },
];

// Course Levels
export const COURSE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

// Assignment Statuses
export const ASSIGNMENT_STATUSES = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'graded', label: 'Graded' },
  { value: 'late', label: 'Late' },
];

// User Roles
export const USER_ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin_teacher', label: 'Admin Teacher' },
  { value: 'parent', label: 'Parent' },
  { value: 'admin', label: 'Admin' },
];

// Grade Levels
export const GRADE_LEVELS = [
  { value: 'elementary', label: 'Elementary School' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high', label: 'High School' },
  { value: 'college', label: 'College/University' },
  { value: 'professional', label: 'Professional Development' },
];

// Forum Categories
export const FORUM_CATEGORIES = [
  { value: 'general', label: 'General Discussion' },
  { value: 'course_specific', label: 'Course Specific' },
  { value: 'homework_help', label: 'Homework Help' },
  { value: 'technical_support', label: 'Technical Support' },
  { value: 'events', label: 'Events & Announcements' },
];

// Learning Tool Types
export const LEARNING_TOOL_TYPES = [
  { value: 'math_solver', label: 'Math Problem Solver' },
  { value: 'writing_assistant', label: 'Writing Assistant' },
  { value: 'language_translator', label: 'Language Translator' },
  { value: 'formula_calculator', label: 'Formula Calculator' },
  { value: 'citation_generator', label: 'Citation Generator' },
];

// Virtual Lab Types
export const VIRTUAL_LAB_TYPES = [
  { value: 'chemistry', label: 'Chemistry Lab' },
  { value: 'physics', label: 'Physics Lab' },
  { value: 'biology', label: 'Biology Lab' },
  { value: 'computer_science', label: 'Computer Science Lab' },
  { value: 'engineering', label: 'Engineering Lab' },
];

// Duration options (in minutes)
export const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

// Message types
export const MESSAGE_TYPES = [
  { value: 'direct', label: 'Direct Message' },
  { value: 'course_announcement', label: 'Course Announcement' },
  { value: 'system_notification', label: 'System Notification' },
];

// Navigation items for sidebar/navbar by role
export const NAVIGATION_ITEMS = {
  // Common items for all roles
  common: [
    { 
      label: 'Dashboard', 
      href: '/home',
      icon: 'LayoutDashboard'
    },
    { 
      label: 'Messages', 
      href: '/messages',
      icon: 'MessageSquare' 
    },
    { 
      label: 'Profile', 
      href: '/profile',
      icon: 'User' 
    },
    { 
      label: 'Settings', 
      href: '/settings',
      icon: 'Settings' 
    },
  ],
  
  // Student-specific items
  student: [
    { 
      label: 'My Courses', 
      href: '/courses',
      icon: 'GraduationCap' 
    },
    { 
      label: 'Assignments', 
      href: '/assignments',
      icon: 'FileText' 
    },
    { 
      label: 'Grades', 
      href: '/grades',
      icon: 'BarChart' 
    },
    { 
      label: 'Forums', 
      href: '/forums',
      icon: 'MessageCircle' 
    },
    { 
      label: 'Virtual Labs', 
      href: '/labs',
      icon: 'Beaker' 
    },
    { 
      label: 'Learning Tools', 
      href: '/tools',
      icon: 'Wrench' 
    },
  ],
  
  // Teacher-specific items
  teacher: [
    { 
      label: 'My Courses', 
      href: '/courses',
      icon: 'GraduationCap' 
    },
    { 
      label: 'Create Course', 
      href: '/courses/create',
      icon: 'PlusCircle' 
    },
    { 
      label: 'Assignments', 
      href: '/assignments',
      icon: 'FileText' 
    },
    { 
      label: 'Create Assignment', 
      href: '/assignments/create',
      icon: 'FilePlus' 
    },
    { 
      label: 'Grade Book', 
      href: '/grades',
      icon: 'ClipboardCheck' 
    },
    { 
      label: 'Students', 
      href: '/students',
      icon: 'Users' 
    },
    { 
      label: 'Forums', 
      href: '/forums',
      icon: 'MessageCircle' 
    },
    { 
      label: 'Classes', 
      href: '/classes',
      icon: 'Layout' 
    },
  ],
  
  // Admin teacher additional items
  admin_teacher: [
    { 
      label: 'Admin Panel', 
      href: '/admin',
      icon: 'Shield' 
    },
    {
      label: 'Teachers', 
      href: '/teachers',
      icon: 'UserCheck' 
    },
  ],
  
  // Parent-specific items
  parent: [
    { 
      label: 'My Children', 
      href: '/children',
      icon: 'Users' 
    },
    { 
      label: 'Progress Reports', 
      href: '/progress',
      icon: 'TrendingUp' 
    },
    { 
      label: 'Parent Forums', 
      href: '/parent-forums',
      icon: 'MessageCircle' 
    },
    { 
      label: 'Teacher Meetings', 
      href: '/meetings',
      icon: 'Calendar' 
    },
    { 
      label: 'School Announcements', 
      href: '/announcements',
      icon: 'Bell' 
    },
  ],
  
  // Admin-specific items
  admin: [
    { 
      label: 'Admin Dashboard', 
      href: '/admin',
      icon: 'Shield' 
    },
    { 
      label: 'Manage Users', 
      href: '/admin/users',
      icon: 'Users' 
    },
    { 
      label: 'Manage Courses', 
      href: '/admin/courses',
      icon: 'BookOpen' 
    },
    { 
      label: 'System Settings', 
      href: '/admin/settings',
      icon: 'Settings' 
    },
    { 
      label: 'Reports', 
      href: '/admin/reports',
      icon: 'BarChart2' 
    },
  ],
};