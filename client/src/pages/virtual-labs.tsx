import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { queryClient, defaultFetcher } from '@/lib/queryClient';
import { API_ENDPOINTS } from '@/lib/constants';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, ChevronRight, Microscope, Dna, ZoomIn, RotateCcw, Atom, Award, Download, Share, BookOpen, Beaker, PlusCircle, Clock, Tag, Filter, ArrowDownAZ, CheckCircle2, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Icons not included in lucide-react but needed
const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Chemistry flask icon
const Flask = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3h6v2H9zM7 15c0 3.866 3.134 7 7 7s7-3.134 7-7H7z" />
    <path d="M8 3v10a4 4 0 0 0 2 3.464M16 3v10a4 4 0 0 1-2 3.464" />
  </svg>
);

const labCategories = [
  { id: 'biology', name: 'Biology', icon: <Dna className="h-5 w-5" /> },
  { id: 'chemistry', name: 'Chemistry', icon: <Flask className="h-5 w-5" /> },
  { id: 'physics', name: 'Physics', icon: <Atom className="h-5 w-5" /> },
  { id: 'earth-science', name: 'Earth Science', icon: <Globe className="h-5 w-5" /> },
  { id: 'astronomy', name: 'Astronomy', icon: <Star className="h-5 w-5" /> }
];

// Mock data for labs
const virtualLabs = [
  {
    id: 1,
    title: 'Cell Structure and Function',
    description: 'Explore the structure and function of animal and plant cells through interactive 3D models.',
    category: 'biology',
    difficulty: 'Beginner',
    duration: '30 minutes',
    image: 'https://placehold.co/600x400/e9f9f0/1a6d50?text=Cell+Lab',
    status: 'available'
  },
  {
    id: 2,
    title: 'Chemical Reactions',
    description: 'Conduct virtual chemical experiments and observe different types of chemical reactions.',
    category: 'chemistry',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    image: 'https://placehold.co/600x400/f3e5f5/6a1b9a?text=Chemistry+Lab',
    status: 'available'
  },
  {
    id: 3,
    title: 'Newton\'s Laws of Motion',
    description: 'Visualize and experiment with Newton\'s three laws of motion through interactive simulations.',
    category: 'physics',
    difficulty: 'Intermediate',
    duration: '40 minutes',
    image: 'https://placehold.co/600x400/e8eaf6/3949ab?text=Physics+Lab',
    status: 'available'
  },
  {
    id: 4,
    title: 'DNA Extraction and Analysis',
    description: 'Learn about DNA extraction techniques and analyze DNA samples using virtual tools.',
    category: 'biology',
    difficulty: 'Advanced',
    duration: '60 minutes',
    image: 'https://placehold.co/600x400/e9f9f0/1a6d50?text=DNA+Lab',
    status: 'available'
  },
  {
    id: 5,
    title: 'Atomic Structure',
    description: 'Explore the structure of atoms, isotopes, and electron configurations.',
    category: 'chemistry',
    difficulty: 'Beginner',
    duration: '35 minutes',
    image: 'https://placehold.co/600x400/f3e5f5/6a1b9a?text=Atom+Lab',
    status: 'available'
  },
  {
    id: 6,
    title: 'Circuit Building',
    description: 'Design and build virtual electrical circuits and analyze voltage, current, and resistance.',
    category: 'physics',
    difficulty: 'Intermediate',
    duration: '50 minutes',
    image: 'https://placehold.co/600x400/e8eaf6/3949ab?text=Circuit+Lab',
    status: 'maintenance',
    maintenanceMessage: 'This lab is currently under maintenance. Please check back soon.'
  },
  {
    id: 7,
    title: 'Plate Tectonics',
    description: 'Investigate Earth\'s crustal plates and their movements through interactive simulations.',
    category: 'earth-science',
    difficulty: 'Beginner',
    duration: '40 minutes',
    image: 'https://placehold.co/600x400/e0f7fa/006064?text=Earth+Lab',
    status: 'available'
  },
  {
    id: 8,
    title: 'Solar System Exploration',
    description: 'Tour the solar system and learn about planets, moons, and other celestial bodies.',
    category: 'astronomy',
    difficulty: 'Beginner',
    duration: '45 minutes',
    image: 'https://placehold.co/600x400/e8eaf6/283593?text=Space+Lab',
    status: 'available'
  },
  {
    id: 9,
    title: 'Genetics and Heredity',
    description: 'Study patterns of inheritance and genetic traits through simulated breeding experiments.',
    category: 'biology',
    difficulty: 'Advanced',
    duration: '55 minutes',
    image: 'https://placehold.co/600x400/e9f9f0/1a6d50?text=Genetics+Lab',
    status: 'available'
  },
  {
    id: 10,
    title: 'Acid-Base Titration',
    description: 'Perform virtual titrations to determine the concentration of acids and bases.',
    category: 'chemistry',
    difficulty: 'Advanced',
    duration: '50 minutes',
    image: 'https://placehold.co/600x400/f3e5f5/6a1b9a?text=Titration+Lab',
    status: 'coming-soon',
    releaseDate: '2023-06-15'
  }
];

// Get icon based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'biology':
      return <Dna className="h-4 w-4" />;
    case 'chemistry':
      return <Flask className="h-4 w-4" />;
    case 'physics':
      return <Atom className="h-4 w-4" />;
    case 'earth-science':
      return <Globe className="h-4 w-4" />;
    case 'astronomy':
      return <Star className="h-4 w-4" />;
    default:
      return <Microscope className="h-4 w-4" />;
  }
};

