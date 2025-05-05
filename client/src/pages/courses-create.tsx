import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS, SUBJECT_AREAS, GRADE_LEVELS } from '@/lib/constants';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  PlusCircle,
  FileText,
  Calendar,
  Book,
  Globe,
  Users,
  ClipboardList,
  Clock,
  Settings,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const courseFormSchema = z.object({
  name: z.string().min(5, "Course name must be at least 5 characters long"),
  code: z.string().min(2, "Course code is required"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  subject: z.string().min(1, "Please select a subject area"),
  gradeLevel: z.string().min(1, "Please select a grade level"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  isPublic: z.boolean().default(true),
  isEnrollmentOpen: z.boolean().default(true),
  syllabusText: z.string().optional(),
});

// Define the form values type
type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CreateCoursePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('basic');
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const [courseThumbnail, setCourseThumbnail] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin_teacher' || user?.role === 'admin';

  // Initialize the form
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      subject: '',
      gradeLevel: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
      capacity: 30,
      isPublic: true,
      isEnrollmentOpen: true,
      syllabusText: '',
    },
  });

  // Check if form is being filled 
  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      // Add the thumbnail if it exists
      const courseData = {
        ...data,
        thumbnailUrl: courseThumbnail,
        status: isDraft ? 'draft' : 'published',
      };
      
      const res = await apiRequest("POST", API_ENDPOINTS.COURSES.LIST, courseData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: isDraft 
          ? "Course draft saved" 
          : "Course created successfully",
        description: isDraft
          ? "You can continue editing this course later."
          : "Students can now enroll in this course.",
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.COURSES.LIST] });
      // Navigate back to courses page
      setTimeout(() => navigate('/courses'), 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: CourseFormValues) => {
    // Validate all tabs before submission
    if (activeTab !== 'review') {
      // Move to review tab
      setActiveTab('review');
      return;
    }
    
    // Submit the form
    createCourseMutation.mutate(data);
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      setCourseThumbnail(previewUrl);
    }
  };

  // Handle discard course
  const handleDiscardCourse = () => {
    form.reset();
    setCourseThumbnail(null);
    setFilePreview(null);
    setIsDraft(false);
    setDiscardDialogOpen(false);
    setActiveTab('basic');
    toast({
      title: "Course discarded",
      description: "All changes have been discarded.",
    });
  };

  // If not a teacher, show unauthorized message
  if (!isTeacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">Unauthorized Access</h1>
        <p className="text-muted-foreground max-w-md mt-2">
          You don't have permission to create courses. This feature is available for teachers and administrators.
        </p>
        <Button className="mt-4" onClick={() => navigate('/courses')}>
          View Available Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground">
            Design and set up a new course for your students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={isDraft} 
            onCheckedChange={setIsDraft} 
            id="draft-mode"
          />
          <label 
            htmlFor="draft-mode" 
            className="text-sm cursor-pointer"
          >
            Save as draft
          </label>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>
                    Provide the basic information about your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Introduction to Computer Science" {...field} />
                        </FormControl>
                        <FormDescription>
                          The full name of your course as it will appear to students
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CS101" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short identifier for your course (often a department code and number)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a detailed description of what students will learn in this course..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Write a clear description of the course content, goals, and outcomes
                        </FormDescription>
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
                          <FormLabel>Subject Area</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject area" />
                              </SelectTrigger>
                              <SelectContent>
                                {SUBJECT_AREAS.map(subject => (
                                  <SelectItem key={subject.value} value={subject.value}>
                                    {subject.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a grade level" />
                              </SelectTrigger>
                              <SelectContent>
                                {GRADE_LEVELS.map(grade => (
                                  <SelectItem key={grade.value} value={grade.value}>
                                    {grade.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormLabel className="block mb-2">Course Thumbnail</FormLabel>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="border rounded-md overflow-hidden aspect-video w-full md:w-64 bg-muted flex items-center justify-center">
                        {filePreview ? (
                          <img 
                            src={filePreview} 
                            alt="Course thumbnail preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Book className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          id="thumbnail"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('thumbnail')?.click()}
                          className="w-full md:w-auto"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload Image
                        </Button>
                        {filePreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setFilePreview(null);
                              setCourseThumbnail(null);
                            }}
                            className="text-red-500 hover:text-red-700 w-full md:w-auto mt-2"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </Button>
                        )}
                        <FormDescription className="mt-2">
                          Upload a representative image for your course. 16:9 aspect ratio recommended.
                        </FormDescription>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (isFormDirty) {
                        setDiscardDialogOpen(true);
                      } else {
                        navigate('/courses');
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('details')}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>
                    Set scheduling, enrollment, and visibility options for your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                          <FormDescription>
                            When will the course become available to students?
                          </FormDescription>
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
                          <FormDescription>
                            When will the course be completed?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Students</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(parseInt(value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of students that can enroll in this course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Course Visibility
                          </FormLabel>
                          <FormDescription>
                            Make this course visible in course listings and search results
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isEnrollmentOpen"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Open Enrollment
                          </FormLabel>
                          <FormDescription>
                            Allow students to self-enroll in this course
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('basic')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('content')}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    Add your syllabus and initial content structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="syllabusText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Syllabus</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your course syllabus or outline here..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Outline what students will learn weekly, along with assignments and expectations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Course Modules</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You'll be able to add modules, lessons, and assignments after creating the course.
                    </p>
                    
                    <div className="border border-dashed rounded-md p-4 text-center">
                      <Book className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Modules will appear here after course creation
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-2" 
                        type="button"
                        disabled
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Module (After Creation)
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('details')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('review')}
                  >
                    Review Course
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Review Tab */}
            <TabsContent value="review" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Course</CardTitle>
                  <CardDescription>
                    Review all information before creating your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <FileText className="mr-2 h-5 w-5" /> Basic Information
                        </h3>
                        <Separator className="my-2" />
                        <dl className="space-y-2">
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Course Name</dt>
                            <dd className="font-medium">{form.watch('name') || 'Not provided'}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Course Code</dt>
                            <dd className="font-medium">{form.watch('code') || 'Not provided'}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Subject</dt>
                            <dd className="font-medium">
                              {SUBJECT_AREAS.find(s => s.value === form.watch('subject'))?.label || 'Not selected'}
                            </dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Grade Level</dt>
                            <dd className="font-medium">
                              {GRADE_LEVELS.find(g => g.value === form.watch('gradeLevel'))?.label || 'Not selected'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Calendar className="mr-2 h-5 w-5" /> Course Details
                        </h3>
                        <Separator className="my-2" />
                        <dl className="space-y-2">
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Start Date</dt>
                            <dd className="font-medium">
                              {new Date(form.watch('startDate')).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">End Date</dt>
                            <dd className="font-medium">
                              {new Date(form.watch('endDate')).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Maximum Students</dt>
                            <dd className="font-medium">{form.watch('capacity')}</dd>
                          </div>
                          <div className="flex items-center gap-2">
                            <dt className="text-sm text-muted-foreground">Public Course</dt>
                            <dd>
                              {form.watch('isPublic') ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </dd>
                          </div>
                          <div className="flex items-center gap-2">
                            <dt className="text-sm text-muted-foreground">Open Enrollment</dt>
                            <dd>
                              {form.watch('isEnrollmentOpen') ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Description</h3>
                        <Separator className="my-2" />
                        <p className="text-sm whitespace-pre-line">
                          {form.watch('description') || 'No description provided.'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Thumbnail</h3>
                        <Separator className="my-2" />
                        <div className="border rounded-md overflow-hidden aspect-video bg-muted flex items-center justify-center">
                          {filePreview ? (
                            <img 
                              src={filePreview} 
                              alt="Course thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <Book className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">No thumbnail provided</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Status</h3>
                        <Separator className="my-2" />
                        <Badge className={isDraft ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                          {isDraft ? "Draft" : "Ready to Publish"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {isDraft 
                            ? "This course will be saved as a draft and won't be visible to students yet."
                            : "This course will be published and students can enroll if open enrollment is enabled."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('content')}
                  >
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={() => {
                        setIsDraft(true);
                        form.handleSubmit(onSubmit)();
                      }}
                      variant="outline"
                      disabled={createCourseMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createCourseMutation.isPending}
                    >
                      {createCourseMutation.isPending ? (
                        <>Creating Course...</>
                      ) : (
                        <>Create Course</>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
      
      {/* Discard Changes Dialog */}
      <AlertDialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you navigate away. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardCourse} className="bg-red-500 hover:bg-red-600">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}