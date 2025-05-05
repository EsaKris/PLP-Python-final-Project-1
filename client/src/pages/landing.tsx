import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, BookOpen, Users, MessageSquare, Award, Code, Beaker } from 'lucide-react';

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">TechieKraft</div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</a>
            <a href="#subjects" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Subjects</a>
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/auth?tab=register')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Enhance Your Learning Journey With TechieKraft
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                A comprehensive educational platform that connects students, teachers, and parents for an optimized learning experience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/auth?tab=register')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                >
                  Explore Courses
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-8 bg-blue-600 dark:bg-blue-700">
                  <div className="text-white text-2xl font-bold mb-3">TechieKraft Platform</div>
                  <div className="text-blue-100">Advanced learning tools and interactive courses</div>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <BookOpen className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                      Interactive course materials across subjects
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <Users className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                      Collaborate with classmates and teachers
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <MessageSquare className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                      Discussion forums for deeper learning
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <Beaker className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                      Virtual labs for practical experience
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Comprehensive Features</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Discover the tools that make TechieKraft an exceptional learning platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interactive Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engage with interactive content, quizzes, and multimedia materials to enhance your understanding.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Parent-Teacher Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built-in communication tools that keep parents informed about their child's progress and activities.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your academic progress with detailed analytics and personalized insights.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Discussion Forums</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engage in topic-based discussions, ask questions, and collaborate with peers and teachers.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <Beaker className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Virtual Labs</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Conduct experiments and practice skills in a safe, virtual environment with real-time feedback.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <Code className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Learning Tools</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access specialized tools for different subjects, including math problem solvers and language assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Subjects</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Explore our comprehensive curriculum across multiple disciplines</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Subject items */}
            {[
              { name: 'Mathematics', bg: 'bg-blue-100 dark:bg-blue-900' },
              { name: 'Science', bg: 'bg-green-100 dark:bg-green-900' },
              { name: 'Programming', bg: 'bg-purple-100 dark:bg-purple-900' },
              { name: 'English', bg: 'bg-yellow-100 dark:bg-yellow-900' },
              { name: 'History', bg: 'bg-red-100 dark:bg-red-900' },
              { name: 'Geography', bg: 'bg-indigo-100 dark:bg-indigo-900' },
              { name: 'Art', bg: 'bg-pink-100 dark:bg-pink-900' },
              { name: 'Music', bg: 'bg-orange-100 dark:bg-orange-900' },
              { name: 'Physical Education', bg: 'bg-teal-100 dark:bg-teal-900' },
              { name: 'Languages', bg: 'bg-cyan-100 dark:bg-cyan-900' },
            ].map((subject, index) => (
              <div key={index} className={`${subject.bg} rounded-lg p-4 text-center shadow-md transition-transform hover:scale-105`}>
                <div className="text-lg font-medium text-gray-900 dark:text-white">{subject.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of students, teachers, and parents already using TechieKraft.</p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => navigate('/auth?tab=register')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">TechieKraft</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Empowering education through innovative technology and collaborative learning environments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Courses</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Virtual Labs</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Learning Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">
            <p>© {new Date().getFullYear()} TechieKraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}