// Get color based on difficulty
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Advanced':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

// Get status text and color
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'available':
      return {
        text: 'Available',
        icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
        color: 'text-green-600'
      };
    case 'maintenance':
      return {
        text: 'Under Maintenance',
        icon: <RotateCcw className="h-4 w-4 text-amber-600" />,
        color: 'text-amber-600'
      };
    case 'coming-soon':
      return {
        text: 'Coming Soon',
        icon: <Clock className="h-4 w-4 text-blue-600" />,
        color: 'text-blue-600'
      };
    default:
      return {
        text: 'Unavailable',
        icon: <XCircle className="h-4 w-4 text-red-600" />,
        color: 'text-red-600'
      };
  }
};

// Format category name
const formatCategoryName = (category: string) => {
  return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

interface DifficultyOrder {
  [key: string]: number;
}

export default function VirtualLabsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredLabs, setFilteredLabs] = useState(virtualLabs);
  const [sortOption, setSortOption] = useState('name-asc');
  const [, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Filter labs based on search query and category
    let filtered = [...virtualLabs];
    
    if (searchQuery) {
      filtered = filtered.filter(lab => 
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lab => lab.category === selectedCategory);
    }
    
    // Sort the labs
    switch (sortOption) {
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'difficulty-asc':
        filtered.sort((a, b) => {
          const difficultyOrder: DifficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        break;
      case 'difficulty-desc':
        filtered.sort((a, b) => {
          const difficultyOrder: DifficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        });
        break;
      case 'duration-asc':
        filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      case 'duration-desc':
        filtered.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
        break;
      default:
        break;
    }
    
    setFilteredLabs(filtered);
  }, [searchQuery, selectedCategory, sortOption]);

  // Function to handle lab selection
  const handleLabSelect = (labId: number) => {
    navigate(`/labs/${labId}`);
  };

  // Get the sort option display text
  const getSortOptionText = () => {
    switch (sortOption) {
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
      case 'difficulty-asc':
        return 'Difficulty (Easiest First)';
      case 'difficulty-desc':
        return 'Difficulty (Hardest First)';
      case 'duration-asc':
        return 'Duration (Shortest First)';
      case 'duration-desc':
        return 'Duration (Longest First)';
      default:
        return 'Sort';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Virtual Labs</h1>
          <p className="text-muted-foreground">
            Interactive simulations to explore scientific concepts and experiments
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
                <Microscope className="mr-2 h-4 w-4" />
                All Labs
              </Button>
              
              {labCategories.map(category => (
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
            <h3 className="text-lg font-semibold mb-2">Recently Visited</h3>
            <ScrollArea className="h-[180px]">
              <div className="space-y-1 pr-4">
                {virtualLabs.slice(0, 4).map(lab => (
                  <button
                    key={`recent-${lab.id}`}
                    className="flex items-start gap-2 w-full p-2 hover:bg-muted rounded-md text-left text-sm transition-colors"
                    onClick={() => handleLabSelect(lab.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={lab.image} alt={lab.title} />
                      <AvatarFallback>{getCategoryIcon(lab.category)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{lab.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{lab.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Learning Resources</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" /> Lab Tutorials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" /> Downloadable Materials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="mr-2 h-4 w-4" /> Certificates
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-4">
          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search virtual labs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1.5">
                    <ArrowDownAZ className="h-4 w-4" />
                    <span className="hidden sm:inline">Sort: </span>
                    <span className="truncate max-w-[100px]">{getSortOptionText()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOption('name-asc')}>
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('name-desc')}>
                    Name (Z-A)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('difficulty-asc')}>
                    Difficulty (Easiest First)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('difficulty-desc')}>
                    Difficulty (Hardest First)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('duration-asc')}>
                    Duration (Shortest First)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('duration-desc')}>
                    Duration (Longest First)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredLabs.length} of {virtualLabs.length} labs
          </div>
          
          {/* Labs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredLabs.map(lab => (
              <Card 
                key={lab.id} 
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={lab.image} 
                    alt={lab.title} 
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="flex items-center gap-1.5 font-medium">
                      {getStatusInfo(lab.status).icon}
                      {getStatusInfo(lab.status).text}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{lab.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleLabSelect(lab.id)}>
                          <ZoomIn className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="mr-2 h-4 w-4" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookOpen className="mr-2 h-4 w-4" /> View Tutorial
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2">{lab.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-3 pt-0">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      {getCategoryIcon(lab.category)}
                      {formatCategoryName(lab.category)}
                    </Badge>
                    <Badge className={`${getDifficultyColor(lab.difficulty)}`}>
                      {lab.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {lab.duration}
                    </Badge>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full" 
                    onClick={() => handleLabSelect(lab.id)}
                    disabled={lab.status !== 'available'}
                  >
                    {lab.status === 'available' ? 'Launch Lab' : 
                     lab.status === 'maintenance' ? 'Temporarily Unavailable' : 
                     'Coming Soon'}
                    {lab.status === 'available' && <ChevronRight className="ml-1 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredLabs.length === 0 && (
            <div className="text-center py-12">
              <Microscope className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Labs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Create lab button (for teachers/admins) */}
          {(user?.role === 'teacher' || user?.role === 'admin_teacher' || user?.role === 'admin') && (
            <div className="fixed bottom-6 right-6">
              <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
                <PlusCircle className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}