import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, ASSIGNMENT_STATUSES } from '@/lib/constants';
import { defaultFetcher } from '@/lib/query';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck,
  Calendar, 
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function AssignmentsPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('all');

  // Fetch assignments (would be implemented with backend)
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.ASSIGNMENTS.MY_ASSIGNMENTS],
    queryFn: defaultFetcher,
    retry: false,
  });

  // Mock assignments data for demo
  const assignments = [
    {
      id: 1,
      title: 'Programming Assignment: Loops and Arrays',
      course: 'Introduction to Programming',
      dueDate: '2025-05-12',
      assignedDate: '2025-05-01',
      status: 'in_progress',
      points: 100,
      earnedPoints: null,
      description: 'Implement various loop structures and array manipulations in Python.'
    },
    {
      id: 2,
      title: 'Math Problem Set: Calculus',
      course: 'Advanced Mathematics',
      dueDate: '2025-05-10',
      assignedDate: '2025-05-01',
      status: 'not_started',
      points: 50,
      earnedPoints: null,
      description: 'Solve the attached calculus problems involving derivatives and integrals.'
    },
    {
      id: 3,
      title: 'Essay: Shakespeare Analysis',
      course: 'English Literature Classics',
      dueDate: '2025-05-08',
      assignedDate: '2025-04-25',
      status: 'submitted',
      points: 80,
      earnedPoints: null,
      description: 'Write a 1500-word analysis of symbolism in Shakespeare\'s Macbeth.'
    },
    {
      id: 4,
      title: 'Physics Lab Report',
      course: 'Physics Fundamentals',
      dueDate: '2025-04-30',
      assignedDate: '2025-04-15',
      status: 'graded',
      points: 120,
      earnedPoints: 108,
      description: 'Document your findings from the momentum conservation experiment.'
    },
    {
      id: 5,
      title: 'History Research Paper',
      course: 'World History Overview',
      dueDate: '2025-05-15',
      assignedDate: '2025-04-20',
      status: 'in_progress',
      points: 150,
      earnedPoints: null,
      description: 'Research and write a paper on a significant event from World War II.'
    },
    {
      id: 6,
      title: 'Web Development Project',
      course: 'Web Development Bootcamp',
      dueDate: '2025-05-20',
      assignedDate: '2025-04-28',
      status: 'not_started',
      points: 200,
      earnedPoints: null,
      description: 'Build a responsive portfolio website using HTML, CSS, and JavaScript.'
    },
  ];

  // Filter assignments based on the active tab
  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return ['not_started', 'in_progress'].includes(assignment.status);
    if (activeTab === 'submitted') return assignment.status === 'submitted';
    if (activeTab === 'graded') return assignment.status === 'graded';
    return true;
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case 'not_started':
        return <Badge className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Not Started</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">In Progress</Badge>;
      case 'submitted':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Submitted</Badge>;
      case 'graded':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Graded</Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Late</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'not_started':
        return <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
      case 'in_progress':
        return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'submitted':
        return <FileCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case 'graded':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  }

  // Calculate due date urgency
  function getDueDateClass(dueDate: string) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 dark:text-red-400'; // Past due
    if (diffDays <= 3) return 'text-amber-600 dark:text-amber-400'; // Due soon
    return 'text-gray-600 dark:text-gray-400'; // Regular
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track your course assignments
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {}}
            className="flex items-center"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button
            variant="outline"
            onClick={() => {}}
            className="flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="all" className="m-0">
            <AssignmentList 
              assignments={filteredAssignments} 
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              getDueDateClass={getDueDateClass}
              navigate={navigate}
            />
          </TabsContent>
          <TabsContent value="pending" className="m-0">
            <AssignmentList 
              assignments={filteredAssignments} 
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              getDueDateClass={getDueDateClass}
              navigate={navigate}
            />
          </TabsContent>
          <TabsContent value="submitted" className="m-0">
            <AssignmentList 
              assignments={filteredAssignments} 
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              getDueDateClass={getDueDateClass}
              navigate={navigate}
            />
          </TabsContent>
          <TabsContent value="graded" className="m-0">
            <AssignmentList 
              assignments={filteredAssignments} 
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              getDueDateClass={getDueDateClass}
              navigate={navigate}
            />
          </TabsContent>
        </div>
      </Tabs>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium">No assignments found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {activeTab === 'all' 
              ? 'You don\'t have any assignments yet' 
              : `You don't have any ${activeTab} assignments`}
          </p>
        </div>
      )}
    </div>
  );
}

// Assignment List Component
interface AssignmentListProps {
  assignments: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getDueDateClass: (dueDate: string) => string;
  navigate: (to: string) => void;
}

function AssignmentList({ 
  assignments, 
  getStatusBadge, 
  getStatusIcon, 
  getDueDateClass,
  navigate 
}: AssignmentListProps) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card 
          key={assignment.id} 
          className="overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
          onClick={() => navigate(`/assignments/${assignment.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="mt-0.5">
                  {getStatusIcon(assignment.status)}
                </div>
                <div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.course}</CardDescription>
                </div>
              </div>
              <div>
                {getStatusBadge(assignment.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {assignment.description.length > 120 
                ? `${assignment.description.substring(0, 120)}...` 
                : assignment.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <div className="flex space-x-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Points: </span>
                  <span className="font-medium">
                    {assignment.status === 'graded' 
                      ? `${assignment.earnedPoints}/${assignment.points}` 
                      : assignment.points}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Assigned: </span>
                  <span className="font-medium">{formatDate(assignment.assignedDate, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Due: </span>
                <span className={`text-sm font-semibold ${getDueDateClass(assignment.dueDate)}`}>
                  {formatDate(assignment.dueDate, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}