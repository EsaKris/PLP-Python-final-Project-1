import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  SearchIcon, 
  ArrowUpDown,
  PlusCircle, 
  X, 
  Check,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  BookOpen,
  Calendar,
  Users,
  Pen
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types for our sample data
interface Grade {
  id: number;
  courseId: number;
  courseName: string;
  assignmentId: number;
  assignmentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  gradeDate: string;
  feedback?: string;
  status: 'graded' | 'pending' | 'resubmit';
  category: string;
  weight: number;
}

interface GradeAverage {
  courseId: number;
  courseName: string;
  average: number;
  letterGrade: string;
  completedAssignments: number;
  totalAssignments: number;
  categories: {
    category: string;
    average: number;
    weight: number;
  }[];
}

interface Student {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
  studentCount: number;
}

// Sample data for student view
const sampleStudentGrades: Grade[] = [
  {
    id: 1,
    courseId: 101,
    courseName: 'Introduction to Computer Science',
    assignmentId: 1001,
    assignmentName: 'Variables and Data Types Quiz',
    score: 92,
    maxScore: 100,
    percentage: 92,
    gradeDate: '2025-02-10',
    feedback: 'Excellent work! You have a strong understanding of data types.',
    status: 'graded',
    category: 'Quiz',
    weight: 10
  },
  {
    id: 2,
    courseId: 101,
    courseName: 'Introduction to Computer Science',
    assignmentId: 1002,
    assignmentName: 'Control Flow Structures Assignment',
    score: 85,
    maxScore: 100,
    percentage: 85,
    gradeDate: '2025-02-17',
    feedback: 'Good job overall. Review nested conditionals section.',
    status: 'graded',
    category: 'Assignment',
    weight: 15
  },
  {
    id: 3,
    courseId: 101,
    courseName: 'Introduction to Computer Science',
    assignmentId: 1003,
    assignmentName: 'Functions and Methods Project',
    score: 78,
    maxScore: 100,
    percentage: 78,
    gradeDate: '2025-03-01',
    feedback: 'Your project shows understanding of basic functions, but parameter handling needs improvement.',
    status: 'graded',
    category: 'Project',
    weight: 25
  },
  {
    id: 4,
    courseId: 101,
    courseName: 'Introduction to Computer Science',
    assignmentId: 1004,
    assignmentName: 'Midterm Examination',
    score: 88,
    maxScore: 100,
    percentage: 88,
    gradeDate: '2025-03-15',
    status: 'graded',
    category: 'Exam',
    weight: 30
  },
  {
    id: 5,
    courseId: 101,
    courseName: 'Introduction to Computer Science',
    assignmentId: 1005,
    assignmentName: 'Object-Oriented Programming Concepts',
    score: 0,
    maxScore: 100,
    percentage: 0,
    gradeDate: '',
    status: 'pending',
    category: 'Assignment',
    weight: 15
  },
  {
    id: 6,
    courseId: 102,
    courseName: 'Calculus I',
    assignmentId: 2001,
    assignmentName: 'Limits and Continuity Homework',
    score: 79,
    maxScore: 100,
    percentage: 79,
    gradeDate: '2025-02-05',
    feedback: 'Make sure to show all your steps clearly.',
    status: 'graded',
    category: 'Homework',
    weight: 10
  },
  {
    id: 7,
    courseId: 102,
    courseName: 'Calculus I',
    assignmentId: 2002,
    assignmentName: 'Derivatives Quiz',
    score: 92,
    maxScore: 100,
    percentage: 92,
    gradeDate: '2025-02-20',
    feedback: 'Excellent work on the chain rule problems!',
    status: 'graded',
    category: 'Quiz',
    weight: 15
  },
  {
    id: 8,
    courseId: 102,
    courseName: 'Calculus I',
    assignmentId: 2003,
    assignmentName: 'Applications of Derivatives',
    score: 68,
    maxScore: 100,
    percentage: 68,
    gradeDate: '2025-03-05',
    feedback: 'You need to review optimization problems. Come to office hours for help.',
    status: 'resubmit',
    category: 'Assignment',
    weight: 20
  },
  {
    id: 9,
    courseId: 103,
    courseName: 'English Composition',
    assignmentId: 3001,
    assignmentName: 'Narrative Essay Draft',
    score: 84,
    maxScore: 100,
    percentage: 84,
    gradeDate: '2025-02-15',
    feedback: 'Good structure, but work on transitional phrases between paragraphs.',
    status: 'graded',
    category: 'Essay',
    weight: 15
  },
  {
    id: 10,
    courseId: 103,
    courseName: 'English Composition',
    assignmentId: 3002,
    assignmentName: 'Literary Analysis Assignment',
    score: 92,
    maxScore: 100,
    percentage: 92,
    gradeDate: '2025-03-01',
    feedback: 'Excellent analysis and supporting evidence.',
    status: 'graded',
    category: 'Assignment',
    weight: 20
  }
];

