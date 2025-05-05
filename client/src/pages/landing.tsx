import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            TechieKraft EdTech Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mb-10">
            A comprehensive learning environment for students, teachers, and parents with interactive courses, 
            virtual labs, and collaborative tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Interactive Learning" 
            description="Engage with courses through interactive content, quizzes, and multimedia materials."
            icon="📚"
          />
          <FeatureCard 
            title="Virtual Labs" 
            description="Access virtual laboratories for science, programming, languages, and math."
            icon="🧪"
          />
          <FeatureCard 
            title="Discussion Forums" 
            description="Collaborate with peers and instructors through moderated discussion boards."
            icon="💬"
          />
          <FeatureCard 
            title="Progress Tracking" 
            description="Monitor learning progress with detailed analytics and achievement badges."
            icon="📊"
          />
          <FeatureCard 
            title="Parent-Teacher Communication" 
            description="Enable seamless communication between parents and teachers."
            icon="👨‍👩‍👧‍👦"
          />
          <FeatureCard 
            title="Writing Workshops" 
            description="Improve writing skills with guided workshops and peer review."
            icon="✏️"
          />
        </div>
      </section>

      {/* User Types Section */}
      <section className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Who It's For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UserTypeCard 
              title="Students" 
              description="Access courses, track progress, submit assignments, and collaborate with classmates."
              cta="Sign Up as Student"
              href="/register?role=student"
            />
            <UserTypeCard 
              title="Teachers" 
              description="Create courses, manage assignments, track student progress, and communicate with parents."
              cta="Sign Up as Teacher"
              href="/register?role=teacher"
            />
            <UserTypeCard 
              title="Parents" 
              description="Monitor your child's progress, communicate with teachers, and stay involved in their education."
              cta="Sign Up as Parent"
              href="/register?role=parent"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Learning?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Join thousands of students, teachers, and parents already using TechieKraft to enhance education.
        </p>
        <Button asChild size="lg" className="px-8 py-6 text-lg">
          <Link href="/register">Get Started For Free</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TechieKraft</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Empowering education through technology.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/courses">Courses</Link></li>
                <li><Link href="/virtual-labs">Virtual Labs</Link></li>
                <li><Link href="/forum">Discussion Forum</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} TechieKraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <Card className="flex flex-col items-center text-center p-6">
      <div className="text-5xl mb-4">{icon}</div>
      <CardContent className="pt-2">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function UserTypeCard({ title, description, cta, href }: { title: string; description: string; cta: string; href: string }) {
  return (
    <Card className="flex flex-col p-6">
      <CardContent className="flex-1">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        <Button asChild className="w-full">
          <Link href={href}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}