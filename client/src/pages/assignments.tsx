import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "@/lib/constants";

export default function Assignments() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.ASSIGNMENTS.LIST],
  });

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
    <div>
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white font-montserrat">
          Assignments
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Track and manage your upcoming and past assignments
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-6 animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5 mt-2 sm:mt-0"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {assignments?.length > 0 ? (
              [...assignments]
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((assignment: any) => {
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
                        {assignment.description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {assignment.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })
            ) : (
              <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                No assignments found
              </li>
            )}
          </ul>
        )}
      </Card>
    </div>
  );
}
