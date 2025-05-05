import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation, Link } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS, FORUM_CATEGORIES } from '@/lib/constants';
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare,
  Search,
  Plus,
  MessageCircle,
  PinIcon,
  Eye,
  Clock,
  User,
  MessageSquareOff,
  ArrowUpRight,
  ArrowUpRightFromCircle,
  ArrowRight,
  CalendarDays,
  BookOpen,
  Tag,
  Filter
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";

// Types
interface ForumTopic {
  id: number;
  title: string;
  content: string;
  category: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastReply?: {
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
  };
}

// Function to get category badge color
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'general':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'course_specific':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'homework_help':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'technical_support':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'events':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

// Sample forum data (would come from API in a real app)
const sampleForumTopics: ForumTopic[] = [
  {
    id: 1,
    title: 'Welcome to the Forums! Please Introduce Yourself',
    content: 'Welcome everyone to our learning community forums! This is a space for us to connect, collaborate, and support each other throughout our learning journey. Please take a moment to introduce yourself – share your name, what you\'re studying, and something interesting about yourself. Looking forward to getting to know you all!',
    category: 'general',
    author: {
      id: 1,
      name: 'Prof. Jackson',
      avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=PJ'
    },
    createdAt: '2025-04-01T09:30:00Z',
    updatedAt: '2025-04-01T09:30:00Z',
    isPinned: true,
    isLocked: false,
    viewCount: 342,
    replyCount: 28,
    lastReply: {
      author: {
        id: 5,
        name: 'Morgan Lee',
        avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=ML'
      },
      createdAt: '2025-05-03T14:25:00Z'
    }
  },
  {
    id: 2,
    title: 'Tips for Mastering Calculus I: Derivatives and Integrals',
    content: 'Hello fellow math enthusiasts! I wanted to create a thread where we can share our best tips and resources for mastering calculus, particularly derivatives and integrals. What strategies have helped you understand these concepts?',
    category: 'course_specific',
    author: {
      id: 2,
      name: 'Jamie Smith',
      avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=JS'
    },
    createdAt: '2025-04-10T15:45:00Z',
    updatedAt: '2025-04-10T15:45:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 189,
    replyCount: 16,
    lastReply: {
      author: {
        id: 3,
        name: 'Alex Wilson',
        avatar: 'https://placehold.co/100x100/e67e22/ffffff?text=AW'
      },
      createdAt: '2025-05-02T18:05:00Z'
    }
  },
  {
    id: 3,
    title: 'Help Needed with Week 3 Programming Assignment',
    content: 'I\'m having trouble with the recursive function implementation in the Week 3 programming assignment. My code keeps giving an infinite loop. Can someone give me a hint without giving away the entire solution?',
    category: 'homework_help',
    author: {
      id: 3,
      name: 'Alex Wilson',
      avatar: 'https://placehold.co/100x100/e67e22/ffffff?text=AW'
    },
    createdAt: '2025-04-18T11:20:00Z',
    updatedAt: '2025-04-18T11:20:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 94,
    replyCount: 7,
    lastReply: {
      author: {
        id: 4,
        name: 'Robin Taylor',
        avatar: 'https://placehold.co/100x100/8e44ad/ffffff?text=RT'
      },
      createdAt: '2025-04-30T16:42:00Z'
    }
  },
  {
    id: 4,
    title: 'Can\'t Access Lab Assignment - Technical Support Needed',
    content: 'When I try to access the virtual lab for this week\'s chemistry experiment, I keep getting an error message saying "Resource not available". I\'ve tried different browsers and devices but still have the same issue. Is anyone else experiencing this?',
    category: 'technical_support',
    author: {
      id: 4,
      name: 'Robin Taylor',
      avatar: 'https://placehold.co/100x100/8e44ad/ffffff?text=RT'
    },
    createdAt: '2025-04-22T09:10:00Z',
    updatedAt: '2025-04-22T09:10:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 45,
    replyCount: 5,
    lastReply: {
      author: {
        id: 6,
        name: 'Tech Support',
        avatar: 'https://placehold.co/100x100/c0392b/ffffff?text=TS'
      },
      createdAt: '2025-04-29T10:22:00Z'
    }
  },
  {
    id: 5,
    title: 'Upcoming Guest Lecture: AI in Healthcare - May 15',
    content: 'We\'re excited to announce a special guest lecture on Artificial Intelligence in Healthcare by Dr. Sarah Johnson, a leading researcher from Stanford Medical School. The lecture will be held on May 15 at 4:00 PM in the Main Auditorium and will also be streamed live on our platform.',
    category: 'events',
    author: {
      id: 1,
      name: 'Prof. Jackson',
      avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=PJ'
    },
    createdAt: '2025-04-25T14:00:00Z',
    updatedAt: '2025-04-25T14:00:00Z',
    isPinned: true,
    isLocked: false,
    viewCount: 213,
    replyCount: 12,
    lastReply: {
      author: {
        id: 5,
        name: 'Morgan Lee',
        avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=ML'
      },
      createdAt: '2025-05-01T11:33:00Z'
    }
  },
  {
    id: 6,
    title: 'Study Group for Biology Midterm',
    content: 'I\'m organizing a study group for the upcoming Biology midterm. We\'ll be meeting in the university library, Room 204, every Tuesday and Thursday from 6-8 PM starting next week. All are welcome!',
    category: 'general',
    author: {
      id: 5,
      name: 'Morgan Lee',
      avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=ML'
    },
    createdAt: '2025-04-28T16:15:00Z',
    updatedAt: '2025-04-28T16:15:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 78,
    replyCount: 9,
    lastReply: {
      author: {
        id: 2,
        name: 'Jamie Smith',
        avatar: 'https://placehold.co/100x100/4d3fd1/ffffff?text=JS'
      },
      createdAt: '2025-04-30T19:18:00Z'
    }
  },
  {
    id: 7,
    title: 'Resources for Learning Python Programming',
    content: 'I\'ve been collecting some great resources for learning Python programming and thought I\'d share them here. What resources have you found helpful in your programming journey?',
    category: 'course_specific',
    author: {
      id: 6,
      name: 'Chris Johnson',
      avatar: 'https://placehold.co/100x100/16a085/ffffff?text=CJ'
    },
    createdAt: '2025-05-01T10:30:00Z',
    updatedAt: '2025-05-01T10:30:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 62,
    replyCount: 4,
    lastReply: {
      author: {
        id: 3,
        name: 'Alex Wilson',
        avatar: 'https://placehold.co/100x100/e67e22/ffffff?text=AW'
      },
      createdAt: '2025-05-02T22:07:00Z'
    }
  },
  {
    id: 8,
    title: 'Student Council Elections - Nominations Open',
    content: 'Nominations for the upcoming Student Council elections are now open! If you\'re interested in representing your fellow students and making a positive impact on campus life, please submit your nomination by May 10.',
    category: 'events',
    author: {
      id: 7,
      name: 'Student Affairs',
      avatar: 'https://placehold.co/100x100/2980b9/ffffff?text=SA'
    },
    createdAt: '2025-05-02T13:45:00Z',
    updatedAt: '2025-05-02T13:45:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 54,
    replyCount: 2,
    lastReply: {
      author: {
        id: 5,
        name: 'Morgan Lee',
        avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=ML'
      },
      createdAt: '2025-05-03T09:12:00Z'
    }
  }
];

