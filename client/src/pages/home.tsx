import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { defaultFetcher } from '@/lib/query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Beaker, 
  Wrench, 
  Users, 
  ClipboardCheck, 
  PlusCircle, 
  Bell, 
  Calendar, 
  BarChart2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  School,
  GraduationCap,
  Layers,
  Trophy,
  ArrowRight,
  UserPlus,
  FilePlus,
  ListChecks,
  FileQuestion,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  
  // Fetch user profile data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [API_ENDPOINTS.AUTH.PROFILE],
    queryFn: defaultFetcher,
    retry: false,
  });

  // Placeholder data for different role dashboards
  const studentData = {
    courses: [
      { id: 1, title: 'Introduction to Programming', subject: 'Programming', progress: 45, instructor: 'Dr. Alan Turing' },
      { id: 2, title: 'Advanced Mathematics', subject: 'Mathematics', progress: 72, instructor: 'Prof. Jane Smith' },
      { id: 3, title: 'English Literature', subject: 'English', progress: 30, instructor: 'Dr. William Shakespeare' },
    ],
    assignments: [
      { id: 1, title: 'Programming Project', course: 'Introduction to Programming', dueDate: '2025-05-10', status: 'pending' },
      { id: 2, title: 'Math Problem Set', course: 'Advanced Mathematics', dueDate: '2025-05-12', status: 'pending' },
      { id: 3, title: 'Essay Analysis', course: 'English Literature', dueDate: '2025-05-08', status: 'overdue' },
    ],
    grades: [
      { course: 'Introduction to Programming', grade: 'B+', percentage: 87 },
      { course: 'Advanced Mathematics', grade: 'A-', percentage: 92 },
      { course: 'English Literature', grade: 'B', percentage: 83 },
    ],
    announcements: [
      { id: 1, title: 'End of Term Exams', content: 'Schedule for end of term exams has been published', date: '2025-05-01' },
      { id: 2, title: 'Summer Course Registration', content: 'Registration for summer courses opens next week', date: '2025-04-28' },
    ],
    stats: {
      coursesEnrolled: 3,
      assignmentsCompleted: 8,
      assignmentsPending: 4,
      averageGrade: 87.3
    }
  };

  const teacherData = {
    courses: [
      { id: 1, title: 'Introduction to Programming', subject: 'Programming', students: 28, nextClass: '2025-05-06' },
      { id: 2, title: 'Data Structures', subject: 'Programming', students: 22, nextClass: '2025-05-07' },
      { id: 3, title: 'Algorithms', subject: 'Computer Science', students: 18, nextClass: '2025-05-08' },
    ],
    recentAssignments: [
      { id: 1, title: 'Programming Project', course: 'Introduction to Programming', dueDate: '2025-05-10', submissionsReceived: 12, totalStudents: 28 },
      { id: 2, title: 'Data Structures Quiz', course: 'Data Structures', dueDate: '2025-05-12', submissionsReceived: 18, totalStudents: 22 },
      { id: 3, title: 'Algorithm Design Task', course: 'Algorithms', dueDate: '2025-05-15', submissionsReceived: 5, totalStudents: 18 },
    ],
    studentPerformance: [
      { name: 'High Performers', count: 15, percentage: 30 },
      { name: 'Average Performers', count: 32, percentage: 64 },
      { name: 'Need Support', count: 3, percentage: 6 },
    ],
    upcomingClasses: [
      { id: 1, title: 'Introduction to Programming', day: 'Monday', time: '10:00 AM', room: 'Lab 101' },
      { id: 2, title: 'Data Structures', day: 'Wednesday', time: '1:00 PM', room: 'Lab 203' },
      { id: 3, title: 'Algorithms', day: 'Thursday', time: '11:00 AM', room: 'Lecture Hall 3' },
    ],
    stats: {
      totalStudents: 68,
      totalCourses: 3,
      assignmentsGraded: 15,
      assignmentsPending: 8
    }
  };

  const parentData = {
    children: [
      { id: 1, name: 'John Doe', grade: '10th Grade', school: 'Lincoln High School' },
      { id: 2, name: 'Jane Doe', grade: '8th Grade', school: 'Roosevelt Middle School' }
    ],
    upcomingEvents: [
      { id: 1, title: 'Parent-Teacher Conference', date: '2025-05-15', time: '4:00 PM' },
      { id: 2, title: 'School Science Fair', date: '2025-05-20', time: '5:30 PM' },
      { id: 3, title: 'End of Year Ceremony', date: '2025-06-10', time: '10:00 AM' },
    ],
    notifications: [
      { id: 1, title: 'Assignment Overdue', child: 'John Doe', course: 'Mathematics', date: '2025-05-01' },
      { id: 2, title: 'Test Result Published', child: 'Jane Doe', course: 'English', date: '2025-04-28' },
      { id: 3, title: 'Attendance Alert', child: 'John Doe', course: 'Physics', date: '2025-04-25' },
    ],
    progressReports: [
      { child: 'John Doe', averageGrade: 'B+', attendance: '95%', conductRating: 'Excellent' },
      { child: 'Jane Doe', averageGrade: 'A-', attendance: '98%', conductRating: 'Good' },
    ]
  };

  const adminData = {
    stats: {
      totalStudents: 1250,
      totalTeachers: 85,
      activeCourses: 68,
      totalParents: 980
    },
    recentActivity: [
      { id: 1, action: 'New Teacher Registration', user: 'Maria Rodriguez', timestamp: '2025-05-02 09:23 AM' },
      { id: 2, action: 'New Course Created', user: 'Prof. James Wilson', timestamp: '2025-05-01 02:45 PM' },
      { id: 3, action: 'System Update Completed', user: 'System', timestamp: '2025-04-30 11:30 PM' },
    ],
    systemHealth: {
      status: 'Operational',
      uptime: '99.8%',
      storage: '68%',
      lastBackup: '2025-05-02 01:00 AM'
    }
  };

  // Helper function to determine the appropriate dashboard based on user role
  const renderDashboard = () => {
    switch(userRole) {
      case 'teacher':
      case 'admin_teacher':
        return renderTeacherDashboard();
      case 'parent':
        return renderParentDashboard();
      case 'admin':
        return renderAdminDashboard();
      case 'student':
      default:
        return renderStudentDashboard();
    }
  };

  // Student Dashboard
  const renderStudentDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card with Stats */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
          <CardTitle className="text-2xl">
            Welcome back, {userData?.first_name || 'Student'}!
          </CardTitle>
          <CardDescription className="text-blue-100">
            Here's an overview of your academic progress
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Courses</h3>
                <GraduationCap className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{studentData.stats.coursesEnrolled}</p>
              <p className="text-muted-foreground text-xs mt-1">Enrolled</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Completed</h3>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{studentData.stats.assignmentsCompleted}</p>
              <p className="text-muted-foreground text-xs mt-1">Assignments</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Pending</h3>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-3xl font-bold">{studentData.stats.assignmentsPending}</p>
              <p className="text-muted-foreground text-xs mt-1">Assignments</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Average</h3>
                <TrendingUp className="h-4 w-4 text-violet-500" />
              </div>
              <p className="text-3xl font-bold">{studentData.stats.averageGrade}%</p>
              <p className="text-muted-foreground text-xs mt-1">Grade</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/courses')}
        >
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span>My Courses</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/assignments')}
        >
          <FileText className="h-8 w-8 text-green-600" />
          <span>Assignments</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/grades')}
        >
          <BarChart2 className="h-8 w-8 text-violet-600" />
          <span>Grades</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/forums')}
        >
          <MessageSquare className="h-8 w-8 text-pink-600" />
          <span>Forums</span>
        </Button>
      </div>
      
      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Assignments due soon</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/assignments')}>
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.assignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="group flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/assignments/${assignment.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    assignment.status === 'overdue' 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    {assignment.status === 'overdue' 
                      ? <AlertCircle className="h-5 w-5" /> 
                      : <Clock className="h-5 w-5" />
                    }
                  </div>
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={assignment.status === 'overdue' ? 'destructive' : 'outline'}>
                    {assignment.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                  </Badge>
                  <p className="text-sm">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Course Progress */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/courses')}>
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {studentData.courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {course.progress}% Complete
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <div>
            <p className="text-sm font-medium">Overall Progress</p>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">49%</p>
            <p className="text-xs text-muted-foreground">Average completion</p>
          </div>
        </CardFooter>
      </Card>
      
      {/* Announcements and Learning Tools Tabs */}
      <Tabs defaultValue="announcements">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="tools">Learning Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {studentData.announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <Badge variant="outline">{new Date(announcement.date).toLocaleDateString()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 py-2 items-center justify-center"
                  onClick={() => navigate('/tools/math-solver')}
                >
                  <span className="text-sm font-medium">Math Solver</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 py-2 items-center justify-center"
                  onClick={() => navigate('/tools/writing-assistant')}
                >
                  <span className="text-sm font-medium">Writing Assistant</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 py-2 items-center justify-center"
                  onClick={() => navigate('/tools/language-translator')}
                >
                  <span className="text-sm font-medium">Language Translator</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 py-2 items-center justify-center"
                  onClick={() => navigate('/labs')}
                >
                  <span className="text-sm font-medium">Virtual Labs</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 py-2 items-center justify-center"
                  onClick={() => navigate('/tools/quiz-generator')}
                >
                  <span className="text-sm font-medium">Quiz Generator</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 py-2 items-center justify-center gap-1"
                  onClick={() => navigate('/tools')}
                >
                  <Wrench className="h-4 w-4" />
                  <span className="text-sm font-medium">All Tools</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Teacher Dashboard
  const renderTeacherDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card with Stats */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="text-2xl">
            Welcome back, {userData?.first_name || 'Teacher'}!
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Here's an overview of your teaching activities
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Students</h3>
                <Users className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-3xl font-bold">{teacherData.stats.totalStudents}</p>
              <p className="text-muted-foreground text-xs mt-1">Total</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Courses</h3>
                <BookOpen className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{teacherData.stats.totalCourses}</p>
              <p className="text-muted-foreground text-xs mt-1">Active</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Graded</h3>
                <ClipboardCheck className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{teacherData.stats.assignmentsGraded}</p>
              <p className="text-muted-foreground text-xs mt-1">Assignments</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Pending</h3>
                <FileText className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-3xl font-bold">{teacherData.stats.assignmentsPending}</p>
              <p className="text-muted-foreground text-xs mt-1">To Grade</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/classes')}
        >
          <Layers className="h-8 w-8 text-indigo-600" />
          <span>Manage Classes</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/courses/create')}
        >
          <PlusCircle className="h-8 w-8 text-purple-600" />
          <span>Create Course</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/assignments/create')}
        >
          <FilePlus className="h-8 w-8 text-green-600" />
          <span>New Assignment</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/students')}
        >
          <UserPlus className="h-8 w-8 text-blue-600" />
          <span>Manage Students</span>
        </Button>
      </div>
      
      {/* Upcoming Classes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Your teaching schedule for this week</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/classes')}>
              View Full Schedule <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherData.upcomingClasses.map((classItem) => (
              <div 
                key={classItem.id} 
                className="group flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/classes/${classItem.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{classItem.title}</h4>
                    <p className="text-sm text-muted-foreground">{classItem.day}, {classItem.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {classItem.room}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Assignment Submissions & Student Performance Tabs */}
      <Tabs defaultValue="assignments">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Assignment Submissions</TabsTrigger>
          <TabsTrigger value="performance">Student Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Track submission progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherData.recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{assignment.submissionsReceived} / {assignment.totalStudents}</p>
                        <p className="text-xs text-muted-foreground">Submissions received</p>
                      </div>
                    </div>
                    <Progress value={(assignment.submissionsReceived / assignment.totalStudents) * 100} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 text-xs"
                        onClick={() => navigate(`/assignments/${assignment.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/assignments/create')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Assignment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Overview</CardTitle>
              <CardDescription>Based on assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teacherData.studentPerformance.map((group, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">{group.name}</h4>
                      <Badge variant={
                        index === 0 ? "success" : index === 1 ? "default" : "destructive"
                      }>
                        {group.count} Students
                      </Badge>
                    </div>
                    <Progress 
                      value={group.percentage} 
                      className={
                        index === 0 
                          ? "h-2 bg-gray-100 dark:bg-gray-800" 
                          : index === 1 
                            ? "h-2 bg-gray-100 dark:bg-gray-800"
                            : "h-2 bg-gray-100 dark:bg-gray-800"
                      }
                    />
                    <p className="text-xs text-muted-foreground text-right">{group.percentage}% of students</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/students')}
              >
                View Detailed Performance Reports
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Courses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Courses you are currently teaching</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/courses/create')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherData.courses.map((course) => (
              <div 
                key={course.id} 
                className="border rounded-lg overflow-hidden card-hover cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-end p-4">
                  <h3 className="font-semibold text-white">{course.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{course.subject}</p>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students} Students
                    </div>
                    <div className="text-sm">
                      Next: {new Date(course.nextClass).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Parent Dashboard
  const renderParentDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card with Children Overview */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <CardTitle className="text-2xl">
            Welcome back, {userData?.first_name || 'Parent'}!
          </CardTitle>
          <CardDescription className="text-blue-100">
            Monitor your children's educational progress
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {parentData.children.map((child) => (
              <Card key={child.id} className="card-hover border-none shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{child.name}</CardTitle>
                  <CardDescription>{child.grade} • {child.school}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {parentData.progressReports
                      .filter(report => report.child === child.name)
                      .map((report, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Average Grade</p>
                            <p className="font-semibold">{report.averageGrade}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Attendance</p>
                            <p className="font-semibold">{report.attendance}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conduct</p>
                            <p className="font-semibold">{report.conductRating}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(`/progress?childId=${child.id}`)}
                  >
                    View Full Report
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/progress')}
        >
          <BarChart2 className="h-8 w-8 text-blue-600" />
          <span>Progress Reports</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/meetings')}
        >
          <Calendar className="h-8 w-8 text-teal-600" />
          <span>Schedule Meeting</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/parent-forums')}
        >
          <MessageSquare className="h-8 w-8 text-purple-600" />
          <span>Parent Forums</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/announcements')}
        >
          <Bell className="h-8 w-8 text-amber-600" />
          <span>Announcements</span>
        </Button>
      </div>
      
      {/* Notifications & Upcoming Events Tabs */}
      <Tabs defaultValue="notifications">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {parentData.notifications.map((notification) => (
                  <div key={notification.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 h-fit">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant="outline">{new Date(notification.date).toLocaleDateString()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.child} - {notification.course}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {parentData.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 h-fit">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline">{new Date(event.date).toLocaleDateString()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Time: {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/meetings')}
              >
                Schedule a Meeting
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Admin Dashboard
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card with Stats */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-900 text-white">
          <CardTitle className="text-2xl">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-slate-200">
            System overview and management
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Students</h3>
                <School className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{adminData.stats.totalStudents}</p>
              <p className="text-muted-foreground text-xs mt-1">Enrolled</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Teachers</h3>
                <GraduationCap className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{adminData.stats.totalTeachers}</p>
              <p className="text-muted-foreground text-xs mt-1">Active</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Parents</h3>
                <Users className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-3xl font-bold">{adminData.stats.totalParents}</p>
              <p className="text-muted-foreground text-xs mt-1">Registered</p>
            </div>
            
            <div className="dashboard-stat-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-muted-foreground text-sm font-medium">Courses</h3>
                <BookOpen className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{adminData.stats.activeCourses}</p>
              <p className="text-muted-foreground text-xs mt-1">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/admin/users')}
        >
          <Users className="h-8 w-8 text-slate-600" />
          <span>Manage Users</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/admin/courses')}
        >
          <BookOpen className="h-8 w-8 text-slate-600" />
          <span>Manage Courses</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/admin/settings')}
        >
          <Settings className="h-8 w-8 text-slate-600" />
          <span>System Settings</span>
        </Button>
        
        <Button 
          className="dashboard-card-interactive h-auto py-6 flex flex-col items-center justify-center gap-3"
          variant="outline"
          onClick={() => navigate('/admin/reports')}
        >
          <BarChart2 className="h-8 w-8 text-slate-600" />
          <span>Reports</span>
        </Button>
      </div>
      
      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Status</span>
                <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                  {adminData.systemHealth.status}
                </Badge>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Uptime</span>
                <span>{adminData.systemHealth.uptime}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Storage Used</span>
                <span>{adminData.systemHealth.storage}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Backup</span>
                <span>{adminData.systemHealth.lastBackup}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminData.recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-primary absolute top-2 left-0"></div>
                    <div className="h-full w-px bg-border absolute top-3 left-1"></div>
                  </div>
                  <div className={i === adminData.recentActivity.length - 1 ? '' : 'pb-4'}>
                    <p className="font-medium">{activity.action}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/logs')}>
              View System Logs
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  return (
    <div>
      {userLoading ? (
        // Loading state
        <div className="space-y-6">
          <div className="w-full h-64 bg-card rounded-lg border flex items-center justify-center">
            <div className="space-y-4 w-1/2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-4 gap-4 pt-6">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      ) : (
        // Render the appropriate dashboard based on user role
        renderDashboard()
      )}
    </div>
  );
}