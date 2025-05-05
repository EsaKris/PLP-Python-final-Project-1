import React from 'react';
import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
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

function AppRoutes() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/home" component={() => (
        <MainLayout>
          <HomePage />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/courses" component={() => (
        <MainLayout>
          <CoursesPage />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/assignments" component={() => (
        <MainLayout>
          <AssignmentsPage />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/messages" component={() => (
        <MainLayout>
          <MessagesPage />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/labs" component={() => (
        <MainLayout>
          <div>Virtual Labs Page</div>
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/forums" component={() => (
        <MainLayout>
          <div>Forums Page</div>
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/tools" component={() => (
        <MainLayout>
          <div>Learning Tools Page</div>
        </MainLayout>
      )} />
      
      {/* Fallback route */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}