// Calculate course averages
const courseAverages: GradeAverage[] = [
  {
    courseId: 101,
    courseName: 'Introduction to Computer Science',
    average: 85.75,
    letterGrade: 'B',
    completedAssignments: 4,
    totalAssignments: 5,
    categories: [
      { category: 'Quiz', average: 92, weight: 10 },
      { category: 'Assignment', average: 85, weight: 15 },
      { category: 'Project', average: 78, weight: 25 },
      { category: 'Exam', average: 88, weight: 30 }
    ]
  },
  {
    courseId: 102,
    courseName: 'Calculus I',
    average: 79.5,
    letterGrade: 'C+',
    completedAssignments: 3,
    totalAssignments: 3,
    categories: [
      { category: 'Homework', average: 79, weight: 10 },
      { category: 'Quiz', average: 92, weight: 15 },
      { category: 'Assignment', average: 68, weight: 20 }
    ]
  },
  {
    courseId: 103,
    courseName: 'English Composition',
    average: 88,
    letterGrade: 'B+',
    completedAssignments: 2,
    totalAssignments: 2,
    categories: [
      { category: 'Essay', average: 84, weight: 15 },
      { category: 'Assignment', average: 92, weight: 20 }
    ]
  }
];

// Sample data for teacher view
const teacherCourses: Course[] = [
  { id: 101, name: 'Introduction to Computer Science', code: 'CS101', studentCount: 32 },
  { id: 201, name: 'Data Structures and Algorithms', code: 'CS201', studentCount: 28 },
  { id: 301, name: 'Database Systems', code: 'CS301', studentCount: 24 }
];

const studentData: Student[] = [
  { id: 1, name: 'Alex Johnson', email: 'alex.j@example.edu', avatar: 'https://placehold.co/100x100/79cbc0/1a1a1a?text=AJ' },
  { id: 2, name: 'Jamie Smith', email: 'jamie.s@example.edu', avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=JS' },
  { id: 3, name: 'Taylor Williams', email: 'taylor.w@example.edu', avatar: 'https://placehold.co/100x100/e67e22/ffffff?text=TW' },
  { id: 4, name: 'Morgan Brown', email: 'morgan.b@example.edu', avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=MB' },
  { id: 5, name: 'Riley Garcia', email: 'riley.g@example.edu', avatar: 'https://placehold.co/100x100/8e44ad/ffffff?text=RG' },
  { id: 6, name: 'Casey Martinez', email: 'casey.m@example.edu', avatar: 'https://placehold.co/100x100/c0392b/ffffff?text=CM' },
  { id: 7, name: 'Jordan Lee', email: 'jordan.l@example.edu', avatar: 'https://placehold.co/100x100/16a085/ffffff?text=JL' },
  { id: 8, name: 'Avery Wilson', email: 'avery.w@example.edu', avatar: 'https://placehold.co/100x100/2980b9/ffffff?text=AW' }
];

// Utility functions
const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 80) return 'text-emerald-600';
  if (percentage >= 70) return 'text-blue-600';
  if (percentage >= 60) return 'text-amber-600';
  return 'text-red-600';
};

