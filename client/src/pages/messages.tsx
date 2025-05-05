import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { defaultFetcher } from '@/lib/query';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Search, 
  Send, 
  User, 
  Inbox, 
  Send as SendIcon, 
  PenBox
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function MessagesPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Mock messages data for demo
  const messages = [
    {
      id: 1,
      sender: {
        id: 2,
        name: 'Dr. John Smith',
        avatar: null,
        role: 'teacher'
      },
      recipient: {
        id: 1,
        name: 'You',
        avatar: null,
        role: 'student'
      },
      subject: 'Programming Assignment Feedback',
      content: "Hello! I've reviewed your latest programming assignment and have some feedback. Your solution to the array manipulation problem was very efficient, but there are a couple of edge cases you didn't handle. Let me know if you'd like to discuss this further.",
      timestamp: '2025-05-04T14:30:00Z',
      isRead: false,
      type: 'inbox'
    },
    {
      id: 2,
      sender: {
        id: 3,
        name: 'Prof. Maria Johnson',
        avatar: null,
        role: 'teacher'
      },
      recipient: {
        id: 1,
        name: 'You',
        avatar: null,
        role: 'student'
      },
      subject: 'Math Assignment Due Date Extended',
      content: "I wanted to let you know that I've extended the due date for the calculus problem set to next Friday. This should give everyone additional time to work through the more challenging problems. As always, feel free to come to office hours if you need assistance.",
      timestamp: '2025-05-03T10:15:00Z',
      isRead: true,
      type: 'inbox'
    },
    {
      id: 3,
      sender: {
        id: 1,
        name: 'You',
        avatar: null,
        role: 'student'
      },
      recipient: {
        id: 2,
        name: 'Dr. John Smith',
        avatar: null,
        role: 'teacher'
      },
      subject: 'Question about the Final Project',
      content: "Good afternoon Dr. Smith, I'm working on the final project for the programming class and had a question about the requirements. The assignment mentions using a database, but doesn't specify what type. Would it be acceptable to use SQLite for this project, or would you prefer we use PostgreSQL as we did in the earlier modules?",
      timestamp: '2025-05-02T16:45:00Z',
      isRead: true,
      type: 'sent'
    },
    {
      id: 4,
      sender: {
        id: 4,
        name: 'Sarah Williams',
        avatar: null,
        role: 'student'
      },
      recipient: {
        id: 1,
        name: 'You',
        avatar: null,
        role: 'student'
      },
      subject: 'Study Group for History Exam',
      content: "Hi there! A few of us are forming a study group for the upcoming history exam. We're planning to meet at the library this Saturday from 2-4 PM. Would you like to join us? We'll be focusing on the post-World War II era which Prof. Williams mentioned would be a significant part of the exam.",
      timestamp: '2025-05-01T09:20:00Z',
      isRead: true,
      type: 'inbox'
    },
    {
      id: 5,
      sender: {
        id: 1,
        name: 'You',
        avatar: null,
        role: 'student'
      },
      recipient: {
        id: 3,
        name: 'Prof. Maria Johnson',
        avatar: null,
        role: 'teacher'
      },
      subject: 'Clarification on Homework #3',
      content: "Hello Professor Johnson, I'm working on problem #5 of the latest homework and I'm having trouble understanding what formula should be applied here. The problem asks us to find the limit, but I'm not sure if we should be using L'Hôpital's rule or another approach. Could you please clarify?",
      timestamp: '2025-04-29T11:05:00Z',
      isRead: true,
      type: 'sent'
    },
    {
      id: 6,
      sender: {
        id: 5,
        name: 'System Notification',
        avatar: null,
        role: 'system'
      },
      recipient: {
        id: 1,
        name: 'You',
        avatar: null,
        role: 'student'
      },
      subject: 'New Assignment Posted',
      content: "A new assignment \"Web Development Final Project\" has been posted to your Web Development Bootcamp course. The assignment is due on May 20, 2025. Please login to view the full details and requirements.",
      timestamp: '2025-04-28T08:00:00Z',
      isRead: true,
      type: 'inbox'
    },
  ];

  // Filter messages based on the active tab
  const filteredMessages = messages.filter(message => {
    if (activeTab === 'inbox') return message.type === 'inbox';
    if (activeTab === 'sent') return message.type === 'sent';
    if (activeTab === 'drafts') return message.type === 'draft';
    return true;
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Communicate with your teachers and classmates
          </p>
        </div>
        <Button 
          onClick={() => navigate('/messages/compose')}
          className="w-full md:w-auto"
        >
          <PenBox className="mr-2 h-4 w-4" />
          Compose Message
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Message categories sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button 
                  variant={activeTab === 'inbox' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('inbox')}
                >
                  <Inbox className="mr-2 h-4 w-4" />
                  Inbox
                  <Badge className="ml-auto">{messages.filter(m => m.type === 'inbox' && !m.isRead).length}</Badge>
                </Button>
                <Button 
                  variant={activeTab === 'sent' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('sent')}
                >
                  <SendIcon className="mr-2 h-4 w-4" />
                  Sent
                </Button>
                <Button 
                  variant={activeTab === 'drafts' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('drafts')}
                >
                  <PenBox className="mr-2 h-4 w-4" />
                  Drafts
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Message list and content */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
                <div className="relative w-full max-w-sm ml-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </CardHeader>
            
            {filteredMessages.length > 0 ? (
              <div className="divide-y">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors
                      ${!message.isRead && activeTab === 'inbox' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                    onClick={() => navigate(`/messages/${message.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={message.type === 'sent' 
                            ? message.recipient.avatar 
                            : message.sender.avatar
                          } 
                          alt="Avatar" 
                        />
                        <AvatarFallback>
                          {message.type === 'sent' 
                            ? getInitials(message.recipient.name)
                            : getInitials(message.sender.name)
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`text-sm font-medium truncate ${!message.isRead && activeTab === 'inbox' ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                            {message.type === 'sent' ? message.recipient.name : message.sender.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                            {formatDate(message.timestamp, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <p className={`text-sm font-medium ${!message.isRead && activeTab === 'inbox' ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium">No messages in {activeTab}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                  {activeTab === 'inbox' 
                    ? 'Your inbox is empty. Messages from teachers and classmates will appear here.' 
                    : activeTab === 'sent'
                      ? 'You haven\'t sent any messages yet.'
                      : 'You don\'t have any draft messages.'}
                </p>
                {activeTab !== 'sent' && (
                  <Button
                    className="mt-4"
                    onClick={() => navigate('/messages/compose')}
                  >
                    <PenBox className="mr-2 h-4 w-4" />
                    Compose Message
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}