import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, ASSIGNMENT_STATUSES } from '@/lib/constants';
import { defaultFetcher } from '@/lib/query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck,
  Calendar, 
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  FileUp,
  Users,
  PenLine,
  ClipboardCheck,
  BarChart2,
  Download,
  FileEdit,
  ChevronRight,
  GraduationCap,
  PlusCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define interfaces for our data
interface Assignment {
  id: number;
  title: string;
  course: string;
  courseId: number;
  dueDate: string;
  assignedDate: string;
  status: string;
  points: number;
  earnedPoints: number | null;
  description: string;
  studentId?: number;
  studentName?: string;
  submissionDate?: string;
  submissionCount?: number;
  totalStudents?: number;
  grade?: string;
}

interface TeacherAssignment extends Assignment {
  className: string;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
}

// Component for the main Assignments page
export default function AssignmentsPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  const [activeTab, setActiveTab] = useState(userRole === 'teacher' || userRole === 'admin_teacher' ? 'assigned' : 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  // Fetch assignments
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.ASSIGNMENTS.MY_ASSIGNMENTS],
    queryFn: defaultFetcher,
    retry: false,
  });

  // Different example data based on role
  const studentAssignmentData: Assignment[] = [
    {
      id: 1,
      title: 'Programming Assignment: Loops and Arrays',
      course: 'Introduction to Programming',
      courseId: 1,
      dueDate: '2025-05-12',
      assignedDate: '2025-05-01',
      status: 'in_progress',
      points: 100,
      earnedPoints: null,
      description: 'Implement various loop structures and array manipulations in Python.'
    },
    {
      id: 2,
      title: 'Math Problem Set: Calculus',
      course: 'Advanced Mathematics',
      courseId: 2,
      dueDate: '2025-05-10',
      assignedDate: '2025-05-01',
      status: 'not_started',
      points: 50,
      earnedPoints: null,
      description: 'Solve the attached calculus problems involving derivatives and integrals.'
    },
    {
      id: 3,
      title: 'Essay: Shakespeare Analysis',
      course: 'English Literature Classics',
      courseId: 3,
      dueDate: '2025-05-08',
      assignedDate: '2025-04-25',
      status: 'submitted',
      points: 80,
      earnedPoints: null,
      submissionDate: '2025-05-05',
      description: 'Write a 1500-word analysis of symbolism in Shakespeare\'s Macbeth.'
    },
    {
      id: 4,
      title: 'Physics Lab Report',
      course: 'Physics Fundamentals',
      courseId: 4,
      dueDate: '2025-04-30',
      assignedDate: '2025-04-15',
      status: 'graded',
      points: 120,
      earnedPoints: 108,
      grade: 'A-',
      submissionDate: '2025-04-28',
      description: 'Document your findings from the momentum conservation experiment.'
    },
    {
      id: 5,
      title: 'History Research Paper',
      course: 'World History Overview',
      courseId: 5,
      dueDate: '2025-05-15',
      assignedDate: '2025-04-20',
      status: 'in_progress',
      points: 150,
      earnedPoints: null,
      description: 'Research and write a paper on a significant event from World War II.'
    },
    {
      id: 6,
      title: 'Web Development Project',
      course: 'Web Development Bootcamp',
      courseId: 6,
      dueDate: '2025-05-20',
      assignedDate: '2025-04-28',
      status: 'not_started',
      points: 200,
      earnedPoints: null,
      description: 'Build a responsive portfolio website using HTML, CSS, and JavaScript.'
    },
  ];

  const teacherAssignmentData: TeacherAssignment[] = [
    {
      id: 1,
      title: 'Programming Assignment: Loops and Arrays',
      course: 'Introduction to Programming',
      courseId: 1,
      className: 'CS101',
      dueDate: '2025-05-12',
      assignedDate: '2025-05-01',
      status: 'active',
      points: 100,
      earnedPoints: null,
      totalStudents: 28,
      submittedCount: 12,
      gradedCount: 8,
      description: 'Implement various loop structures and array manipulations in Python.'
    },
    {
      id: 2,
      title: 'Data Structures Quiz',
      course: 'Data Structures',
      courseId: 2,
      className: 'CS202',
      dueDate: '2025-05-10',
      assignedDate: '2025-05-01',
      status: 'active',
      points: 50,
      earnedPoints: null,
      totalStudents: 22,
      submittedCount: 18,
      gradedCount: 14,
      description: 'Quiz covering linked lists, stacks, queues, and trees.'
    },
    {
      id: 3,
      title: 'Algorithm Analysis',
      course: 'Algorithms',
      courseId: 3,
      className: 'CS301',
      dueDate: '2025-05-08',
      assignedDate: '2025-04-25',
      status: 'active',
      points: 80,
      earnedPoints: null,
      totalStudents: 18,
      submittedCount: 12,
      gradedCount: 0,
      description: 'Analyze the time and space complexity of various sorting algorithms.'
    },
    {
      id: 4,
      title: 'Final Project: Compiler Design',
      course: 'Programming Languages',
      courseId: 4,
      className: 'CS401',
      dueDate: '2025-04-30',
      assignedDate: '2025-04-15',
      status: 'closed',
      points: 120,
      earnedPoints: null,
      totalStudents: 15,
      submittedCount: 15,
      gradedCount: 15,
      description: 'Build a simple compiler for a subset of the C programming language.'
    },
    {
      id: 5,
      title: 'Database Normalization',
      course: 'Database Systems',
      courseId: 5,
      className: 'CS305',
      dueDate: '2025-05-15',
      assignedDate: '2025-04-20',
      status: 'draft',
      points: 150,
      earnedPoints: null,
      totalStudents: 25,
      submittedCount: 0,
      gradedCount: 0,
      description: 'Normalize a given database schema to 3NF.'
    },
  ];

  // Get appropriate assignment data
  const assignments = userRole === 'teacher' || userRole === 'admin_teacher' 
    ? teacherAssignmentData 
    : studentAssignmentData;

  // Get courses for filtering
  const courses = Array.from(new Set(assignments.map(assignment => assignment.course))).map(
    name => {
      const courseAssignment = assignments.find(a => a.course === name);
      return { name, id: courseAssignment?.courseId || 0 };
    }
  );

  // Filter and search assignments
  const filteredAssignments = assignments.filter(assignment => {
    // Filter by search
    const searchMatch = 
      searchQuery === '' ||
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by course
    const courseMatch = courseFilter === 'all' || assignment.courseId.toString() === courseFilter;
    
    // Filter by tab
    let tabMatch = true;
    if (userRole === 'teacher' || userRole === 'admin_teacher') {
      // Teacher tab filtering
      if (activeTab === 'assigned') tabMatch = assignment.status === 'active';
      else if (activeTab === 'draft') tabMatch = assignment.status === 'draft';
      else if (activeTab === 'closed') tabMatch = assignment.status === 'closed';
    } else {
      // Student tab filtering
      if (activeTab === 'all') tabMatch = true;
      else if (activeTab === 'pending') tabMatch = ['not_started', 'in_progress'].includes(assignment.status);
      else if (activeTab === 'submitted') tabMatch = assignment.status === 'submitted';
      else if (activeTab === 'graded') tabMatch = assignment.status === 'graded';
    }
    
    return searchMatch && courseMatch && tabMatch;
  });

  function getStatusBadge(status: string) {
    if (userRole === 'teacher' || userRole === 'admin_teacher') {
      switch (status) {
        case 'active':
          return <Badge className="status-badge-active">Active</Badge>;
        case 'draft':
          return <Badge className="status-badge-draft">Draft</Badge>;
        case 'closed':
          return <Badge className="status-badge-completed">Closed</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    } else {
      switch (status) {
        case 'not_started':
          return <Badge className="status-badge-draft">Not Started</Badge>;
        case 'in_progress':
          return <Badge className="status-badge-active">In Progress</Badge>;
        case 'submitted':
          return <Badge className="status-badge-pending">Submitted</Badge>;
        case 'graded':
          return <Badge className="status-badge-completed">Graded</Badge>;
        case 'late':
          return <Badge className="status-badge-overdue">Late</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    }
  }

  function getStatusIcon(status: string) {
    if (userRole === 'teacher' || userRole === 'admin_teacher') {
      switch (status) {
        case 'active':
          return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
        case 'draft':
          return <FileEdit className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
        case 'closed':
          return <ClipboardCheck className="h-5 w-5 text-green-600 dark:text-green-400" />;
        default:
          return <FileText className="h-5 w-5" />;
      }
    } else {
      switch (status) {
        case 'not_started':
          return <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
        case 'in_progress':
          return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
        case 'submitted':
          return <FileCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
        case 'graded':
          return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
        case 'late':
          return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
        default:
          return <FileText className="h-5 w-5" />;
      }
    }
  }

  // Calculate due date urgency
  function getDueDateClass(dueDate: string) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 dark:text-red-400'; // Past due
    if (diffDays <= 3) return 'text-amber-600 dark:text-amber-400'; // Due soon
    return 'text-gray-600 dark:text-gray-400'; // Regular
  }

  // Render based on role
  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === 'teacher' || userRole === 'admin_teacher' ? 'Manage Assignments' : 'My Assignments'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'teacher' || userRole === 'admin_teacher' 
              ? 'Create, assign, and grade student assignments' 
              : 'View and complete your course assignments'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {userRole === 'teacher' || userRole === 'admin_teacher' ? (
            <Button 
              onClick={() => navigate('/assignments/create')}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Assignment
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {}}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Calendar View
            </Button>
          )}
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={courseFilter} 
            onValueChange={setCourseFilter}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Courses</SelectLabel>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation - Different for teachers and students */}
      <Tabs 
        defaultValue={userRole === 'teacher' || userRole === 'admin_teacher' ? 'assigned' : 'all'} 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        {userRole === 'teacher' || userRole === 'admin_teacher' ? (
          // Teacher tabs
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="assigned">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        ) : (
          // Student tabs
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>
        )}

        {/* Tab content - use conditional rendering based on role */}
        <div className="mt-6">
          {userRole === 'teacher' || userRole === 'admin_teacher' ? (
            // Teacher content
            <>
              <TabsContent value="assigned" className="m-0">
                <TeacherAssignmentList 
                  assignments={filteredAssignments as TeacherAssignment[]} 
                  getStatusBadge={getStatusBadge}
                  getStatusIcon={getStatusIcon}
                  getDueDateClass={getDueDateClass}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="draft" className="m-0">
                <TeacherAssignmentList 
                  assignments={filteredAssignments as TeacherAssignment[]} 
                  getStatusBadge={getStatusBadge}
                  getStatusIcon={getStatusIcon}
                  getDueDateClass={getDueDateClass}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="closed" className="m-0">
                <TeacherAssignmentList 
                  assignments={filteredAssignments as TeacherAssignment[]} 
                  getStatusBadge={getStatusBadge}
                  getStatusIcon={getStatusIcon}
                  getDueDateClass={getDueDateClass}
                  navigate={navigate}
                />
              </TabsContent>
            </>
          ) : (
            // Student content
            <>
              <TabsContent value="all" className="m-0">
                <StudentAssignmentList 
                  assignments={filteredAssignments} 
                  getStatusBadge={getStatusBadge}
                  getStatusIcon={getStatusIcon}
                  getDueDateClass={getDueDateClass}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="pending" className="m-0">
                <StudentAssignmentList 
                  assignments={filteredAssignments} 
                  getStatusBadge={getStatusBadge}
                  getStatusIcon={getStatusIcon}
                  getDueDateClass={getDueDateClass}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="submitted" className="m-0">
                <StudentAssignmentList 
                  assignments={filteredAssignments} 
                  getStatusBadge={getStatusBadge}
                  getStatusIcon={getStatusIcon}
                  getDueDateClass={getDueDateClass}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="graded" className="m-0">
                <StudentAssignmentList 
                  assignments={filteredAssignments} 
                  getStatusBadge={getStatusBadge}
                  getStatusIcon={getStatusIcon}
                  getDueDateClass={getDueDateClass}
                  navigate={navigate}
                />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>

      {/* Empty state when no results */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No assignments found</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? 'Try adjusting your search term or filters.'
              : activeTab === 'all' || activeTab === 'assigned'
                ? `You don't have any ${activeTab === 'assigned' ? 'active' : ''} assignments yet` 
                : `You don't have any ${activeTab} assignments`}
          </p>
          
          {(userRole === 'teacher' || userRole === 'admin_teacher') && 
           (activeTab === 'assigned' || activeTab === 'draft') && (
            <Button onClick={() => navigate('/assignments/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Assignment
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Student Assignment List Component
interface StudentAssignmentListProps {
  assignments: Assignment[];
  getStatusBadge: (status: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getDueDateClass: (dueDate: string) => string;
  navigate: (to: string) => void;
}

function StudentAssignmentList({ 
  assignments, 
  getStatusBadge, 
  getStatusIcon, 
  getDueDateClass,
  navigate 
}: StudentAssignmentListProps) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card 
          key={assignment.id} 
          className="overflow-hidden border-l-4 hover:border-primary transition-colors cursor-pointer"
          style={{
            borderLeftColor: assignment.status === 'graded' 
              ? 'var(--success)' 
              : assignment.status === 'submitted' 
                ? 'var(--warning)' 
                : assignment.status === 'in_progress'
                  ? 'var(--info)'
                  : 'var(--muted)'
          }}
          onClick={() => navigate(`/assignments/${assignment.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="mt-0.5">
                  {getStatusIcon(assignment.status)}
                </div>
                <div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {assignment.course}
                  </CardDescription>
                </div>
              </div>
              <div>
                {getStatusBadge(assignment.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {assignment.description.length > 120 
                ? `${assignment.description.substring(0, 120)}...` 
                : assignment.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <div className="flex space-x-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Points: </span>
                  <span className="font-medium">
                    {assignment.status === 'graded' 
                      ? `${assignment.earnedPoints}/${assignment.points}` 
                      : assignment.points}
                  </span>
                </div>
                {assignment.status === 'graded' && assignment.grade && (
                  <div>
                    <span className="text-muted-foreground">Grade: </span>
                    <span className="font-medium">{assignment.grade}</span>
                  </div>
                )}
                {assignment.status === 'submitted' && assignment.submissionDate && (
                  <div>
                    <span className="text-muted-foreground">Submitted: </span>
                    <span className="font-medium">{formatDate(assignment.submissionDate, { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Assigned: </span>
                  <span className="font-medium">{formatDate(assignment.assignedDate, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Due: </span>
                <span className={`text-sm font-semibold ${getDueDateClass(assignment.dueDate)}`}>
                  {formatDate(assignment.dueDate, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/40 pt-3 pb-2 flex justify-between">
            <div className="text-sm flex items-center">
              {assignment.status === 'not_started' && (
                <span className="text-muted-foreground">Not started yet</span>
              )}
              {assignment.status === 'in_progress' && (
                <span className="text-info">In progress</span>
              )}
              {assignment.status === 'submitted' && (
                <span className="text-warning flex items-center gap-1">
                  <FileCheck className="h-4 w-4" />
                  Submitted, awaiting grade
                </span>
              )}
              {assignment.status === 'graded' && (
                <span className="text-success flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Graded
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="gap-1 -my-1 h-8">
              View Details <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Teacher Assignment List Component
interface TeacherAssignmentListProps {
  assignments: TeacherAssignment[];
  getStatusBadge: (status: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getDueDateClass: (dueDate: string) => string;
  navigate: (to: string) => void;
}

function TeacherAssignmentList({ 
  assignments, 
  getStatusBadge, 
  getStatusIcon, 
  getDueDateClass,
  navigate 
}: TeacherAssignmentListProps) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card 
          key={assignment.id} 
          className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate(`/assignments/${assignment.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="mt-0.5">
                  {getStatusIcon(assignment.status)}
                </div>
                <div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {assignment.course} • {assignment.className}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(assignment.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <FileEdit className="h-4 w-4 mr-2" />
                      Edit Assignment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Grade Submissions
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download Submissions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {assignment.status === 'active' && (
                      <DropdownMenuItem>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Close Assignment
                      </DropdownMenuItem>
                    )}
                    {assignment.status === 'draft' && (
                      <DropdownMenuItem>
                        <FileUp className="h-4 w-4 mr-2" />
                        Publish Assignment
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {assignment.description.length > 120 
                ? `${assignment.description.substring(0, 120)}...` 
                : assignment.description}
            </p>
            
            {/* Assignment stats */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                <div className="flex space-x-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Points: </span>
                    <span className="font-medium">{assignment.points}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assigned: </span>
                    <span className="font-medium">{formatDate(assignment.assignedDate, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Students: </span>
                    <span className="font-medium">{assignment.totalStudents}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Due: </span>
                  <span className={`text-sm font-semibold ${getDueDateClass(assignment.dueDate)}`}>
                    {formatDate(assignment.dueDate, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              
              {assignment.status !== 'draft' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Submission Progress</span>
                    <span className="font-medium">{assignment.submittedCount} / {assignment.totalStudents} submitted</span>
                  </div>
                  <Progress value={(assignment.submittedCount / assignment.totalStudents) * 100} className="h-2" />
                </div>
              )}
              
              {assignment.submittedCount > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Grading Progress</span>
                    <span className="font-medium">{assignment.gradedCount} / {assignment.submittedCount} graded</span>
                  </div>
                  <Progress value={(assignment.gradedCount / assignment.submittedCount) * 100} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 pt-3 pb-3 border-t flex justify-between">
            <div className="text-sm">
              {assignment.status === 'draft' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Publish draft logic
                  }}
                >
                  <FileUp className="h-4 w-4" />
                  Publish
                </Button>
              )}
              
              {assignment.status === 'active' && assignment.submittedCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/assignments/${assignment.id}/grade`);
                  }}
                >
                  <PenLine className="h-4 w-4" />
                  Grade Submissions
                </Button>
              )}
              
              {assignment.status === 'closed' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/assignments/${assignment.id}/results`);
                  }}
                >
                  <BarChart2 className="h-4 w-4" />
                  View Results
                </Button>
              )}
            </div>
            <Button variant="ghost" size="sm" className="gap-1 h-9">
              View Details <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}