/**
 * API endpoint constants
 */
export const API_ENDPOINTS = {
  AUTH: {
    SESSION: '/api/auth/session',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile'
  },
  COURSES: {
    LIST: '/api/courses',
    DETAILS: (id: number) => `/api/courses/${id}`,
    ENROLL: '/api/enrollments',
    MY_COURSES: '/api/courses/my-courses',
    MODULES: (courseId: number) => `/api/courses/${courseId}/modules`,
    PROGRESS: (enrollmentId: number) => `/api/enrollments/${enrollmentId}/progress`
  },
  ASSIGNMENTS: {
    LIST: '/api/assignments',
    DETAILS: (id: number) => `/api/assignments/${id}`,
    SUBMIT: (id: number) => `/api/assignments/${id}/submit`,
    MY_ASSIGNMENTS: '/api/assignments/my-assignments',
    SUBMISSIONS: (id: number) => `/api/assignments/${id}/submissions`
  },
  MESSAGES: {
    LIST: '/api/messages',
    SEND: '/api/messages/send',
    DETAILS: (id: number) => `/api/messages/${id}`,
    MARK_READ: (id: number) => `/api/messages/${id}/read`
  },
  FORUMS: {
    LIST: '/api/forums',
    TOPICS: (forumId: number) => `/api/forums/${forumId}/topics`,
    POSTS: (topicId: number) => `/api/topics/${topicId}/posts`,
    CREATE_TOPIC: '/api/topics',
    CREATE_POST: (topicId: number) => `/api/topics/${topicId}/posts`,
  },
  LABS: {
    LIST: '/api/labs',
    DETAILS: (id: number) => `/api/labs/${id}`,
    MY_LABS: '/api/labs/my-labs',
  },
  TOOLS: {
    LIST: '/api/tools',
    DETAILS: (id: number) => `/api/tools/${id}`,
  }
};

/**
 * Navigation constants
 */
export const NAVIGATION_ITEMS = [
  { title: 'Home', href: '/home', icon: 'Home' },
  { title: 'Courses', href: '/courses', icon: 'BookOpen' },
  { title: 'Assignments', href: '/assignments', icon: 'FileText' },
  { title: 'Messages', href: '/messages', icon: 'MessageSquare' },
  { title: 'Forums', href: '/forums', icon: 'MessageCircle' },
  { title: 'Virtual Labs', href: '/labs', icon: 'Flask' },
  { title: 'Learning Tools', href: '/tools', icon: 'Tool' },
];

/**
 * User role constants
 */
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN_TEACHER: 'admin_teacher',
  PARENT: 'parent',
  ADMIN: 'admin',
};

/**
 * Assignment constants
 */
export const ASSIGNMENT_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
};

/**
 * Course constants
 */
export const COURSE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

/**
 * Subject constants
 */
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

/**
 * Grade level constants
 */
export const GRADE_LEVELS = [
  { value: 'elementary', label: 'Elementary (Grades 1-5)' },
  { value: 'middle_school', label: 'Middle School (Grades 6-8)' },
  { value: 'high_school', label: 'High School (Grades 9-12)' },
  { value: 'college', label: 'College/University' },
  { value: 'professional', label: 'Professional Development' },
];