import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import Assignments from "@/pages/assignments";
import Messages from "@/pages/messages";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/ThemeProvider";
import MainLayout from "./components/layouts/MainLayout";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

function Router() {
  const { data: session, isLoading } = useQuery({
    queryKey: ['/api/auth/session'],
  });

  // If not logged in, redirect to login page
  useEffect(() => {
    if (!isLoading && session && !session.authenticated) {
      // In a real app, we would redirect to login
      // For now, we'll use the seeded user automatically
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'maria_student',
          password: 'password123'
        }),
        credentials: 'include'
      });
    }
  }, [isLoading, session]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={Courses} />
      <Route path="/assignments" component={Assignments} />
      <Route path="/messages" component={Messages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="techiekraft-theme">
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
