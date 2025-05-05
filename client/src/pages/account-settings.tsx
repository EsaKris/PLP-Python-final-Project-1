import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle,
  Bell,
  CreditCard,
  Download,
  HelpCircle,
  KeyRound,
  Languages,
  LogOut,
  Save,
  Settings,
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  Trash2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Form validation schemas
const accountFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  emailMarketing: z.boolean().default(false),
  emailAssignments: z.boolean().default(true),
  emailGrades: z.boolean().default(true),
  emailAnnouncements: z.boolean().default(true),
  emailMessages: z.boolean().default(true),
  emailReminders: z.boolean().default(true),
});

// Form values types
type AccountFormValues = z.infer<typeof accountFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pendingSessionsOpen, setPendingSessionsOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  // Account form
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: user?.firstName || user?.first_name || '',
      lastName: user?.lastName || user?.last_name || '',
      email: user?.email || '',
      username: user?.username || '',
      bio: '',
      phoneNumber: '',
      dateOfBirth: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      emailMarketing: false,
      emailAssignments: true,
      emailGrades: true,
      emailAnnouncements: true,
      emailMessages: true,
      emailReminders: true,
    },
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: async (data: AccountFormValues) => {
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      // Add profile image if it exists
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }
      
      const res = await apiRequest("PUT", "/api/auth/profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Account updated",
        description: "Your account details have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      const res = await apiRequest("PUT", "/api/auth/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update notifications mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: NotificationFormValues) => {
      const res = await apiRequest("PUT", "/api/auth/notifications", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update notification preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle account form submission
  const onAccountSubmit = (data: AccountFormValues) => {
    updateAccountMutation.mutate(data);
  };

  // Handle password form submission
  const onPasswordSubmit = (data: PasswordFormValues) => {
    updatePasswordMutation.mutate(data);
  };

  // Handle notification form submission
  const onNotificationSubmit = (data: NotificationFormValues) => {
    updateNotificationsMutation.mutate(data);
  };

  // Handle profile image upload
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
    }
  };

  // Sample active sessions data
  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.1",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Boston, USA",
      ip: "192.168.1.2",
      lastActive: "1 hour ago",
      isCurrent: false,
    },
    {
      id: 3,
      device: "Firefox on macOS",
      location: "London, UK",
      ip: "192.168.1.3",
      lastActive: "2 days ago",
      isCurrent: false,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sm:w-full md:w-64 shrink-0 mb-4 md:mb-0">
          <TabsList className="grid grid-cols-3 md:grid-cols-1 gap-2 h-auto">
            <TabsTrigger
              value="account"
              className="flex items-start justify-start px-3 py-2 data-[state=active]:border-l-2 md:data-[state=active]:border-l-4 data-[state=active]:border-primary"
            >
              <User className="h-4 w-4 mr-2" /> 
              Account
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-start justify-start px-3 py-2 data-[state=active]:border-l-2 md:data-[state=active]:border-l-4 data-[state=active]:border-primary"
            >
              <Shield className="h-4 w-4 mr-2" /> 
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-start justify-start px-3 py-2 data-[state=active]:border-l-2 md:data-[state=active]:border-l-4 data-[state=active]:border-primary"
            >
              <Bell className="h-4 w-4 mr-2" /> 
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1">
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and public profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...accountForm}>
                  <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center">
                        <div className="mb-4">
                          <Avatar className="h-32 w-32">
                            {profileImage ? (
                              <AvatarImage src={profileImage} alt={user?.username} />
                            ) : (
                              <>
                                <AvatarImage src={user?.profileImage} alt={user?.username} />
                                <AvatarFallback className="text-2xl">
                                  {user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || 'U'}
                                  {user?.lastName?.[0] || user?.last_name?.[0] || ''}
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                        </div>

                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            id="profile-image"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('profile-image')?.click()}
                            className="w-full"
                          >
                            <UploadCloud className="mr-2 h-4 w-4" /> Upload Image
                          </Button>
                          
                          {profileImage && (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full text-red-500 hover:text-red-600"
                              onClick={() => setProfileImage(null)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="md:w-2/3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={accountForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your first name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={accountForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={accountForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is your public username. It can be your real name or a pseudonym.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={accountForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is the email address associated with your account.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={accountForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us a little about yourself"
                                  className="min-h-24 resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Write a short bio about yourself. This will be visible on your profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={accountForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={accountForm.control}
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
                      </div>
                    </div>

                    <Alert variant="outline" className="bg-muted/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Privacy Information</AlertTitle>
                      <AlertDescription>
                        Your personal information is protected according to our privacy policy. Only your username and profile picture will be visible to other users.
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        disabled={updateAccountMutation.isPending}
                      >
                        {updateAccountMutation.isPending ? (
                          <>Updating...</>
                        ) : (
                          <>Save Changes</>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Profile Visibility</h3>
                    <p className="text-muted-foreground text-sm">
                      Control who can see your profile information
                    </p>
                  </div>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Language Preference</h3>
                    <p className="text-muted-foreground text-sm">
                      Set your preferred language for the application
                    </p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-1">
                  <h3 className="font-medium">Data Export</h3>
                  <p className="text-muted-foreground text-sm">
                    Download a copy of your data from the platform
                  </p>
                  <Button variant="outline" className="mt-2">
                    <Download className="mr-2 h-4 w-4" /> Download Data
                  </Button>
                </div>

                <Separator />

                <div className="space-y-1">
                  <h3 className="font-medium text-red-500">Delete Account</h3>
                  <p className="text-muted-foreground text-sm">
                    Permanently delete your account and all associated data
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={() => setDeleteAccountOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter your current password" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
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
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showNewPassword ? "text" : "password"} 
                                placeholder="Enter your new password" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <FormDescription>
                            Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number.
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
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm your new password" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        disabled={updatePasswordMutation.isPending}
                      >
                        {updatePasswordMutation.isPending ? (
                          <>Updating...</>
                        ) : (
                          <>Update Password</>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                    <p className="text-muted-foreground text-sm">
                      Require an authentication code when you sign in
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <Separator />

                <div className="space-y-1">
                  <h3 className="font-medium">Backup Codes</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate backup codes to use when you can't receive authentication codes
                  </p>
                  <Button variant="outline" className="mt-2">
                    <KeyRound className="mr-2 h-4 w-4" /> Generate Backup Codes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active sessions and sign out from other devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <h3 className="font-medium">{session.device}</h3>
                          {session.isCurrent && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Location: {session.location}</p>
                          <p>IP: {session.ip}</p>
                          <p>Last active: {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={() => setPendingSessionsOpen(true)}
                  >
                    Sign Out All Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Delivery Methods</h3>
                      
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
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
                        control={notificationForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications in the app and on your device
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
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Email Notification Types</h3>
                      
                      <FormField
                        control={notificationForm.control}
                        name="emailAssignments"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Assignment Notifications</FormLabel>
                              <FormDescription>
                                Get notified about new assignments and deadlines
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
                        control={notificationForm.control}
                        name="emailGrades"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Grade Notifications</FormLabel>
                              <FormDescription>
                                Get notified when you receive new grades
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
                        control={notificationForm.control}
                        name="emailAnnouncements"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Announcement Notifications</FormLabel>
                              <FormDescription>
                                Get notified about important announcements
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
                        control={notificationForm.control}
                        name="emailMessages"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Message Notifications</FormLabel>
                              <FormDescription>
                                Get notified when you receive new messages
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
                        control={notificationForm.control}
                        name="emailReminders"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Reminder Notifications</FormLabel>
                              <FormDescription>
                                Get reminders about upcoming deadlines and events
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
                        control={notificationForm.control}
                        name="emailMarketing"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Marketing Emails</FormLabel>
                              <FormDescription>
                                Receive marketing and promotional emails
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
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        disabled={updateNotificationsMutation.isPending}
                      >
                        {updateNotificationsMutation.isPending ? (
                          <>Saving...</>
                        ) : (
                          <>Save Preferences</>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>
                  View a history of communications sent to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Weekly Progress Report</h4>
                        <p className="text-sm text-muted-foreground">
                          Summary of your academic progress for the week
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        May 1, 2025
                      </span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">New Assignment Notification</h4>
                        <p className="text-sm text-muted-foreground">
                          CS101: Final Project has been assigned
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Apr 28, 2025
                      </span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Grade Posted</h4>
                        <p className="text-sm text-muted-foreground">
                          Your grade for MATH101: Midterm Exam has been posted
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Apr 25, 2025
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline">
                    View All Communications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Sign Out All Other Devices Dialog */}
      <Dialog open={pendingSessionsOpen} onOpenChange={setPendingSessionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out All Other Devices</DialogTitle>
            <DialogDescription>
              This will sign you out of all devices except the current one. You'll need to sign in again on those devices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <p className="text-sm font-medium">Are you sure you want to continue?</p>
            <p className="text-sm text-muted-foreground">
              If you didn't initiate these sessions, consider changing your password immediately.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingSessionsOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setPendingSessionsOpen(false);
                toast({
                  title: "Sign out successful",
                  description: "You've been signed out from all other devices.",
                });
              }}
            >
              Sign Out All Other Devices
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                All your data including courses, assignments, and submissions will be permanently deleted.
              </AlertDescription>
            </Alert>
            <p className="text-sm font-medium mt-4">Please type "delete my account" to confirm:</p>
            <Input placeholder="delete my account" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setDeleteAccountOpen(false);
                toast({
                  title: "Account deletion initiated",
                  description: "Your account will be deleted within 24 hours.",
                });
              }}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}