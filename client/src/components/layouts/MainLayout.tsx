import React from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/lib/constants';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Simple header without complex navigation for now
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            TechieKraft
          </div>
          <nav className="hidden md:flex gap-6">
            {NAVIGATION_ITEMS.map((item) => (
              <a 
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                  location === item.href 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                {item.title}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {/* Placeholder for user menu - will implement later */}
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} TechieKraft. All rights reserved.
        </div>
      </footer>
    </div>
  );
}