import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { API_ENDPOINTS } from "@/lib/constants";

export default function Courses() {
  const { data: enrollments, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.ENROLLMENTS.LIST],
  });

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white font-montserrat">
          My Courses
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Access and manage all your enrolled courses
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/2 mb-4" />
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/6" />
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
                </div>
              </CardContent>
              <CardFooter className="justify-end p-4 pt-0">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : enrollments?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment: any) => (
            <Card key={enrollment.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-48 w-full">
                <img
                  src={enrollment.course?.imageUrl || "https://via.placeholder.com/800x300?text=Course+Image"}
                  alt={enrollment.course?.name || "Course"}
                  className="h-48 w-full object-cover"
                />
              </div>
              <CardContent className="px-4 py-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {enrollment.course?.name || "Untitled Course"}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {enrollment.course?.teacher ? `${enrollment.course.teacher.firstName} ${enrollment.course.teacher.lastName}` : "Unknown Instructor"}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-gray-700 dark:text-gray-300">{enrollment.progress}%</span>
                  </div>
                  <Progress 
                    value={enrollment.progress} 
                    className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 w-full" 
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end p-4 pt-0">
                <Button variant="outline" size="sm" className="text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-100 dark:hover:bg-primary-700 border-none">
                  <Link href={`/courses/${enrollment.courseId}`}>
                    Continue Learning
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't enrolled in any courses yet.</p>
          <Button>
            <Link href="/browse-courses">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
