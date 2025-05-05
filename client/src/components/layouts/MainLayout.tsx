import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';

// Import all Lucide icons dynamically
import * as LucideIcons from 'lucide-react';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Example value
  const [unreadMessages, setUnreadMessages] = useState(2); // Example value

  // Check for dark mode preference on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U';
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];
    
    const role = user.role || 'student';
    const commonItems = NAVIGATION_ITEMS.common || [];
    const roleItems = NAVIGATION_ITEMS[role as keyof typeof NAVIGATION_ITEMS] || [];

    // For admin_teacher, add both teacher and admin_teacher items
    if (role === 'admin_teacher') {
      return [...commonItems, ...NAVIGATION_ITEMS.teacher, ...roleItems];
    }
    
    return [...commonItems, ...roleItems];
  };
  
  // Dynamic icon renderer
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const navItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar/Navigation */}
      <aside className={cn(
        "bg-card text-card-foreground border-r z-30 fixed inset-y-0 left-0 w-64 transition-transform duration-300 transform md:translate-x-0 md:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <div className="md:hidden absolute right-2 top-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Logo and branding */}
        <div className="p-4 border-b flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            TK
          </div>
          <span className="text-lg font-semibold">TechieKraft</span>
        </div>
        
        {/* User profile summary */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profileImage || ''} alt={user?.username || 'User'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role && user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
            />
          </div>
        </div>
        
        {/* Navigation items */}
        <nav className="p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={cn(
                    "nav-link",
                    location === item.href && "nav-link-active"
                  )}>
                    {renderIcon(item.icon)}
                    <span>{item.label}</span>
                    
                    {/* Show badges for messages if on messages link */}
                    {item.href === '/messages' && unreadMessages > 0 && (
                      <Badge variant="destructive" className="ml-auto px-1 min-w-5 flex items-center justify-center">
                        {unreadMessages}
                      </Badge>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 sticky top-0 z-20">
          {/* Left section with mobile menu toggle */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold hidden md:block">
              {navItems.find(item => item.href === location)?.label || 'Dashboard'}
            </h1>
          </div>
          
          {/* Right section with notifications and user menu */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Notifications dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Badge variant="outline" className="ml-2">{unreadNotifications} new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div>
                      <p className="font-medium">New Assignment</p>
                      <p className="text-sm text-muted-foreground">Math Homework due tomorrow</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div>
                      <p className="font-medium">Course Update</p>
                      <p className="text-sm text-muted-foreground">New lecture materials available</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage || ''} alt={user?.username || 'User'} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{user?.firstName || user?.username}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/profile">
                    <a className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/settings">
                    <a className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t py-4 px-6 text-sm text-center text-muted-foreground">
          <div className="max-w-7xl mx-auto">
            © {new Date().getFullYear()} TechieKraft. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}