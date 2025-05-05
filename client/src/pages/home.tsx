import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { defaultFetcher } from '@/lib/query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { BookOpen, FileText, MessageSquare, Beaker, Wrench } from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();
  
  // Fetch user profile data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [API_ENDPOINTS.AUTH.PROFILE],
    queryFn: defaultFetcher,
    retry: false,
  });

  // Placeholder for recent courses
  const recentCourses = [
    { id: 1, title: 'Introduction to Programming', subject: 'Programming', progress: 45 },
    { id: 2, title: 'Advanced Mathematics', subject: 'Mathematics', progress: 72 },
    { id: 3, title: 'English Literature', subject: 'English', progress: 30 },
  ];

  // Placeholder for upcoming assignments
  const upcomingAssignments = [
    { id: 1, title: 'Programming Project', course: 'Introduction to Programming', dueDate: '2025-05-10' },
    { id: 2, title: 'Math Problem Set', course: 'Advanced Mathematics', dueDate: '2025-05-12' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section>
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
            <CardTitle className="text-2xl">
              Welcome{userData?.first_name ? `, ${userData.first_name}` : ''}!
            </CardTitle>
            <CardDescription>
              Access your courses, assignments, and learning tools all in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 text-center p-4"
              onClick={() => navigate('/courses')}
            >
              <BookOpen className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Courses</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 text-center p-4"
              onClick={() => navigate('/assignments')}
            >
              <FileText className="h-8 w-8 mb-2 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Assignments</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 text-center p-4"
              onClick={() => navigate('/messages')}
            >
              <MessageSquare className="h-8 w-8 mb-2 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium">Messages</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 text-center p-4"
              onClick={() => navigate('/labs')}
            >
              <Beaker className="h-8 w-8 mb-2 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium">Virtual Labs</span>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Recent Courses */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Courses</CardTitle>
            <CardDescription>
              Continue where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{course.subject}</p>
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {course.progress}% Complete
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 dark:bg-blue-600 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/courses')}
              >
                View All Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Assignments */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Upcoming Assignments</CardTitle>
            <CardDescription>
              Assignments due in the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors cursor-pointer"
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
                    </div>
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                      Due {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/assignments')}
              >
                View All Assignments
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Learning Tools */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Learning Tools</CardTitle>
            <CardDescription>
              Specialized tools to enhance your learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 text-center p-4"
                onClick={() => navigate('/tools/math-solver')}
              >
                <span className="text-sm font-medium">Math Problem Solver</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 text-center p-4"
                onClick={() => navigate('/tools/writing-assistant')}
              >
                <span className="text-sm font-medium">Writing Assistant</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 text-center p-4"
                onClick={() => navigate('/tools/language-translator')}
              >
                <span className="text-sm font-medium">Language Translator</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 text-center p-4"
                onClick={() => navigate('/tools')}
              >
                <Wrench className="h-5 w-5 mb-1" />
                <span className="text-sm font-medium">All Tools</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}