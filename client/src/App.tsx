import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { defaultFetcher } from '@/lib/query';

// Pages
import LandingPage from '@/pages/landing';
import RegisterPage from '@/pages/register';
import LoginPage from '@/pages/login';
import NotFoundPage from '@/pages/not-found';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';

export default function App() {
  const [location] = useLocation();
  
  // Check if user is authenticated
  const { data: sessionData } = useQuery({
    queryKey: [API_ENDPOINTS.AUTH.SESSION],
    queryFn: defaultFetcher,
    refetchOnWindowFocus: true,
    retry: false
  });
  
  // Authentication state
  const isAuthenticated = sessionData?.authenticated === true;
  
  // Effect to redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && (location === '/' || location === '/login' || location === '/register')) {
      window.location.href = '/home';
    }
  }, [isAuthenticated, location]);

  // Landing page for non-authenticated users
  if (location === '/' && !isAuthenticated) {
    return <LandingPage />;
  }
  
  // Auth pages (login and register) for non-authenticated users
  if ((location === '/login' || location === '/register') && !isAuthenticated) {
    // Render auth pages outside of the main layout
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
      </Switch>
    );
  }

  // Main application with layout for authenticated users
  return (
    <MainLayout>
      <Switch>
        <Route path="/home">
          <div>Home Dashboard</div>
        </Route>
        <Route path="/courses">
          <div>Courses Page</div>
        </Route>
        <Route path="/assignments">
          <div>Assignments Page</div>
        </Route>
        <Route path="/messages">
          <div>Messages Page</div>
        </Route>
        <Route path="/labs">
          <div>Virtual Labs Page</div>
        </Route>
        <Route path="/forums">
          <div>Forums Page</div>
        </Route>
        <Route path="/tools">
          <div>Learning Tools Page</div>
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </MainLayout>
  );
}