// Form validation schema for creating a new topic
const newTopicSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  category: z.string().min(1, "Please select a category"),
});

// Define the form values type
type NewTopicFormValues = z.infer<typeof newTopicSchema>;

export default function ForumsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'replies'>('latest');

  // Initialize the form
  const form = useForm<NewTopicFormValues>({
    resolver: zodResolver(newTopicSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
    },
  });

  // Filter and sort forum topics
  const filteredAndSortedTopics = React.useMemo(() => {
    // First, filter by search query and category
    let filtered = sampleForumTopics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // Then sort by the selected criteria
    if (sortBy === 'latest') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === 'replies') {
      filtered = [...filtered].sort((a, b) => b.replyCount - a.replyCount);
    }
    
    // Always put pinned topics at the top within their sort order
    return filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [searchQuery, selectedCategory, sortBy]);

  // Mock mutation for creating a new topic
  const createTopicMutation = useMutation({
    mutationFn: async (data: NewTopicFormValues) => {
      // In a real app, this would be an API call
      console.log("Creating new topic:", data);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Topic created",
        description: "Your new topic has been created successfully.",
      });
      // Close the dialog and reset the form
      setShowNewTopicDialog(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create topic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: NewTopicFormValues) => {
    createTopicMutation.mutate(data);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000; // seconds in a year
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000; // seconds in a month
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400; // seconds in a day
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600; // seconds in an hour
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60; // seconds in a minute
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussion Forums</h1>
          <p className="text-muted-foreground">
            Connect with peers, ask questions, and share knowledge
          </p>
        </div>
        <Button onClick={() => setShowNewTopicDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="space-y-1">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory('all')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                All Topics
              </Button>
              
              {FORUM_CATEGORIES.map(category => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <span className={`mr-2 h-4 w-4 rounded-full inline-block ${getCategoryColor(category.value).split(' ')[0]}`}></span>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">My Activity</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" /> My Topics
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ArrowUpRightFromCircle className="mr-2 h-4 w-4" /> My Replies
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" /> Unread Topics
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Topics:</span>
                <span className="font-medium">{sampleForumTopics.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Posts:</span>
                <span className="font-medium">
                  {sampleForumTopics.reduce((sum, topic) => sum + topic.replyCount + 1, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Users:</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Newest Member:</span>
                <span className="font-medium text-blue-600">Casey Martinez</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search discussions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Sort dropdown */}
            <Select 
              value={sortBy} 
              onValueChange={(value: 'latest' | 'popular' | 'replies') => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Activity</SelectItem>
                <SelectItem value="popular">Most Viewed</SelectItem>
                <SelectItem value="replies">Most Replies</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Topics list */}
          <div className="space-y-4">
            {filteredAndSortedTopics.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <MessageSquareOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No topics found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 
                    "No topics match your search criteria." : 
                    "No topics have been created in this category yet."}
                </p>
                <Button onClick={() => setShowNewTopicDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create a New Topic
                </Button>
              </div>
            ) : (
              filteredAndSortedTopics.map(topic => (
                <Card 
                  key={topic.id} 
                  className={`hover:shadow-md transition-shadow ${topic.isPinned ? 'border-blue-200 dark:border-blue-800' : ''}`}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/forums/${topic.id}`} className="text-lg font-medium hover:text-blue-600 transition-colors">
                            {topic.title}
                          </Link>
                          {topic.isPinned && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                              <PinIcon className="h-3 w-3 mr-1" /> Pinned
                            </Badge>
                          )}
                          {topic.isLocked && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                              Locked
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {topic.content}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className={getCategoryColor(topic.category)}>
                            {FORUM_CATEGORIES.find(cat => cat.value === topic.category)?.label || topic.category}
                          </Badge>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            {topic.viewCount} views
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MessageCircle className="h-3.5 w-3.5 mr-1" />
                            {topic.replyCount} replies
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {formatTimeAgo(topic.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                          <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div className="font-medium">{topic.author.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(topic.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {topic.lastReply && (
                      <div className="flex justify-between items-center pt-3 mt-3 border-t text-sm">
                        <div className="text-muted-foreground">
                          Latest reply
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={topic.lastReply.author.avatar} alt={topic.lastReply.author.name} />
                            <AvatarFallback>{topic.lastReply.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{topic.lastReply.author.name}</span>
                            <span className="text-muted-foreground ml-1">
                              {formatTimeAgo(topic.lastReply.createdAt)}
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/forums/${topic.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Pagination (simplified) */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(page => (
                <Button 
                  key={page}
                  variant={page === 1 ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* New Topic Dialog */}
      <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create a New Topic</DialogTitle>
            <DialogDescription>
              Share your question, idea, or announcement with the community
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter topic title..." {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, specific title helps others find your topic
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {FORUM_CATEGORIES.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Type your message here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details to help others understand your topic
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTopicDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={createTopicMutation.isPending}
            >
              {createTopicMutation.isPending ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}