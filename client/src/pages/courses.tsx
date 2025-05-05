import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, SUBJECT_AREAS, COURSE_LEVELS } from '@/lib/constants';
import { defaultFetcher } from '@/lib/query';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CoursesPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // Fetch courses
  const { data: coursesData, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.COURSES.LIST],
    queryFn: defaultFetcher,
    // In a real implementation, we would handle the backend filters
  });

  // Mock courses data for demo
  const courses = [
    { 
      id: 1, 
      title: 'Introduction to Programming', 
      description: 'Learn the basics of programming with Python, a beginner-friendly language used in data science, web development, and more.',
      instructorName: 'Dr. John Smith',
      subject: 'programming',
      level: 'beginner',
      enrolledStudents: 243,
      rating: 4.8,
      thumbnail: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Programming+101'
    },
    { 
      id: 2, 
      title: 'Advanced Mathematics', 
      description: 'Explore advanced mathematical concepts including calculus, linear algebra, and differential equations.',
      instructorName: 'Prof. Maria Johnson',
      subject: 'mathematics',
      level: 'advanced',
      enrolledStudents: 187,
      rating: 4.7,
      thumbnail: 'https://placehold.co/600x400/0891b2/FFFFFF/png?text=Advanced+Math'
    },
    { 
      id: 3, 
      title: 'English Literature Classics', 
      description: 'Analyze and discuss classic works of English literature from Shakespeare to Dickens and modern authors.',
      instructorName: 'Dr. Emily Rodriguez',
      subject: 'english',
      level: 'intermediate',
      enrolledStudents: 210,
      rating: 4.6,
      thumbnail: 'https://placehold.co/600x400/db2777/FFFFFF/png?text=English+Literature'
    },
    { 
      id: 4, 
      title: 'Physics Fundamentals', 
      description: 'Study the fundamental laws that govern our universe, from mechanics to thermodynamics and beyond.',
      instructorName: 'Prof. Robert Chen',
      subject: 'science',
      level: 'beginner',
      enrolledStudents: 298,
      rating: 4.9,
      thumbnail: 'https://placehold.co/600x400/4f46e5/FFFFFF/png?text=Physics'
    },
    { 
      id: 5, 
      title: 'World History Overview', 
      description: 'Journey through key historical events and epochs that shaped our modern world and civilizations.',
      instructorName: 'Dr. Sarah Williams',
      subject: 'history',
      level: 'intermediate',
      enrolledStudents: 175,
      rating: 4.5,
      thumbnail: 'https://placehold.co/600x400/ca8a04/FFFFFF/png?text=World+History'
    },
    { 
      id: 6, 
      title: 'Web Development Bootcamp', 
      description: 'Comprehensive course covering HTML, CSS, JavaScript and modern frameworks for building responsive websites.',
      instructorName: 'Tech. Lead Alex Turner',
      subject: 'programming',
      level: 'intermediate',
      enrolledStudents: 342,
      rating: 4.9,
      thumbnail: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Web+Dev'
    },
  ];

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || course.subject === subjectFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesSearch && matchesSubject && matchesLevel;
  });

  function getLevelBadgeColor(level: string) {
    switch(level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore our comprehensive selection of courses across multiple subjects
          </p>
        </div>
        <Button 
          onClick={() => navigate('/courses/my-courses')}
          variant="outline"
          className="w-full md:w-auto"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          My Courses
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={subjectFilter}
              onValueChange={setSubjectFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {SUBJECT_AREAS.map(subject => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={levelFilter}
              onValueChange={setLevelFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {COURSE_LEVELS.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <Card key={course.id} className="overflow-hidden h-full">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <Badge className={getLevelBadgeColor(course.level)}>
                  {COURSE_LEVELS.find(l => l.value === course.level)?.label || course.level}
                </Badge>
              </div>
              <CardDescription>{course.instructorName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {course.description.length > 120 
                  ? `${course.description.substring(0, 120)}...` 
                  : course.description}
              </p>
              <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{course.enrolledStudents} students</span>
                <span>Rating: {course.rating}/5</span>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                View Details
              </Button>
              <Button
                onClick={() => navigate(`/courses/${course.id}/enroll`)}
              >
                Enroll Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
            <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}