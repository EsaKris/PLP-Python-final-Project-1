import { useQuery } from "@tanstack/react-query";
import ProgressSummary from "./ProgressSummary";
import CourseGrid from "./CourseGrid";
import UpcomingAssignments from "./UpcomingAssignments";
import LearningTools from "./LearningTools";
import RecentMessages from "./RecentMessages";
import { API_ENDPOINTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Dashboard = () => {
  const { data: session } = useQuery({
    queryKey: [API_ENDPOINTS.AUTH.SESSION],
  });
  
  const { data: courses } = useQuery({
    queryKey: [API_ENDPOINTS.ENROLLMENTS.LIST],
    enabled: !!session?.authenticated,
  });

  const { data: assignments } = useQuery({
    queryKey: [API_ENDPOINTS.ASSIGNMENTS.LIST],
    enabled: !!session?.authenticated,
  });

  const { data: tools } = useQuery({
    queryKey: [API_ENDPOINTS.LEARNING_TOOLS.LIST],
    enabled: !!session?.authenticated,
  });

  const { data: messages } = useQuery({
    queryKey: [API_ENDPOINTS.MESSAGES.LIST],
    enabled: !!session?.authenticated,
  });

  const user = session?.user;

  return (
    <div>
      {/* Welcome header */}
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white font-montserrat">
          Hello, {user?.firstName || 'Student'}!
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Button className="inline-flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="mt-6">
        {/* Progress summary */}
        <ProgressSummary enrollments={courses} assignments={assignments} />

        {/* Course grid */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-montserrat">
          Your Courses
        </h2>
        <CourseGrid enrollments={courses} />

        {/* Upcoming assignments */}
        <UpcomingAssignments assignments={assignments} />

        {/* Learning tools */}
        <LearningTools tools={tools} />

        {/* Recent messages */}
        <RecentMessages messages={messages} />
      </div>
    </div>
  );
};

export default Dashboard;
