import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { defaultFetcher, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  School, 
  Save,
  Shield,
  Lock,
  Key,
  Upload,
  Camera,
  Pencil,
  X
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
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

// Form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.any().optional(),
  // Teacher specific fields
  subjectSpecialization: z.string().optional(),
  yearsOfExperience: z.coerce.number().optional(),
  // Student specific fields
  gradeLevel: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('general');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch profile data
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.AUTH.PROFILE],
    queryFn: defaultFetcher,
    retry: false,
  });

  // Main profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      bio: '',
      profileImage: undefined,
      subjectSpecialization: '',
      yearsOfExperience: 0,
      gradeLevel: '',
    },
  });

  // Change password form
  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
  });
  
  // Set form values when profile data is loaded
  React.useEffect(() => {
    if (profileData) {
      profileForm.reset({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        email: profileData.email || '',
        phoneNumber: profileData.phone_number || '',
        dateOfBirth: profileData.date_of_birth 
          ? new Date(profileData.date_of_birth).toISOString().split('T')[0]
          : '',
        bio: profileData.bio || '',
        profileImage: undefined,
        subjectSpecialization: profileData.subject_specialization || '',
        yearsOfExperience: profileData.years_of_experience || 0,
        gradeLevel: profileData.grade_level || '',
      });
    }
  }, [profileData, profileForm]);

  // Get display name for profile
  const getDisplayName = () => {
    if (profileData) {
      if (profileData.first_name && profileData.last_name) {
        return `${profileData.first_name} ${profileData.last_name}`;
      } else if (profileData.username) {
        return profileData.username;
      }
    }
    return 'User';
  };

  // Get avatar fallback text
  const getInitials = () => {
    if (profileData) {
      if (profileData.first_name && profileData.last_name) {
        return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`;
      } else if (profileData.username) {
        return profileData.username.substring(0, 2).toUpperCase();
      }
    }
    return 'U';
  };

  // Get role display text
  const getRoleDisplay = () => {
    if (!user?.role) return 'User';
    
    switch (user.role) {
      case 'student':
        return 'Student';
      case 'teacher':
        return 'Teacher';
      case 'admin_teacher':
        return 'Teacher (Admin)';
      case 'parent':
        return 'Parent';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  // Handle image upload
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Create form data and append file
      const formData = new FormData();
      formData.append('profile_image', file);
      
      try {
        const response = await fetch('/api/auth/profile/image', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        toast({
          title: "Profile image updated",
          description: "Your profile image has been updated successfully.",
        });
        
        // Invalidate profile cache to get updated image
        queryClient.invalidateQueries([API_ENDPOINTS.AUTH.PROFILE]);
      } catch (error) {
        toast({
          title: "Error uploading image",
          description: error instanceof Error ? error.message : 'Failed to upload image',
          variant: "destructive",
        });
      }
    }
  };

  // Clear profile image
  const clearProfileImage = () => {
    setPreviewImage(null);
    profileForm.setValue('profileImage', null);
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Create FormData if there's an image
      const formData = new FormData();
      
      // Add all other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'profileImage' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add the image if it exists
      if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
      }
      
      // Send the request
      const response = await fetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.AUTH.PROFILE] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordValues) => {
      const response = await fetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to change password');
      }
      
      return response.json();
    },
    onSuccess: () => {
      passwordForm.reset();
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error changing password",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle profile submit
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Handle password change submit
  const onPasswordSubmit = (data: ChangePasswordValues) => {
    changePasswordMutation.mutate(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md">
        <h2 className="text-lg font-semibold text-destructive">Error loading profile</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Badge className="mt-2 sm:mt-0" variant="outline">
          {getRoleDisplay()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr]">
        {/* Profile sidebar */}
        <div className="flex flex-col gap-6">
          {/* User card */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 mx-auto mb-2">
                  <AvatarImage 
                    src={previewImage || (profileData?.profile_image ? `data:image/jpeg;base64,${profileData.profile_image}` : undefined)}
                    alt={getDisplayName()} 
                  />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <label 
                    htmlFor="profile-image-upload" 
                    className="cursor-pointer bg-primary text-white p-1 rounded-full hover:bg-primary/80 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input 
                      id="profile-image-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              <h3 className="text-xl font-semibold">{getDisplayName()}</h3>
              <p className="text-muted-foreground">{profileData?.email}</p>
              
              <div className="mt-4 w-full flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> 
                  <span>Joined {new Date(profileData?.date_joined || '').toLocaleDateString()}</span>
                </div>
                {profileData?.last_login_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" /> 
                    <span>Last login {new Date(profileData.last_login_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Tab navigation */}
          <Card>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button 
                  className={`flex items-center gap-2 p-3 hover:bg-muted transition-colors text-left ${selectedTab === 'general' ? 'bg-muted font-medium' : ''}`}
                  onClick={() => setSelectedTab('general')}
                >
                  <User className="h-4 w-4" />
                  <span>General Information</span>
                </button>
                <button 
                  className={`flex items-center gap-2 p-3 hover:bg-muted transition-colors text-left ${selectedTab === 'security' ? 'bg-muted font-medium' : ''}`}
                  onClick={() => setSelectedTab('security')}
                >
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </button>
                {user?.role === 'teacher' || user?.role === 'admin_teacher' && (
                  <button 
                    className={`flex items-center gap-2 p-3 hover:bg-muted transition-colors text-left ${selectedTab === 'teacher' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setSelectedTab('teacher')}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Teaching Profile</span>
                  </button>
                )}
                {user?.role === 'student' && (
                  <button 
                    className={`flex items-center gap-2 p-3 hover:bg-muted transition-colors text-left ${selectedTab === 'student' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setSelectedTab('student')}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Student Profile</span>
                  </button>
                )}
              </nav>
            </CardContent>
          </Card>
          
          {/* Delete account */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account 
                      and remove all associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        toast({
                          title: "Account deletion is disabled",
                          description: "Account deletion is not available at this time. Please contact an administrator.",
                        });
                      }}
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedTab === 'general' && 'Personal Information'}
                {selectedTab === 'security' && 'Security Settings'}
                {selectedTab === 'teacher' && 'Teaching Profile'}
                {selectedTab === 'student' && 'Student Information'}
              </CardTitle>
              <CardDescription>
                {selectedTab === 'general' && 'Update your personal details and contact information'}
                {selectedTab === 'security' && 'Manage your password and security preferences'}
                {selectedTab === 'teacher' && 'Configure your teaching profile and specialization'}
                {selectedTab === 'student' && 'Update your student information and grade level'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              {/* General information form */}
              {selectedTab === 'general' && (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a little about yourself" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Profile image preview */}
                    {previewImage && (
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Label>New Profile Image</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearProfileImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={previewImage} alt="Preview" />
                            <AvatarFallback>{getInitials()}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm text-muted-foreground">
                            This image will be used as your profile picture.
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                        className="gap-2"
                      >
                        {updateProfileMutation.isPending ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
              
              {/* Security settings */}
              {selectedTab === 'security' && (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={changePasswordMutation.isPending}
                        className="gap-2"
                      >
                        {changePasswordMutation.isPending ? (
                          <>Updating...</>
                        ) : (
                          <>
                            <Key className="h-4 w-4" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
              
              {/* Teacher profile */}
              {selectedTab === 'teacher' && (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="subjectSpecialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Specialization</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your subject area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Science">Science</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Computer Science">Computer Science</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="History">History</SelectItem>
                              <SelectItem value="Geography">Geography</SelectItem>
                              <SelectItem value="Art">Art</SelectItem>
                              <SelectItem value="Music">Music</SelectItem>
                              <SelectItem value="Physical Education">Physical Education</SelectItem>
                              <SelectItem value="Foreign Languages">Foreign Languages</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              {...field} 
                              onChange={(e) => {
                                const value = e.target.value === "" ? "0" : e.target.value;
                                field.onChange(parseInt(value, 10));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                        className="gap-2"
                      >
                        {updateProfileMutation.isPending ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
              
              {/* Student profile */}
              {selectedTab === 'student' && (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your grade level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                              <SelectItem value="1st Grade">1st Grade</SelectItem>
                              <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                              <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                              <SelectItem value="4th Grade">4th Grade</SelectItem>
                              <SelectItem value="5th Grade">5th Grade</SelectItem>
                              <SelectItem value="6th Grade">6th Grade</SelectItem>
                              <SelectItem value="7th Grade">7th Grade</SelectItem>
                              <SelectItem value="8th Grade">8th Grade</SelectItem>
                              <SelectItem value="9th Grade">9th Grade</SelectItem>
                              <SelectItem value="10th Grade">10th Grade</SelectItem>
                              <SelectItem value="11th Grade">11th Grade</SelectItem>
                              <SelectItem value="12th Grade">12th Grade</SelectItem>
                              <SelectItem value="College Freshman">College Freshman</SelectItem>
                              <SelectItem value="College Sophomore">College Sophomore</SelectItem>
                              <SelectItem value="College Junior">College Junior</SelectItem>
                              <SelectItem value="College Senior">College Senior</SelectItem>
                              <SelectItem value="Graduate Student">Graduate Student</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                        className="gap-2"
                      >
                        {updateProfileMutation.isPending ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}