import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/lib/types";
import { Link } from "wouter";

interface RecentMessagesProps {
  messages?: Message[];
}

const RecentMessages = ({ messages = [] }: RecentMessagesProps) => {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  ).slice(0, 3); // Only show 3 most recent messages
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDays = Math.round(diffHr / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-8 mb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-montserrat">
          Recent Messages
        </h2>
        <Link
          href="/messages"
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
        >
          View all
        </Link>
      </div>
      <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedMessages.length > 0 ? (
            sortedMessages.map((message) => (
              <li key={message.id}>
                <div className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Avatar>
                        <AvatarImage src={message.sender?.profileImage} alt={message.sender?.firstName} />
                        <AvatarFallback>{message.sender?.firstName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.sender
                            ? `${message.sender.firstName} ${message.sender.lastName}${message.sender.role === 'parent' ? ' (Parent)' : ''}`
                            : 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(message.sentAt)}
                        </p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No recent messages
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default RecentMessages;
