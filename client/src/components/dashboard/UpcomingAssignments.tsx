import { Card } from "@/components/ui/card";
import { Assignment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface UpcomingAssignmentsProps {
  assignments?: Assignment[];
}

const UpcomingAssignments = ({ assignments = [] }: UpcomingAssignmentsProps) => {
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const getTimeUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      days: diffDays,
      text: `Due in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`,
      variant: diffDays <= 2 ? 'destructive' : diffDays <= 5 ? 'warning' : 'outline',
    };
  };

  const formatEstimatedTime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}${minutes % 60 ? ` ${minutes % 60} min` : ''}`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-montserrat">
        Upcoming Assignments
      </h2>
      <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedAssignments.length > 0 ? (
            sortedAssignments.map((assignment) => {
              const { text, variant } = getTimeUntilDue(assignment.dueDate);
              
              return (
                <li key={assignment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">
                        {assignment.title}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Badge variant={variant as "default" | "destructive" | "outline" | "secondary" | null}>
                          {text}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <i className="fas fa-book flex-shrink-0 mr-1.5 text-gray-400 dark:text-gray-500"></i>
                          {assignment.course?.name || "Unknown Course"}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                          <i className="fas fa-user flex-shrink-0 mr-1.5 text-gray-400 dark:text-gray-500"></i>
                          {assignment.course?.teacher 
                            ? `${assignment.course.teacher.firstName} ${assignment.course.teacher.lastName}` 
                            : "Unknown Teacher"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                        <i className="fas fa-clock flex-shrink-0 mr-1.5 text-gray-400 dark:text-gray-500"></i>
                        <p>Estimated time: {formatEstimatedTime(assignment.estimatedTime)}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No upcoming assignments
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default UpcomingAssignments;
