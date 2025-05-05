import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, BookOpen, GraduationCap, Languages, PenTool, FileText, Search, Bookmark, Clock, ThumbsUp, ChevronRight, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Tool categories & icons
const toolCategories = [
  { id: 'math', name: 'Mathematics', icon: <Calculator className="h-5 w-5" /> },
  { id: 'writing', name: 'Writing', icon: <PenTool className="h-5 w-5" /> },
  { id: 'language', name: 'Languages', icon: <Languages className="h-5 w-5" /> },
  { id: 'research', name: 'Research', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'study', name: 'Study Aids', icon: <GraduationCap className="h-5 w-5" /> }
];

// Sample learning tools data
const learningTools = [
  {
    id: 1,
    title: 'Math Problem Solver',
    description: 'Solve complex algebraic, calculus, and statistical problems with detailed explanations.',
    category: 'math',
    complexity: 'Intermediate',
    imageUrl: 'https://placehold.co/600x400/e0f7fa/006064?text=Math+Solver',
    usageCount: 1240,
    isNew: false,
    isFeatured: true,
    features: ['Step-by-step solutions', 'Graph generation', 'Formula sheet', 'Practice problems']
  },
  {
    id: 2,
    title: 'Essay Writing Assistant',
    description: 'Get help with grammar, structure, citations, and style for better academic papers.',
    category: 'writing',
    complexity: 'All Levels',
    imageUrl: 'https://placehold.co/600x400/fff3e0/e65100?text=Writing+Assistant',
    usageCount: 980,
    isNew: true,
    isFeatured: true,
    features: ['Grammar checker', 'Plagiarism detection', 'Citation formatter', 'Structure suggestions']
  },
  {
    id: 3,
    title: 'Language Translator',
    description: 'Translate text between multiple languages with pronunciation guidance.',
    category: 'language',
    complexity: 'Beginner',
    imageUrl: 'https://placehold.co/600x400/e8f5e9/2e7d32?text=Translator',
    usageCount: 2100,
    isNew: false,
    isFeatured: true,
    features: ['50+ languages', 'Pronunciation audio', 'Phrase dictionary', 'Contextual translations']
  },
  {
    id: 4,
    title: 'Research Paper Generator',
    description: 'Find and organize research sources and generate properly formatted bibliography.',
    category: 'research',
    complexity: 'Advanced',
    imageUrl: 'https://placehold.co/600x400/e8eaf6/3949ab?text=Research+Tool',
    usageCount: 600,
    isNew: false,
    isFeatured: false,
    features: ['Journal access', 'Citation generation', 'Bibliography formatting', 'Research organizer']
  },
  {
    id: 5,
    title: 'Flashcard Creator',
    description: 'Create digital flashcards for efficient studying with spaced repetition system.',
    category: 'study',
    complexity: 'Beginner',
    imageUrl: 'https://placehold.co/600x400/f3e5f5/6a1b9a?text=Flashcards',
    usageCount: 1560,
    isNew: true,
    isFeatured: false,
    features: ['Custom flashcards', 'Spaced repetition', 'Progress tracking', 'Shared decks']
  },
  {
    id: 6,
    title: 'Geometry Visualizer',
    description: 'Interactive 3D geometry visualization and calculation tool for complex shapes.',
    category: 'math',
    complexity: 'Intermediate',
    imageUrl: 'https://placehold.co/600x400/e0f7fa/006064?text=Geometry',
    usageCount: 780,
    isNew: false,
    isFeatured: false,
    features: ['3D visualizations', 'Measurement tools', 'Shape calculator', 'Problem generator']
  },
  {
    id: 7,
    title: 'Grammar Coach',
    description: 'Advanced grammar checker with contextual suggestions and learning resources.',
    category: 'writing',
    complexity: 'All Levels',
    imageUrl: 'https://placehold.co/600x400/fff3e0/e65100?text=Grammar',
    usageCount: 890,
    isNew: false,
    isFeatured: false,
    features: ['Grammar correction', 'Style suggestions', 'Learning resources', 'Progress tracking']
  },
  {
    id: 8,
    title: 'Vocabulary Builder',
    description: 'Expand your vocabulary with contextual learning and practice exercises.',
    category: 'language',
    complexity: 'All Levels',
    imageUrl: 'https://placehold.co/600x400/e8f5e9/2e7d32?text=Vocabulary',
    usageCount: 1100,
    isNew: true,
    isFeatured: false,
    features: ['Custom word lists', 'Contextual examples', 'Practice exercises', 'Progress tracking']
  },
  {
    id: 9,
    title: 'Study Schedule Planner',
    description: 'Create optimized study schedules based on your learning goals and available time.',
    category: 'study',
    complexity: 'Beginner',
    imageUrl: 'https://placehold.co/600x400/f3e5f5/6a1b9a?text=Study+Planner',
    usageCount: 650,
    isNew: false,
    isFeatured: false,
    features: ['Customizable schedules', 'Reminder system', 'Progress tracking', 'Time management tips']
  },
  {
    id: 10,
    title: 'Citation Generator',
    description: 'Automatically format citations in APA, MLA, Chicago, and other academic styles.',
    category: 'research',
    complexity: 'Beginner',
    imageUrl: 'https://placehold.co/600x400/e8eaf6/3949ab?text=Citations',
    usageCount: 1700,
    isNew: false,
    isFeatured: false,
    features: ['Multiple citation styles', 'Bibliography export', 'Source organizer', 'In-text citation help']
  }
];

