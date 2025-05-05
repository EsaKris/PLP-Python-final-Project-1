import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LearningTool } from "@/lib/types";
import { Link } from "wouter";

interface LearningToolsProps {
  tools?: LearningTool[];
}

const LearningTools = ({ tools = [] }: LearningToolsProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-montserrat">
        Learning Tools
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
          >
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-800 rounded-md p-3">
                  <i className={`${tool.iconClass} text-primary-600 dark:text-primary-400 text-xl`}></i>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <Link 
                href={tool.link} 
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Open tool &rarr;
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningTools;
