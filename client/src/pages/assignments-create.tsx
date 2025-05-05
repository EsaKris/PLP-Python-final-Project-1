import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS, DURATION_OPTIONS } from '@/lib/constants';
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
  SelectValue,
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
  Trash2, 
  Calendar, 
  Clock, 
  FileText,
  Paperclip,
  Link,
  Upload,
  Save,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

// Types
interface Course {
  id: number;
  name: string;
  code: string;
}

// Sample data (would come from API in real app)
const sampleCourses: Course[] = [
  { id: 101, name: 'Introduction to Computer Science', code: 'CS101' },
  { id: 102, name: 'Calculus I', code: 'MATH101' },
  { id: 103, name: 'English Composition', code: 'ENG101' },
  { id: 201, name: 'Data Structures and Algorithms', code: 'CS201' },
];

// Form validation schema
const assignmentFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  courseId: z.coerce.number().min(1, "Please select a course"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  dueDate: z.string().min(1, "Due date is required"),
  dueTime: z.string().min(1, "Due time is required"),
  points: z.coerce.number().min(1, "Points must be at least 1"),
  duration: z.string().min(1, "Please select estimated duration"),
  assignmentType: z.enum(['quiz', 'homework', 'project', 'essay', 'exam', 'other']),
  allowLateSubmissions: z.boolean().default(false),
  lateDeductionPercent: z.coerce.number().min(0).max(100).optional(),
  allowResubmissions: z.boolean().default(false), 
  maxResubmissions: z.coerce.number().min(0).optional(),
  visibleToStudents: z.boolean().default(true),
  instructions: z.string().min(1, "Instructions are required"),
  gradingRubric: z.string().optional(),
});