const getStatusBadge = (status: 'graded' | 'pending' | 'resubmit') => {
  switch (status) {
    case 'graded':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Graded</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Pending</Badge>;
    case 'resubmit':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Resubmit</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

export default function GradesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Grade | null>(null);
  const [newGrade, setNewGrade] = useState<string>('');
  const [newFeedback, setNewFeedback] = useState<string>('');
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin_teacher' || user?.role === 'admin';

  // Filter grades for student view
  const filteredGrades = sampleStudentGrades.filter(grade => {
    const matchesSearch = grade.assignmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          grade.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || grade.courseId === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || grade.status === selectedStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Handle opening the grading dialog
  const handleOpenGrading = (grade: Grade) => {
    setCurrentAssignment(grade);
    setNewGrade(grade.score.toString());
    setNewFeedback(grade.feedback || '');
    setIsGradingOpen(true);
  };

  // Handle submitting a grade (teacher view)
  const handleSubmitGrade = () => {
    console.log('Submitting grade:', {
      assignmentId: currentAssignment?.assignmentId,
      score: newGrade,
      feedback: newFeedback
    });
    // Here you would typically make an API call to update the grade
    setIsGradingOpen(false);
  };

  // Function to get a student's course average
  const getCourseAverage = (courseId: number) => {
    return courseAverages.find(avg => avg.courseId === courseId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isTeacher ? 'Grade Book' : 'My Grades'}
          </h1>
          <p className="text-muted-foreground">
            {isTeacher
              ? 'Manage student grades and performance'
              : 'Track your academic progress across all courses'}
          </p>
        </div>
      </div>

      {isTeacher ? (
        // Teacher View
        <Tabs defaultValue="courses">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Course
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teacherCourses.map(course => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle>{course.name}</CardTitle>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline">{course.code}</Badge>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <Users className="mr-1 h-3 w-3" /> {course.studentCount} Students
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Class Average:</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assignments:</span>
                        <span className="font-medium">12 Total (8 Graded)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">May 3, 2025</span>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-1 h-4 w-4" /> Assignments
                        </Button>
                        <Button size="sm">
                          <Users className="mr-1 h-4 w-4" /> Roster
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {teacherCourses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Last Assignment</TableHead>
                      <TableHead>Last Submission</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <img 
                                src={student.avatar} 
                                alt={student.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div>{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="101">
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              {teacherCourses.map(course => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                  {course.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className={`font-bold ${getGradeColor(88)}`}>88%</span>
                            <span className="text-xs block text-muted-foreground">B+</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">Object-Oriented Programming Concepts</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">May 1, 2025</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Pen className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Grade Assignment</DropdownMenuItem>
                              <DropdownMenuItem>View Submissions</DropdownMenuItem>
                              <DropdownMenuItem>Student Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Contact Student</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Select defaultValue="101">
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {teacherCourses.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Class Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">85%</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="text-green-600">3%</span> from previous module
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">92%</div>
                  <div className="text-sm text-muted-foreground">
                    29 of 32 students completed all assignments
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>A (90-100%)</span>
                      <span className="font-medium">8 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>B (80-89%)</span>
                      <span className="font-medium">12 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>C (70-79%)</span>
                      <span className="font-medium">7 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>D (60-69%)</span>
                      <span className="font-medium">3 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>F (0-59%)</span>
                      <span className="font-medium">2 students</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Assignment Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Difficulty Index</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Variables and Data Types Quiz</TableCell>
                      <TableCell>Feb 10, 2025</TableCell>
                      <TableCell className="text-green-600 font-medium">92%</TableCell>
                      <TableCell>32/32 (100%)</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Control Flow Structures Assignment</TableCell>
                      <TableCell>Feb 17, 2025</TableCell>
                      <TableCell className="text-emerald-600 font-medium">85%</TableCell>
                      <TableCell>30/32 (94%)</TableCell>
                      <TableCell>Medium</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Functions and Methods Project</TableCell>
                      <TableCell>Mar 1, 2025</TableCell>
                      <TableCell className="text-blue-600 font-medium">78%</TableCell>
                      <TableCell>28/32 (88%)</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Midterm Examination</TableCell>
                      <TableCell>Mar 15, 2025</TableCell>
                      <TableCell className="text-emerald-600 font-medium">88%</TableCell>
                      <TableCell>32/32 (100%)</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Object-Oriented Programming Concepts</TableCell>
                      <TableCell>Apr 1, 2025</TableCell>
                      <TableCell className="text-amber-600 font-medium">64%</TableCell>
                      <TableCell>24/32 (75%)</TableCell>
                      <TableCell>Very High</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Student View
        <div className="space-y-6">
          {/* Filter controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5 relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assignments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="sm:col-span-3">
              <Select 
                value={selectedCourse === 'all' ? 'all' : selectedCourse.toString()} 
                onValueChange={(value) => setSelectedCourse(value === 'all' ? 'all' : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courseAverages.map(course => (
                    <SelectItem key={course.courseId} value={course.courseId.toString()}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-3">
              <Select 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resubmit">Need Resubmission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" /> Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" /> Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Course Averages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courseAverages.map(course => (
              <Card key={course.courseId} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>{course.courseName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-2">
                    <div className={`text-4xl font-bold ${getGradeColor(course.average)}`}>
                      {course.average.toFixed(1)}%
                    </div>
                    <div className="text-lg">{course.letterGrade}</div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed:</span>
                      <span>{course.completedAssignments} of {course.totalAssignments} assignments</span>
                    </div>
                    
                    {course.categories.map((cat, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{cat.category} ({cat.weight}%):</span>
                        <span className={getGradeColor(cat.average)}>{cat.average}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setSelectedCourse(course.courseId)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Assignments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableCaption>
                  {filteredGrades.length === 0
                    ? "No matching assignments found."
                    : `Showing ${filteredGrades.length} of ${sampleStudentGrades.length} assignments.`}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead>Graded On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map(grade => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">
                        {grade.assignmentName}
                      </TableCell>
                      <TableCell>{grade.courseName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{grade.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(grade.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        {grade.status === 'pending' ? (
                          <span className="text-muted-foreground">--</span>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className={`font-bold ${getGradeColor(grade.percentage)}`}>
                                  {grade.score}/{grade.maxScore} ({grade.percentage}%)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Weight: {grade.weight}% of course grade</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell>
                        {grade.gradeDate ? new Date(grade.gradeDate).toLocaleDateString() : '--'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Feedback</DropdownMenuItem>
                            {grade.status === 'resubmit' && (
                              <DropdownMenuItem>Resubmit Assignment</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Grading Dialog (for teacher view) */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grade Assignment</DialogTitle>
            <DialogDescription>
              {currentAssignment?.assignmentName} - {currentAssignment?.courseName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="score" className="text-right font-medium">
                Score
              </label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="score"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="flex-grow"
                />
                <span className="text-muted-foreground">/ {currentAssignment?.maxScore}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="feedback" className="text-right font-medium pt-2">
                Feedback
              </label>
              <div className="col-span-3">
                <textarea
                  id="feedback"
                  rows={4}
                  className="w-full border rounded-md p-2"
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradingOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmitGrade}>
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}