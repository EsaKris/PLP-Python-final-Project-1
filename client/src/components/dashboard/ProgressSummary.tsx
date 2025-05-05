import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Assignment, Enrollment } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressSummaryProps {
  enrollments?: Enrollment[];
  assignments?: Assignment[];
}

const ProgressSummary = ({ enrollments = [], assignments = [] }: ProgressSummaryProps) => {
  // Calculate overall completion percentage
  const overallCompletion = enrollments.length
    ? Math.round(
        enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / enrollments.length
      )
    : 0;

  // Get current course (course with highest progress)
  const currentCourse = enrollments.length
    ? enrollments.sort((a, b) => b.progress - a.progress)[0]?.course
    : undefined;

  // Get next assignment due
  const nextAssignment = assignments.length
    ? [...assignments].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0]
    : undefined;

  // Calculate days until next assignment is due
  const daysUntilDue = nextAssignment
    ? Math.ceil(
        (new Date(nextAssignment.dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // Get current grade (mock data - in a real app this would come from the API)
  const currentGrade = "A (92.4%)";

  return (
    <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
      <CardHeader>
        <CardTitle>Your Learning Progress</CardTitle>
        <CardDescription>Keep up the good work! You're making excellent progress.</CardDescription>
      </CardHeader>
      <CardContent className="border-t border-gray-200 dark:border-gray-700">
        <dl>
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Completion</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              <Progress value={overallCompletion} className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 inline-block">
                {overallCompletion}% Complete
              </span>
            </dd>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Course</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {currentCourse?.name || "No courses enrolled"}
            </dd>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Assignment Due</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {nextAssignment ? (
                <>
                  {nextAssignment.title}{" "}
                  <span className={`text-red-600 dark:text-red-400 font-medium ml-2 ${daysUntilDue > 5 ? 'text-amber-600 dark:text-amber-400' : ''} ${daysUntilDue > 7 ? 'text-gray-600 dark:text-gray-400' : ''}`}>
                    Due in {daysUntilDue} {daysUntilDue === 1 ? "day" : "days"}
                  </span>
                </>
              ) : (
                "No assignments due"
              )}
            </dd>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Grade</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                {currentGrade}
              </Badge>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;
