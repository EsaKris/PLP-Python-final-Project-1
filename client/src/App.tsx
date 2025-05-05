import React from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/lib/protected-route';

// Pages
import LandingPage from '@/pages/landing';
import AuthPage from '@/pages/auth-page';
import NotFoundPage from '@/pages/not-found';
import HomePage from '@/pages/home';
import CoursesPage from '@/pages/courses';
import AssignmentsPage from '@/pages/assignments';
import MessagesPage from '@/pages/messages';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';

// Create placeholder pages for routes we'll implement
// These will be replaced with proper page components as we build them
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    <p className="text-muted-foreground">This page is under construction. Check back soon!</p>
  </div>
);

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();
  const userRole = user?.role || 'student';
  
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        {user && !isLoading ? <Redirect to="/home" /> : <LandingPage />}
      </Route>
      <Route path="/auth" component={AuthPage} />
      
      {/* Common protected routes for all users */}
      <ProtectedRoute path="/home" component={() => (
        <MainLayout>
          <HomePage />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/profile" component={() => (
        <MainLayout>
          <PlaceholderPage title="User Profile" />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/settings" component={() => (
        <MainLayout>
          <PlaceholderPage title="Account Settings" />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/messages" component={() => (
        <MainLayout>
          <MessagesPage />
        </MainLayout>
      )} />
      
      {/* Courses related routes */}
      <ProtectedRoute path="/courses" component={() => (
        <MainLayout>
          <CoursesPage />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/courses/:id" component={({ params }) => (
        <MainLayout>
          <PlaceholderPage title={`Course Detail: ${params.id}`} />
        </MainLayout>
      )} />
      
      {/* Teacher/Admin only routes */}
      {(userRole === 'teacher' || userRole === 'admin_teacher' || userRole === 'admin') && (
        <ProtectedRoute path="/courses/create" component={() => (
          <MainLayout>
            <PlaceholderPage title="Create New Course" />
          </MainLayout>
        )} />
      )}
      
      {/* Assignments related routes */}
      <ProtectedRoute path="/assignments" component={() => (
        <MainLayout>
          <AssignmentsPage />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/assignments/:id" component={({ params }) => (
        <MainLayout>
          <PlaceholderPage title={`Assignment Detail: ${params.id}`} />
        </MainLayout>
      )} />
      
      {/* Teacher/Admin only routes */}
      {(userRole === 'teacher' || userRole === 'admin_teacher' || userRole === 'admin') && (
        <ProtectedRoute path="/assignments/create" component={() => (
          <MainLayout>
            <PlaceholderPage title="Create New Assignment" />
          </MainLayout>
        )} />
      )}
      
      {/* Students/Teacher routes */}
      <ProtectedRoute path="/grades" component={() => (
        <MainLayout>
          <PlaceholderPage title={userRole === 'teacher' || userRole === 'admin_teacher' ? "Grade Book" : "My Grades"} />
        </MainLayout>
      )} />
      
      {/* Classes management for teachers */}
      {(userRole === 'teacher' || userRole === 'admin_teacher' || userRole === 'admin') && (
        <ProtectedRoute path="/classes" component={() => (
          <MainLayout>
            <PlaceholderPage title="Class Management" />
          </MainLayout>
        )} />
      )}
      
      {/* Student management for teachers */}
      {(userRole === 'teacher' || userRole === 'admin_teacher' || userRole === 'admin') && (
        <ProtectedRoute path="/students" component={() => (
          <MainLayout>
            <PlaceholderPage title="Student Management" />
          </MainLayout>
        )} />
      )}
      
      {/* Virtual Labs */}
      <ProtectedRoute path="/labs" component={() => (
        <MainLayout>
          <PlaceholderPage title="Virtual Labs" />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/labs/:id" component={({ params }) => (
        <MainLayout>
          <PlaceholderPage title={`Lab: ${params.id}`} />
        </MainLayout>
      )} />
      
      {/* Forums */}
      <ProtectedRoute path="/forums" component={() => (
        <MainLayout>
          <PlaceholderPage title="Discussion Forums" />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/forums/:id" component={({ params }) => (
        <MainLayout>
          <PlaceholderPage title={`Forum Topic: ${params.id}`} />
        </MainLayout>
      )} />
      
      {/* Parent-specific routes */}
      {userRole === 'parent' && (
        <ProtectedRoute path="/children" component={() => (
          <MainLayout>
            <PlaceholderPage title="My Children" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'parent' && (
        <ProtectedRoute path="/progress" component={() => (
          <MainLayout>
            <PlaceholderPage title="Progress Reports" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'parent' && (
        <ProtectedRoute path="/parent-forums" component={() => (
          <MainLayout>
            <PlaceholderPage title="Parent Forums" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'parent' && (
        <ProtectedRoute path="/meetings" component={() => (
          <MainLayout>
            <PlaceholderPage title="Teacher Meetings" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'parent' && (
        <ProtectedRoute path="/announcements" component={() => (
          <MainLayout>
            <PlaceholderPage title="School Announcements" />
          </MainLayout>
        )} />
      )}
      
      {/* Learning Tools */}
      <ProtectedRoute path="/tools" component={() => (
        <MainLayout>
          <PlaceholderPage title="Learning Tools" />
        </MainLayout>
      )} />
      
      {/* Admin routes */}
      {(userRole === 'admin' || userRole === 'admin_teacher') && (
        <ProtectedRoute path="/admin" component={() => (
          <MainLayout>
            <PlaceholderPage title="Admin Dashboard" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'admin' && (
        <ProtectedRoute path="/admin/users" component={() => (
          <MainLayout>
            <PlaceholderPage title="Manage Users" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'admin' && (
        <ProtectedRoute path="/admin/courses" component={() => (
          <MainLayout>
            <PlaceholderPage title="Manage Courses" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'admin' && (
        <ProtectedRoute path="/admin/settings" component={() => (
          <MainLayout>
            <PlaceholderPage title="System Settings" />
          </MainLayout>
        )} />
      )}
      
      {userRole === 'admin' && (
        <ProtectedRoute path="/admin/reports" component={() => (
          <MainLayout>
            <PlaceholderPage title="Reports & Analytics" />
          </MainLayout>
        )} />
      )}
      
      {/* Fallback route */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthenticatedApp />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}