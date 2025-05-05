import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Enrollment } from "@/lib/types";
import { Link } from "wouter";

interface CourseGridProps {
  enrollments?: Enrollment[];
}

const CourseGrid = ({ enrollments = [] }: CourseGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {enrollments.map((enrollment) => (
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
  );
};

export default CourseGrid;
