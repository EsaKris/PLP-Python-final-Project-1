import { Link, useLocation } from "wouter";
import { SIDEBAR_CATEGORIES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
  const [currentLocation] = useLocation();
  
  // Get unread messages count
  const { data: messages } = useQuery({
    queryKey: ['/api/messages'],
  });
  
  const unreadCount = messages?.filter((message: any) => 
    !message.read && message.receiverId === (messages?.[0]?.receiverId || 0)
  ).length || 0;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 px-3 space-y-1 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {/* Your Learning Section */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {SIDEBAR_CATEGORIES.LEARNING.title}
              </h3>
              {SIDEBAR_CATEGORIES.LEARNING.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentLocation === item.path
                      ? "bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <i className={`${item.icon} mr-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ${
                    currentLocation === item.path
                      ? "text-primary-500 dark:text-primary-400"
                      : ""
                  }`}></i>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Communication Section */}
            <div className="pt-4 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {SIDEBAR_CATEGORIES.COMMUNICATION.title}
              </h3>
              {SIDEBAR_CATEGORIES.COMMUNICATION.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentLocation === item.path
                      ? "bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <i className={`${item.icon} mr-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ${
                    currentLocation === item.path
                      ? "text-primary-500 dark:text-primary-400"
                      : ""
                  }`}></i>
                  {item.label}
                  
                  {/* Show unread message count for Messages link */}
                  {item.path === "/messages" && unreadCount > 0 && (
                    <span className="ml-auto bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 py-0.5 px-2 rounded-full text-xs">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Tools Section */}
            <div className="pt-4 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {SIDEBAR_CATEGORIES.TOOLS.title}
              </h3>
              {SIDEBAR_CATEGORIES.TOOLS.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentLocation === item.path
                      ? "bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <i className={`${item.icon} mr-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ${
                    currentLocation === item.path
                      ? "text-primary-500 dark:text-primary-400"
                      : ""
                  }`}></i>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