// Define the form values type
type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export default function CreateAssignmentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('basic');
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const [fileAttachments, setFileAttachments] = useState<{ name: string; size: string }[]>([]);
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin_teacher' || user?.role === 'admin';

  // Mock query for courses the teacher teaches
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: async () => {
      // In a real app, this would fetch from the API
      return sampleCourses;
    },
    enabled: isTeacher,
  });

  // Initialize the form
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: '',
      courseId: 0,
      description: '',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      dueTime: '23:59',
      points: 100,
      duration: '30',
      assignmentType: 'homework',
      allowLateSubmissions: true,
      lateDeductionPercent: 10,
      allowResubmissions: false,
      maxResubmissions: 0,
      visibleToStudents: true,
      instructions: '',
      gradingRubric: '',
    },
  });

  // Check if form is being filled 
  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;

  // Watch values for conditional fields
  const allowLateSubmissions = form.watch('allowLateSubmissions');
  const allowResubmissions = form.watch('allowResubmissions');
  const assignmentType = form.watch('assignmentType');

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (data: AssignmentFormValues) => {
      // Format the data
      const assignmentData = {
        ...data,
        status: isDraft ? 'draft' : 'published',
        dueDateTime: `${data.dueDate}T${data.dueTime}:00`,
        attachments: fileAttachments,
      };
      
      const res = await apiRequest("POST", API_ENDPOINTS.ASSIGNMENTS.LIST, assignmentData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: isDraft 
          ? "Assignment draft saved" 
          : "Assignment created successfully",
        description: isDraft
          ? "You can continue editing this assignment later."
          : "Students can now view and complete this assignment.",
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ASSIGNMENTS.LIST] });
      // Navigate back to assignments page
      setTimeout(() => navigate('/assignments'), 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create assignment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: AssignmentFormValues) => {
    // Validate all tabs before submission
    if (activeTab !== 'review') {
      // Move to review tab
      setActiveTab('review');
      return;
    }
    
    // Submit the form
    createAssignmentMutation.mutate(data);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, we would upload these files to a server
      // For now, we'll just add them to our list
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
      }));
      
      setFileAttachments([...fileAttachments, ...newFiles]);
      e.target.value = ''; // Reset the input
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Remove a file attachment
  const removeAttachment = (index: number) => {
    const updatedAttachments = [...fileAttachments];
    updatedAttachments.splice(index, 1);
    setFileAttachments(updatedAttachments);
  };

  // Handle discard assignment
  const handleDiscardAssignment = () => {
    form.reset();
    setFileAttachments([]);
    setIsDraft(false);
    setDiscardDialogOpen(false);
    setActiveTab('basic');
    toast({
      title: "Assignment discarded",
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
          You don't have permission to create assignments. This feature is available for teachers and administrators.
        </p>
        <Button className="mt-4" onClick={() => navigate('/assignments')}>
          View Assignments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Assignment</h1>
          <p className="text-muted-foreground">
            Create a new assignment for your students
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
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                  <CardDescription>
                    Provide the basic information about your assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignment Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Week 3 Homework: Variables and Functions" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear title that describes what the assignment is about
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value.toString()} 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {coursesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading courses...
                                </SelectItem>
                              ) : (
                                courses?.map(course => (
                                  <SelectItem key={course.id} value={course.id.toString()}>
                                    {course.code}: {course.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          The course this assignment belongs to
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
                        <FormLabel>Assignment Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe what students will be doing in this assignment..."
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief overview of the assignment (students will see this in their list)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
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
                            Maximum points students can earn
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                {DURATION_OPTIONS.map(duration => (
                                  <SelectItem key={duration.value} value={duration.value.toString()}>
                                    {duration.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            How long students should expect to spend
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="assignmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignment Type</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            value={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="homework" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Homework
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="quiz" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Quiz
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="project" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Project
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="essay" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Essay
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="exam" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Exam
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Other
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (isFormDirty) {
                        setDiscardDialogOpen(true);
                      } else {
                        navigate('/assignments');
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('settings')}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Settings</CardTitle>
                  <CardDescription>
                    Configure submission and grading options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="visibleToStudents"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Visible to Students
                          </FormLabel>
                          <FormDescription>
                            Make this assignment visible to students immediately
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
                    name="allowLateSubmissions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Late Submissions
                          </FormLabel>
                          <FormDescription>
                            Allow students to submit after the due date
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
                  
                  {allowLateSubmissions && (
                    <FormField
                      control={form.control}
                      name="lateDeductionPercent"
                      render={({ field }) => (
                        <FormItem className="ml-6">
                          <FormLabel>Late Submission Penalty (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              max={100}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(parseInt(value));
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Percentage deducted from the score for late submissions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="allowResubmissions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Resubmissions
                          </FormLabel>
                          <FormDescription>
                            Allow students to resubmit their work after grading
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
                  
                  {allowResubmissions && (
                    <FormField
                      control={form.control}
                      name="maxResubmissions"
                      render={({ field }) => (
                        <FormItem className="ml-6">
                          <FormLabel>Maximum Resubmissions</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(parseInt(value));
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of times a student can resubmit (0 means unlimited)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="space-y-2">
                    <FormLabel>File Attachments</FormLabel>
                    <FormDescription>
                      Upload any files that students will need for this assignment
                    </FormDescription>
                    
                    <div className="border rounded-md p-4">
                      {fileAttachments.length > 0 ? (
                        <ul className="space-y-2 mb-4">
                          {fileAttachments.map((file, index) => (
                            <li 
                              key={index} 
                              className="flex items-center justify-between bg-muted p-2 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {file.size}
                                </Badge>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                onClick={() => removeAttachment(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          <Paperclip className="h-8 w-8 mx-auto mb-2" />
                          <p>No files attached yet</p>
                        </div>
                      )}
                      
                      <Input
                        type="file"
                        id="attachments"
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('attachments')?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Files
                      </Button>
                    </div>
                  </div>
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
                  <CardTitle>Assignment Content</CardTitle>
                  <CardDescription>
                    Provide detailed instructions and grading criteria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide detailed instructions for the assignment..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed steps and requirements for completing the assignment
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gradingRubric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grading Rubric (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe how the assignment will be graded..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Explain how points will be allocated and what criteria will be used for grading
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Online resources */}
                  <div className="space-y-2">
                    <FormLabel>External Resources (Optional)</FormLabel>
                    <FormDescription>
                      Add links to helpful resources for this assignment
                    </FormDescription>
                    
                    <div className="space-y-2 border rounded-md p-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Resource URL (e.g., https://example.com)"
                          id="resource-url"
                        />
                        <Input
                          placeholder="Link description"
                          id="resource-description"
                          className="sm:max-w-[200px]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="shrink-0"
                        >
                          <Link className="mr-2 h-4 w-4" /> Add Link
                        </Button>
                      </div>
                      
                      <div className="text-center p-4 text-muted-foreground">
                        <Link className="h-8 w-8 mx-auto mb-2" />
                        <p>No external resources added yet</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('settings')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('review')}
                  >
                    Review Assignment
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Review Tab */}
            <TabsContent value="review" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Assignment</CardTitle>
                  <CardDescription>
                    Review all information before creating the assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <FileText className="mr-2 h-5 w-5" /> Basic Information
                        </h3>
                        <Separator className="my-2" />
                        <dl className="space-y-2">
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Title</dt>
                            <dd className="font-medium">{form.watch('title') || 'Not provided'}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Course</dt>
                            <dd className="font-medium">
                              {courses?.find(c => c.id === form.watch('courseId'))?.name || 'No course selected'}
                            </dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Type</dt>
                            <dd className="font-medium capitalize">
                              {form.watch('assignmentType') || 'Not specified'}
                            </dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Points</dt>
                            <dd className="font-medium">
                              {form.watch('points')} points
                            </dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Estimated Duration</dt>
                            <dd className="font-medium">
                              {DURATION_OPTIONS.find(d => d.value.toString() === form.watch('duration'))?.label || 'Not specified'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Calendar className="mr-2 h-5 w-5" /> Due Date
                        </h3>
                        <Separator className="my-2" />
                        <p className="font-medium">
                          {new Date(`${form.watch('dueDate')}T${form.watch('dueTime')}:00`).toLocaleString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Paperclip className="mr-2 h-5 w-5" /> Attachments
                        </h3>
                        <Separator className="my-2" />
                        {fileAttachments.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {fileAttachments.map((file, index) => (
                              <li key={index}>
                                <span className="text-sm">{file.name} ({file.size})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No files attached</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Check className="mr-2 h-5 w-5" /> Settings
                        </h3>
                        <Separator className="my-2" />
                        <dl className="space-y-2">
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-muted-foreground">Visible to Students</dt>
                            <dd>
                              {form.watch('visibleToStudents') ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-muted-foreground">Allow Late Submissions</dt>
                            <dd>
                              {form.watch('allowLateSubmissions') ? (
                                <div className="flex items-center">
                                  <Check className="h-5 w-5 text-green-500 mr-1" />
                                  {form.watch('lateDeductionPercent') > 0 && (
                                    <span className="text-sm">(-{form.watch('lateDeductionPercent')}%)</span>
                                  )}
                                </div>
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-muted-foreground">Allow Resubmissions</dt>
                            <dd>
                              {form.watch('allowResubmissions') ? (
                                <div className="flex items-center">
                                  <Check className="h-5 w-5 text-green-500 mr-1" />
                                  {form.watch('maxResubmissions') > 0 && (
                                    <span className="text-sm">
                                      (Max: {form.watch('maxResubmissions')})
                                    </span>
                                  )}
                                  {form.watch('maxResubmissions') === 0 && (
                                    <span className="text-sm">(Unlimited)</span>
                                  )}
                                </div>
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Description</h3>
                        <Separator className="my-2" />
                        <p className="text-sm whitespace-pre-line">
                          {form.watch('description') || 'No description provided.'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Status</h3>
                        <Separator className="my-2" />
                        <Badge className={isDraft ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                          {isDraft ? "Draft" : "Ready to Publish"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {isDraft 
                            ? "This assignment will be saved as a draft and won't be visible to students yet."
                            : form.watch('visibleToStudents')
                              ? "This assignment will be published and immediately visible to students."
                              : "This assignment will be created but hidden from students until you make it visible."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Instructions</h3>
                    <Separator className="my-2" />
                    <div className="p-4 border rounded-md bg-muted/50 whitespace-pre-line">
                      {form.watch('instructions') || 'No instructions provided.'}
                    </div>
                  </div>
                  
                  {form.watch('gradingRubric') && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Grading Rubric</h3>
                      <Separator className="my-2" />
                      <div className="p-4 border rounded-md bg-muted/50 whitespace-pre-line">
                        {form.watch('gradingRubric')}
                      </div>
                    </div>
                  )}
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
                      disabled={createAssignmentMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createAssignmentMutation.isPending}
                    >
                      {createAssignmentMutation.isPending ? (
                        <>Creating Assignment...</>
                      ) : (
                        <>Create Assignment</>
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
            <AlertDialogAction onClick={handleDiscardAssignment} className="bg-red-500 hover:bg-red-600">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}