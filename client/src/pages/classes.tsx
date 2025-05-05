import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from '@/lib/constants';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Calendar, 
  GraduationCap, 
  Users, 
  Book, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  BookOpen, 
  ShieldCheck, 
  Check, 
  Clock, 
  ArrowUpDown,
  FileText,
  Mail,
  Upload,
  Download,
  ClipboardList
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface Class {
  id: number;
  name: string;
  subject: string;
  room: string;
  schedule: string;
  gradeLevels: string[];
  studentCount: number;
  teacher: {
    id: number;
    name: string;
    avatar?: string;
  };
  description?: string;
  startDate: string;
  endDate: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  gradeLevel: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  progress: number;
  attendance: {
    present: number;
    absent: number;
    excused: number;
  };
  performance?: {
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
}

// Form validation schema
const classFormSchema = z.object({
  name: z.string().min(5, "Class name must be at least 5 characters long"),
  subject: z.string().min(1, "Please select a subject"),
  room: z.string().min(1, "Room is required"),
  schedule: z.string().min(1, "Schedule is required"),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

// Type for the form values
type ClassFormValues = z.infer<typeof classFormSchema>;

// Sample class data
const sampleClasses: Class[] = [
  {
    id: 1,
    name: 'Advanced Mathematics',
    subject: 'Mathematics',
    room: 'Room 101',
    schedule: 'MWF 9:00 AM - 10:30 AM',
    gradeLevels: ['Grade 11', 'Grade 12'],
    studentCount: 28,
    teacher: {
      id: 1,
      name: 'Prof. Jackson',
      avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=PJ'
    },
    description: 'Advanced mathematics course covering calculus, linear algebra, and statistics.',
    startDate: '2024-09-01',
    endDate: '2025-06-15'
  },
  {
    id: 2,
    name: 'Introduction to Computer Science',
    subject: 'Computer Science',
    room: 'Lab 3',
    schedule: 'TTh 1:00 PM - 3:00 PM',
    gradeLevels: ['Grade 10', 'Grade 11'],
    studentCount: 24,
    teacher: {
      id: 1,
      name: 'Prof. Jackson',
      avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=PJ'
    },
    description: 'Introduction to programming concepts, algorithms, and data structures.',
    startDate: '2024-09-01',
    endDate: '2025-06-15'
  },
  {
    id: 3,
    name: 'Biology 101',
    subject: 'Science',
    room: 'Science Lab 2',
    schedule: 'MWF 11:00 AM - 12:30 PM',
    gradeLevels: ['Grade 9', 'Grade 10'],
    studentCount: 32,
    teacher: {
      id: 2,
      name: 'Dr. Richards',
      avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=DR'
    },
    description: 'Introductory biology course covering cellular structure, genetics, and ecosystems.',
    startDate: '2024-09-01',
    endDate: '2025-06-15'
  },
  {
    id: 4,
    name: 'World History',
    subject: 'History',
    room: 'Room 205',
    schedule: 'TTh 9:00 AM - 10:30 AM',
    gradeLevels: ['Grade 10', 'Grade 11'],
    studentCount: 30,
    teacher: {
      id: 3,
      name: 'Prof. Martinez',
      avatar: 'https://placehold.co/100x100/8e44ad/ffffff?text=PM'
    },
    description: 'Comprehensive survey of world history from ancient civilizations to modern times.',
    startDate: '2024-09-01',
    endDate: '2025-06-15'
  },
  {
    id: 5,
    name: 'English Literature',
    subject: 'English',
    room: 'Room 302',
    schedule: 'MWF 2:00 PM - 3:30 PM',
    gradeLevels: ['Grade 11', 'Grade 12'],
    studentCount: 26,
    teacher: {
      id: 4,
      name: 'Dr. Williams',
      avatar: 'https://placehold.co/100x100/c0392b/ffffff?text=DW'
    },
    description: 'Analysis of classic and contemporary literature, with focus on critical thinking and writing skills.',
    startDate: '2024-09-01',
    endDate: '2025-06-15'
  }
];

// Sample students data
const sampleStudents: Student[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.j@example.edu',
    gradeLevel: 'Grade 11',
    avatar: 'https://placehold.co/100x100/79cbc0/1a1a1a?text=AJ',
    joinDate: '2024-09-01',
    lastActive: '2025-05-02',
    progress: 85,
    attendance: {
      present: 42,
      absent: 3,
      excused: 1
    },
    performance: {
      average: 88,
      trend: 'up'
    }
  },
  {
    id: 2,
    name: 'Jamie Smith',
    email: 'jamie.s@example.edu',
    gradeLevel: 'Grade 11',
    avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=JS',
    joinDate: '2024-09-01',
    lastActive: '2025-05-03',
    progress: 92,
    attendance: {
      present: 45,
      absent: 1,
      excused: 0
    },
    performance: {
      average: 94,
      trend: 'stable'
    }
  },
  {
    id: 3,
    name: 'Taylor Williams',
    email: 'taylor.w@example.edu',
    gradeLevel: 'Grade 12',
    avatar: 'https://placehold.co/100x100/e67e22/ffffff?text=TW',
    joinDate: '2024-09-01',
    lastActive: '2025-05-01',
    progress: 78,
    attendance: {
      present: 40,
      absent: 5,
      excused: 1
    },
    performance: {
      average: 82,
      trend: 'down'
    }
  },
  {
    id: 4,
    name: 'Morgan Brown',
    email: 'morgan.b@example.edu',
    gradeLevel: 'Grade 11',
    avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=MB',
    joinDate: '2024-09-01',
    lastActive: '2025-05-03',
    progress: 90,
    attendance: {
      present: 44,
      absent: 2,
      excused: 0
    },
    performance: {
      average: 91,
      trend: 'up'
    }
  },
  {
    id: 5,
    name: 'Riley Garcia',
    email: 'riley.g@example.edu',
    gradeLevel: 'Grade 11',
    avatar: 'https://placehold.co/100x100/8e44ad/ffffff?text=RG',
    joinDate: '2024-09-01',
    lastActive: '2025-04-29',
    progress: 65,
    attendance: {
      present: 36,
      absent: 8,
      excused: 2
    },
    performance: {
      average: 75,
      trend: 'stable'
    }
  }
];

// Available subjects
const subjects = [
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Science', label: 'Science' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'English', label: 'English' },
  { value: 'History', label: 'History' },
  { value: 'Geography', label: 'Geography' },
  { value: 'Art', label: 'Art' },
  { value: 'Music', label: 'Music' },
  { value: 'Physical Education', label: 'Physical Education' },
  { value: 'Foreign Languages', label: 'Foreign Languages' }
];

// Available grade levels
const gradeLevels = [
  { value: 'Grade 9', label: 'Grade 9' },
  { value: 'Grade 10', label: 'Grade 10' },
  { value: 'Grade 11', label: 'Grade 11' },
  { value: 'Grade 12', label: 'Grade 12' }
];

export default function ClassesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin_teacher' || user?.role === 'admin';

  // Form for adding/editing a class
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      subject: '',
      room: '',
      schedule: '',
      gradeLevels: [],
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 9)).toISOString().split('T')[0],
    },
  });

  // Filter classes by search and subject
  const filteredClasses = sampleClasses.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || cls.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Handle adding a new class
  const handleAddClass = (data: ClassFormValues) => {
    console.log('Adding new class:', data);
    // In a real app, you would use a mutation to add the class to the database
    
    // Close the dialog and reset the form
    setIsAddClassOpen(false);
    form.reset();
    
    toast({
      title: 'Class created',
      description: 'Your new class has been created successfully.',
    });
  };

  // Handle editing a class
  const handleEditClass = (classId: number) => {
    const classToEdit = sampleClasses.find(cls => cls.id === classId);
    if (classToEdit) {
      // Populate the form with the class data
      form.reset({
        name: classToEdit.name,
        subject: classToEdit.subject,
        room: classToEdit.room,
        schedule: classToEdit.schedule,
        gradeLevels: classToEdit.gradeLevels,
        description: classToEdit.description || '',
        startDate: classToEdit.startDate,
        endDate: classToEdit.endDate,
      });
      
      // Open the dialog
      setIsAddClassOpen(true);
    }
  };

  // Handle viewing a class
  const handleViewClass = (classId: number) => {
    const classToView = sampleClasses.find(cls => cls.id === classId);
    if (classToView) {
      setSelectedClass(classToView);
      setActiveTab('overview');
    }
  };

  // Get progress color based on progress value
  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Handle select all students
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(sampleStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Handle individual student selection
  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  // Handle add students to class
  const handleAddStudents = () => {
    console.log('Adding students:', selectedStudents);
    // In a real app, you would use a mutation to add the students to the class
    
    toast({
      title: 'Students added',
      description: `${selectedStudents.length} students have been added to the class.`,
    });
    
    // Reset selection and close dialog
    setSelectedStudents([]);
    setIsAddStudentOpen(false);
  };

  return (
    <div className="space-y-6">
      {!selectedClass ? (
        // Classes List View
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
              <p className="text-muted-foreground">
                Manage your classes, students, and curriculum
              </p>
            </div>
            <Button onClick={() => {
              form.reset();
              setIsAddClassOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Create Class
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            {/* Sidebar */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Subjects</h3>
                <div className="space-y-1">
                  <Button
                    variant={selectedSubject === 'all' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedSubject('all')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    All Subjects
                  </Button>
                  
                  {subjects.map(subject => (
                    <Button
                      key={subject.value}
                      variant={selectedSubject === subject.value ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedSubject(subject.value)}
                    >
                      <Book className="mr-2 h-4 w-4" />
                      {subject.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Quick Access</h3>
                <div className="space-y-1">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" /> All Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" /> Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ClipboardList className="mr-2 h-4 w-4" /> Attendance
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Reports</h3>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" /> Performance Reports
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" /> Export Data
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search classes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Classes list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClasses.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 text-center py-12 border rounded-lg">
                    <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No classes found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery 
                        ? "No classes match your search criteria." 
                        : "You haven't created any classes yet."}
                    </p>
                    <Button onClick={() => {
                      form.reset();
                      setIsAddClassOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Create First Class
                    </Button>
                  </div>
                ) : (
                  filteredClasses.map(cls => (
                    <Card key={cls.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="line-clamp-1">{cls.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewClass(cls.id)}>
                                <Book className="mr-2 h-4 w-4" /> View Class
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClass(cls.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Class
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Class
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {cls.subject}
                          </Badge>
                          <Badge variant="outline">{cls.room}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="mr-2 h-4 w-4" /> {cls.schedule}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <GraduationCap className="mr-2 h-4 w-4" /> {cls.gradeLevels.join(', ')}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Users className="mr-2 h-4 w-4" /> {cls.studentCount} Students
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={cls.teacher.avatar} alt={cls.teacher.name} />
                              <AvatarFallback>{cls.teacher.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{cls.teacher.name}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleViewClass(cls.id)}
                        >
                          Manage Class
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Class Detail View
        <>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedClass(null)}
                  className="mb-1"
                >
                  &larr; Back to Classes
                </Button>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{selectedClass.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {selectedClass.subject}
                </Badge>
                <Badge variant="outline">{selectedClass.room}</Badge>
                <Badge variant="outline">{selectedClass.schedule}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleEditClass(selectedClass.id)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Class
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" /> Message Class
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" /> Export Class Data
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Class
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Class Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedClass.description || 'No description provided.'}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Schedule</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedClass.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(selectedClass.startDate).toLocaleDateString()} - {new Date(selectedClass.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Grade Levels</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedClass.gradeLevels.map(level => (
                          <Badge key={level} variant="outline">
                            <GraduationCap className="mr-1 h-3 w-3" /> {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Teacher</h3>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={selectedClass.teacher.avatar} alt={selectedClass.teacher.name} />
                          <AvatarFallback>{selectedClass.teacher.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedClass.teacher.name}</p>
                          <p className="text-sm text-muted-foreground">Class Instructor</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Class Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Class Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 p-4 border rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <Users className="mr-2 h-4 w-4" /> Enrollment
                        </h3>
                        <p className="text-2xl font-bold">{selectedClass.studentCount}</p>
                        <p className="text-sm text-muted-foreground">Students enrolled</p>
                      </div>
                      
                      <div className="space-y-2 p-4 border rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" /> Assignments
                        </h3>
                        <p className="text-2xl font-bold">15</p>
                        <p className="text-sm text-muted-foreground">Total assignments</p>
                      </div>
                      
                      <div className="space-y-2 p-4 border rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4" /> Average
                        </h3>
                        <p className="text-2xl font-bold">84%</p>
                        <p className="text-sm text-muted-foreground">Class average</p>
                      </div>
                      
                      <div className="space-y-2 p-4 border rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <Check className="mr-2 h-4 w-4" /> Completion
                        </h3>
                        <p className="text-2xl font-bold">76%</p>
                        <p className="text-sm text-muted-foreground">Assignment completion</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Attendance Overview</h3>
                      <div className="flex gap-2">
                        <div className="flex-1 p-2 border rounded-md text-center">
                          <p className="text-sm text-muted-foreground">Present</p>
                          <p className="font-bold text-green-600">92%</p>
                        </div>
                        <div className="flex-1 p-2 border rounded-md text-center">
                          <p className="text-sm text-muted-foreground">Absent</p>
                          <p className="font-bold text-red-600">5%</p>
                        </div>
                        <div className="flex-1 p-2 border rounded-md text-center">
                          <p className="text-sm text-muted-foreground">Excused</p>
                          <p className="font-bold text-amber-600">3%</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Recent Activity</h3>
                      <div className="space-y-2">
                        <div className="text-sm flex items-center justify-between">
                          <span>New assignment created</span>
                          <span className="text-muted-foreground">Today</span>
                        </div>
                        <div className="text-sm flex items-center justify-between">
                          <span>3 students submitted homework</span>
                          <span className="text-muted-foreground">Yesterday</span>
                        </div>
                        <div className="text-sm flex items-center justify-between">
                          <span>Attendance taken</span>
                          <span className="text-muted-foreground">2 days ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Midterm Exam</TableCell>
                        <TableCell>May 15, 2025</TableCell>
                        <TableCell>
                          <Badge variant="outline">Exam</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-amber-100 text-amber-800">Upcoming</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Project Presentations</TableCell>
                        <TableCell>May 22, 2025</TableCell>
                        <TableCell>
                          <Badge variant="outline">Assignment</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-amber-100 text-amber-800">Upcoming</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Guest Speaker</TableCell>
                        <TableCell>May 28, 2025</TableCell>
                        <TableCell>
                          <Badge variant="outline">Special Event</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-amber-100 text-amber-800">Upcoming</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6 mt-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8"
                  />
                </div>
                <Button onClick={() => setIsAddStudentOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Students
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Checkbox 
                            onCheckedChange={(checked) => {
                              if (typeof checked === 'boolean') {
                                handleSelectAll(checked);
                              }
                            }}
                            checked={selectedStudents.length === sampleStudents.length && sampleStudents.length > 0}
                            indeterminate={selectedStudents.length > 0 && selectedStudents.length < sampleStudents.length}
                          />
                        </TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade Level</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleStudents.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                  handleSelectStudent(student.id, checked);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-xs text-muted-foreground">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.gradeLevel}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${getProgressColor(student.progress)}`}
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{student.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              <div>Present: {student.attendance.present}</div>
                              <div>Absent: {student.attendance.absent}</div>
                              <div>Excused: {student.attendance.excused}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.performance ? (
                              <div className="flex items-center">
                                <span className={`font-medium ${
                                  student.performance.average >= 90 ? 'text-green-600' :
                                  student.performance.average >= 80 ? 'text-emerald-600' :
                                  student.performance.average >= 70 ? 'text-blue-600' :
                                  student.performance.average >= 60 ? 'text-amber-600' :
                                  'text-red-600'
                                }`}>
                                  {student.performance.average}%
                                </span>
                                {student.performance.trend === 'up' && <ArrowUpDown className="h-4 w-4 text-green-600 ml-1" />}
                                {student.performance.trend === 'down' && <ArrowUpDown className="h-4 w-4 text-red-600 ml-1" />}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">No data</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>View Progress</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Remove from Class</DropdownMenuItem>
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
            
            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Assignments</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage homework, projects, quizzes, and other assignments
                  </p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Assignment
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Variables and Data Types Quiz</TableCell>
                        <TableCell>
                          <Badge variant="outline">Quiz</Badge>
                        </TableCell>
                        <TableCell>May 10, 2025</TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>18/28 (64%)</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Control Flow Structures Assignment</TableCell>
                        <TableCell>
                          <Badge variant="outline">Assignment</Badge>
                        </TableCell>
                        <TableCell>May 17, 2025</TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>12/28 (43%)</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Functions and Methods Project</TableCell>
                        <TableCell>
                          <Badge variant="outline">Project</Badge>
                        </TableCell>
                        <TableCell>June 1, 2025</TableCell>
                        <TableCell>200</TableCell>
                        <TableCell>0/28 (0%)</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Attendance</h2>
                  <p className="text-sm text-muted-foreground">
                    Track and manage student attendance records
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="today">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today (May 5, 2025)</SelectItem>
                      <SelectItem value="yesterday">Yesterday (May 4, 2025)</SelectItem>
                      <SelectItem value="custom">Custom Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Take Attendance</Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Arrival Time</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleStudents.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{student.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue="present">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="tardy">Tardy</SelectItem>
                                <SelectItem value="excused">Excused</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="time" defaultValue="09:00" className="w-[120px]" />
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Add notes..." />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Check className="h-4 w-4 mr-1" /> Save
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-end py-4">
                  <Button variant="outline" className="mr-2">Cancel</Button>
                  <Button>Save All</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Add Class Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Add a new class to your teaching schedule
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddClass)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Advanced Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject.value} value={subject.value}>
                              {subject.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Room 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MWF 9:00 AM - 10:30 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="gradeLevels"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Grade Levels</FormLabel>
                      <FormDescription>
                        Select the grade levels for this class
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {gradeLevels.map((item) => (
                        <FormField
                          key={item.value}
                          control={form.control}
                          name="gradeLevels"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.value)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValue, item.value]);
                                      } else {
                                        field.onChange(
                                          currentValue.filter(
                                            (value) => value !== item.value
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a description of the class..."
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddClassOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={form.handleSubmit(handleAddClass)}
            >
              Create Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Students Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Students to Class</DialogTitle>
            <DialogDescription>
              Select students to add to {selectedClass?.name || 'this class'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
            />
          </div>
          
          <div className="border rounded-md h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleSelectAll(checked);
                        }
                      }}
                      checked={selectedStudents.length === sampleStudents.length && sampleStudents.length > 0}
                      indeterminate={selectedStudents.length > 0 && selectedStudents.length < sampleStudents.length}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Grade Level</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            handleSelectStudent(student.id, checked);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{student.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{student.gradeLevel}</TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-muted-foreground">
              {selectedStudents.length} students selected
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>
              Clear Selection
            </Button>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddStudentOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0}
            >
              Add Selected Students
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}