// Get color based on category
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'math':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
    case 'writing':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'language':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'research':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'study':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

// Get icon based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'math':
      return <Calculator className="h-4 w-4" />;
    case 'writing':
      return <PenTool className="h-4 w-4" />;
    case 'language':
      return <Languages className="h-4 w-4" />;
    case 'research':
      return <BookOpen className="h-4 w-4" />;
    case 'study':
      return <GraduationCap className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default function LearningToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  // Filter tools based on search query, category and active tab
  const filteredTools = learningTools.filter(tool => {
    // Search filter
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    
    // Tab filter
    const matchesTab = 
      (activeTab === 'all') ||
      (activeTab === 'featured' && tool.isFeatured) ||
      (activeTab === 'new' && tool.isNew) ||
      (activeTab === 'popular' && tool.usageCount > 1000);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  // Handle tool launch
  const handleToolLaunch = (toolId: number) => {
    console.log(`Launching tool ${toolId}`);
    // In a real app, this would navigate to the tool's page or launch a modal
    // For demonstration, we'll just log it
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Tools</h1>
          <p className="text-muted-foreground">
            Interactive tools to enhance your learning experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="space-y-1">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory('all')}
              >
                <FileText className="mr-2 h-4 w-4" />
                All Tools
              </Button>
              
              {toolCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Most Used</h3>
            <div className="space-y-1">
              {learningTools
                .sort((a, b) => b.usageCount - a.usageCount)
                .slice(0, 5)
                .map(tool => (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => handleToolLaunch(tool.id)}
                  >
                    {getCategoryIcon(tool.category)}
                    <span className="ml-2 truncate">{tool.title}</span>
                  </Button>
                ))
              }
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Access</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('featured')}>
                <ThumbsUp className="mr-2 h-4 w-4" /> Featured Tools
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('new')}>
                <Clock className="mr-2 h-4 w-4" /> New Tools
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('popular')}>
                <Bookmark className="mr-2 h-4 w-4" /> Popular Tools
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Tools</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTools.map(tool => (
                  <Card key={tool.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={tool.imageUrl} 
                        alt={tool.title} 
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                      {tool.isNew && (
                        <Badge className="absolute top-2 right-2 bg-blue-600">New</Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2 flex-none">
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getCategoryColor(tool.category)}>
                          {getCategoryIcon(tool.category)}
                          <span className="ml-1">{
                            toolCategories.find(cat => cat.id === tool.category)?.name || tool.category
                          }</span>
                        </Badge>
                        
                        <Badge variant="outline">
                          {tool.complexity}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-0 flex-grow">
                      <p className="text-sm text-muted-foreground mb-2">Features:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter className="pt-4 flex-none">
                      <Button 
                        className="w-full" 
                        onClick={() => handleToolLaunch(tool.id)}
                      >
                        Launch Tool <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Tools Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setActiveTab('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="featured">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTools.map(tool => (
                  <Card key={tool.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={tool.imageUrl} 
                        alt={tool.title} 
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                      {tool.isNew && (
                        <Badge className="absolute top-2 right-2 bg-blue-600">New</Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2 flex-none">
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getCategoryColor(tool.category)}>
                          {getCategoryIcon(tool.category)}
                          <span className="ml-1">{
                            toolCategories.find(cat => cat.id === tool.category)?.name || tool.category
                          }</span>
                        </Badge>
                        
                        <Badge variant="outline">
                          {tool.complexity}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-0 flex-grow">
                      <p className="text-sm text-muted-foreground mb-2">Features:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter className="pt-4 flex-none">
                      <Button 
                        className="w-full" 
                        onClick={() => handleToolLaunch(tool.id)}
                      >
                        Launch Tool <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTools.map(tool => (
                  <Card key={tool.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={tool.imageUrl} 
                        alt={tool.title} 
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-600">New</Badge>
                    </div>
                    
                    <CardHeader className="pb-2 flex-none">
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getCategoryColor(tool.category)}>
                          {getCategoryIcon(tool.category)}
                          <span className="ml-1">{
                            toolCategories.find(cat => cat.id === tool.category)?.name || tool.category
                          }</span>
                        </Badge>
                        
                        <Badge variant="outline">
                          {tool.complexity}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-0 flex-grow">
                      <p className="text-sm text-muted-foreground mb-2">Features:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter className="pt-4 flex-none">
                      <Button 
                        className="w-full" 
                        onClick={() => handleToolLaunch(tool.id)}
                      >
                        Try Now <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="popular">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTools.map(tool => (
                  <Card key={tool.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={tool.imageUrl} 
                        alt={tool.title} 
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm py-1 px-2">
                        {tool.usageCount.toLocaleString()} users
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2 flex-none">
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getCategoryColor(tool.category)}>
                          {getCategoryIcon(tool.category)}
                          <span className="ml-1">{
                            toolCategories.find(cat => cat.id === tool.category)?.name || tool.category
                          }</span>
                        </Badge>
                        
                        <Badge variant="outline">
                          {tool.complexity}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-0 flex-grow">
                      <p className="text-sm text-muted-foreground mb-2">Features:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter className="pt-4 flex-none">
                      <Button 
                        className="w-full" 
                        onClick={() => handleToolLaunch(tool.id)}
                      >
                        Launch Tool <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}