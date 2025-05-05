import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "../ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { User } from "@/lib/types";

const Header = () => {
  const [currentLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: sessionData } = useQuery({
    queryKey: ['/api/auth/session'],
  });
  
  const user = sessionData?.user as User | undefined;

  const toggleDarkMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menus when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#user-menu-button') && !target.closest('#user-menu')) {
      setShowUserMenu(false);
    }
    if (!target.closest('#mobile-menu-button') && !target.closest('#mobile-menu')) {
      setShowMobileMenu(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" onClick={handleClickOutside}>
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="https://via.placeholder.com/50?text=TK" alt="TechieKraft Logo" />
                <span className="ml-2 text-xl font-bold text-primary font-montserrat">TechieKraft</span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8" aria-label="Main Navigation">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${
                      currentLocation === item.path
                        ? "border-primary text-primary dark:text-primary-400 border-b-2"
                        : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white mr-3"
                onClick={toggleDarkMode}
              >
                {theme === "light" ? (
                  <i className="fas fa-moon"></i>
                ) : (
                  <i className="fas fa-sun"></i>
                )}
                <span className="sr-only">Toggle dark mode</span>
              </Button>
              <div className="ml-3 relative">
                <div>
                  <Button
                    id="user-menu-button"
                    variant="ghost"
                    className="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 p-0"
                    onClick={toggleUserMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage} alt="Profile" />
                      <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
                {showUserMenu && (
                  <div
                    id="user-menu"
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Your Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        fetch('/api/auth/logout', {
                          method: 'POST',
                          credentials: 'include'
                        });
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <Button
                id="mobile-menu-button"
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-controls="mobile-menu"
                aria-expanded={showMobileMenu}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                <i className="fas fa-bars"></i>
              </Button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${
                    currentLocation === item.path
                      ? "bg-primary-50 dark:bg-gray-700 border-l-4 border-primary text-primary-700 dark:text-primary-400"
                      : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-800 dark:hover:text-white"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profileImage} alt="Profile" />
                    <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user?.role.charAt(0).toUpperCase() + user?.role.slice(1) || 'Guest'}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link href="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  Your Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    fetch('/api/auth/logout', {
                      method: 'POST',
                      credentials: 'include'
                    });
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
