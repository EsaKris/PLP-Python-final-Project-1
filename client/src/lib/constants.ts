// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SESSION: '/api/auth/session',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  USERS: {
    ME: '/api/users/me',
  },
  COURSES: {
    LIST: '/api/courses',
    DETAIL: (id: number) => `/api/courses/${id}`,
  },
  ENROLLMENTS: {
    LIST: '/api/enrollments',
  },
  ASSIGNMENTS: {
    LIST: '/api/assignments',
    CREATE: '/api/assignments',
  },
  MESSAGES: {
    LIST: '/api/messages',
    CREATE: '/api/messages',
  },
  LEARNING_TOOLS: {
    LIST: '/api/learning-tools',
  },
};

// Navigation items
export const NAVIGATION_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'fas fa-home' },
  { path: '/courses', label: 'My Courses', icon: 'fas fa-book' },
  { path: '/assignments', label: 'Assignments', icon: 'fas fa-tasks' },
  { path: '/messages', label: 'Messages', icon: 'fas fa-comment-alt' },
];

// Sidebar categories
export const SIDEBAR_CATEGORIES = {
  LEARNING: {
    title: 'Your Learning',
    items: [
      { path: '/courses', label: 'My Courses', icon: 'fas fa-book' },
      { path: '/assignments', label: 'Assignments', icon: 'fas fa-tasks' },
      { path: '/progress', label: 'Progress', icon: 'fas fa-chart-line' },
      { path: '/achievements', label: 'Achievements', icon: 'fas fa-award' },
    ],
  },
  COMMUNICATION: {
    title: 'Communication',
    items: [
      { path: '/messages', label: 'Messages', icon: 'fas fa-comment-alt' },
      { path: '/forums', label: 'Discussion Forums', icon: 'fas fa-users' },
      { path: '/schedule', label: 'Schedule', icon: 'fas fa-calendar-alt' },
    ],
  },
  TOOLS: {
    title: 'Tools',
    items: [
      { path: '/tools/virtual-labs', label: 'Virtual Labs', icon: 'fas fa-flask' },
      { path: '/tools/writing-workshop', label: 'Writing Workshop', icon: 'fas fa-pen-alt' },
      { path: '/tools/language-tools', label: 'Language Tools', icon: 'fas fa-language' },
      { path: '/tools/math-solver', label: 'Math Problem Solver', icon: 'fas fa-calculator' },
    ],
  },
};

// Tool categories
export const TOOL_CATEGORIES = {
  VIRTUAL_LABS: 'virtual_labs',
  WRITING_WORKSHOP: 'writing_workshop',
  LANGUAGE_TOOLS: 'language_tools',
  MATH_SOLVER: 'math_solver',
};

// Date format options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

// Time format options
export const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};
