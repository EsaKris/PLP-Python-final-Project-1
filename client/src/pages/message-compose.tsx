import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { API_ENDPOINTS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Send,
  Save,
  Trash2,
  X,
  Search,
  User,
  Check,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Message composition form schema
const messageSchema = z.object({
  recipientId: z.string({
    required_error: "Please select a recipient",
  }),
  subject: z.string()
    .min(1, "Subject is required")
    .max(100, "Subject cannot exceed 100 characters"),
  content: z.string()
    .min(1, "Message content is required")
    .max(5000, "Message cannot exceed 5000 characters"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export default function MessageComposePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipientType, setSelectedRecipientType] = useState('all');

  // Form for message composition
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      recipientId: '',
      subject: '',
      content: '',
    },
  });

  // Mock recipients data - this would come from an API in a real app
  const recipients = [
    {
      id: '2',
      name: 'Dr. John Smith',
      email: 'john.smith@edu.com',
      avatar: null,
      role: 'teacher',
      department: 'Computer Science'
    },
    {
      id: '3',
      name: 'Prof. Maria Johnson',
      email: 'maria.johnson@edu.com',
      avatar: null,
      role: 'teacher',
      department: 'Mathematics'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.w@edu.com',
      avatar: null,
      role: 'student',
      grade: '11'
    },
    {
      id: '5',
      name: 'Michael Chen',
      email: 'michael.c@edu.com',
      avatar: null,
      role: 'student',
      grade: '12'
    },
    {
      id: '6',
      name: 'Dr. Laura Garcia',
      email: 'laura.garcia@edu.com',
      avatar: null,
      role: 'teacher',
      department: 'Biology'
    },
    {
      id: '7',
      name: 'James Wilson',
      email: 'james.w@edu.com',
      avatar: null,
      role: 'student',
      grade: '10'
    },
  ];

  // Filter recipients based on search and type
  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(recipientSearch.toLowerCase());
    const matchesType = selectedRecipientType === 'all' || recipient.role === selectedRecipientType;
    
    return matchesSearch && matchesType;
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Mock send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      // In a real app, this would be an API call
      console.log('Sending message:', data);
      return new Promise<void>((resolve) => {
        // Simulate API delay
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
      // Navigate back to messages
      navigate('/messages');
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mock save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      // In a real app, this would be an API call
      console.log('Saving draft:', data);
      return new Promise<void>((resolve) => {
        // Simulate API delay
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Draft saved",
        description: "Your message has been saved as a draft",
      });
      // Navigate back to messages
      navigate('/messages');
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save draft",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: MessageFormValues) => {
    sendMessageMutation.mutate(data);
  };

  // Handle save as draft
  const saveAsDraft = () => {
    const data = form.getValues();
    saveDraftMutation.mutate(data);
  };

  // Handle discard
  const handleDiscard = () => {
    // Check if form has been edited
    if (form.formState.isDirty) {
      // Confirm discard
      if (window.confirm("Are you sure you want to discard this message?")) {
        navigate('/messages');
      }
    } else {
      navigate('/messages');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/messages')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Messages
        </Button>
        <h1 className="text-3xl font-bold">Compose Message</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
          <CardDescription>
            Compose a new message to send to teachers or classmates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipientId"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Recipient</FormLabel>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search by name or email..."
                            className="pl-8"
                            value={recipientSearch}
                            onChange={(e) => setRecipientSearch(e.target.value)}
                          />
                        </div>
                        <Select
                          value={selectedRecipientType}
                          onValueChange={setSelectedRecipientType}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Filter by type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Recipients</SelectItem>
                            <SelectItem value="teacher">Teachers</SelectItem>
                            <SelectItem value="student">Students</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="max-h-56 overflow-y-auto border rounded-md">
                        {filteredRecipients.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No recipients found
                          </div>
                        ) : (
                          <div className="p-1">
                            {filteredRecipients.map((recipient) => (
                              <div
                                key={recipient.id}
                                className={`flex items-center justify-between p-3 rounded-md cursor-pointer
                                  ${field.value === recipient.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                                `}
                                onClick={() => form.setValue('recipientId', recipient.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={recipient.avatar || ''} alt={recipient.name} />
                                    <AvatarFallback>{getInitials(recipient.name)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{recipient.name}</p>
                                    <p className="text-xs text-muted-foreground">{recipient.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      recipient.role === 'teacher'
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                    }
                                  >
                                    {recipient.role === 'teacher' ? 'Teacher' : 'Student'}
                                  </Badge>
                                  {field.value === recipient.id && (
                                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subject..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Compose your message here..." 
                        className="min-h-32 resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDiscard}
                    disabled={sendMessageMutation.isPending || saveDraftMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={saveAsDraft}
                    disabled={sendMessageMutation.isPending || saveDraftMutation.isPending}
                  >
                    {saveDraftMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save as Draft
                      </>
                    )}
                  </Button>
                </div>
                
                <Button 
                  type="submit"
                  disabled={sendMessageMutation.isPending || saveDraftMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}