import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PencilIcon, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { queryClient } from "@/lib/queryClient";
import { Message, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: [API_ENDPOINTS.MESSAGES.LIST],
  });

  // Fetch users for new message dialog
  const { data: sessionData } = useQuery({
    queryKey: [API_ENDPOINTS.AUTH.SESSION],
  });

  // Create conversation groups by sender/receiver pairs
  const conversations = messages ? groupMessages(messages, sessionData?.user?.id) : [];

  // Find selected conversation
  const selectedMessages = conversations.find(conv => 
    conv.userId === selectedConversation
  )?.messages || [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: number; content: string }) => {
      const response = await apiRequest("POST", API_ENDPOINTS.MESSAGES.CREATE, data);
      return response.json();
    },
    onSuccess: () => {
      // Clear message input and refetch messages
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MESSAGES.LIST] });
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      setNewMessageDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: error.message || "An error occurred while sending your message.",
      });
    },
  });

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const receiverId = selectedConversation || selectedReceiver;
    if (!receiverId) return;

    sendMessageMutation.mutate({
      receiverId,
      content: messageText,
    });
  };

  // Handle starting a new conversation
  const handleStartNewConversation = () => {
    if (!selectedReceiver) {
      toast({
        variant: "destructive",
        title: "No recipient selected",
        description: "Please select a recipient for your message.",
      });
      return;
    }

    if (!messageText.trim()) {
      toast({
        variant: "destructive",
        title: "Empty message",
        description: "Please enter a message.",
      });
      return;
    }

    sendMessageMutation.mutate({
      receiverId: selectedReceiver,
      content: messageText,
    });
  };

  // Format timestamp to readable format
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

  // Select contact info (name, profile picture) from message
  const getContactInfo = (conversation: any) => {
    if (!conversation || !conversation.user) return { name: "Unknown", role: "", avatar: "" };
    
    const { firstName, lastName, role, profileImage } = conversation.user;
    const name = `${firstName} ${lastName}`;
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
    
    return { 
      name, 
      role: formattedRole, 
      avatar: profileImage 
    };
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white font-montserrat">
            Messages
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Communicate with teachers, students, and parents
          </p>
        </div>
        <Dialog open={newMessageDialogOpen} onOpenChange={setNewMessageDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PencilIcon className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To:
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto">
                  {conversations.map((conversation) => {
                    const { name, role, avatar } = getContactInfo(conversation);
                    return (
                      <div 
                        key={conversation.userId}
                        onClick={() => setSelectedReceiver(conversation.userId)}
                        className={`flex items-center p-2 cursor-pointer rounded-md ${
                          selectedReceiver === conversation.userId 
                            ? "bg-primary-50 dark:bg-gray-700" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatar} alt={name} />
                          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
                        </div>
                        {selectedReceiver === conversation.userId && (
                          <div className="ml-auto">
                            <div className="h-4 w-4 rounded-full bg-primary-500"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message:
                </label>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleStartNewConversation}
                  disabled={sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="col-span-1">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Select a conversation to view messages</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {messagesLoading ? (
                <div className="p-4 animate-pulse space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {conversations.map((conversation) => {
                    const { name, role, avatar } = getContactInfo(conversation);
                    const lastMessage = conversation.messages[0];
                    const unreadCount = conversation.messages.filter(msg => 
                      !msg.read && msg.receiverId === sessionData?.user?.id
                    ).length;
                    
                    return (
                      <li 
                        key={conversation.userId}
                        onClick={() => setSelectedConversation(conversation.userId)}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                          selectedConversation === conversation.userId 
                            ? "bg-primary-50 dark:bg-gray-700" 
                            : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={avatar} alt={name} />
                              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {unreadCount > 0 && (
                              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-primary ring-2 ring-white dark:ring-gray-800"></span>
                            )}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {name}
                              </p>
                              {lastMessage && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimeAgo(lastMessage.sentAt)}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {role}
                              </p>
                              {unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 text-xs font-semibold">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {lastMessage && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                            {lastMessage.content}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setNewMessageDialogOpen(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Start a conversation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="col-span-1 md:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-3 border-b">
                  {conversations.some(c => c.userId === selectedConversation) && (
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={getContactInfo(conversations.find(c => c.userId === selectedConversation)).avatar} 
                          alt={getContactInfo(conversations.find(c => c.userId === selectedConversation)).name} 
                        />
                        <AvatarFallback>
                          {getContactInfo(conversations.find(c => c.userId === selectedConversation)).name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <CardTitle>
                          {getContactInfo(conversations.find(c => c.userId === selectedConversation)).name}
                        </CardTitle>
                        <CardDescription>
                          {getContactInfo(conversations.find(c => c.userId === selectedConversation)).role}
                        </CardDescription>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                  {selectedMessages.map((message) => {
                    const isCurrentUser = message.senderId === sessionData?.user?.id;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[75%] rounded-lg px-4 py-2 ${
                            isCurrentUser 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isCurrentUser 
                              ? 'text-primary-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTimeAgo(message.sentAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {selectedMessages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No messages in this conversation yet</p>
                    </div>
                  )}
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message here..."
                      className="resize-none"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <i className="fas fa-comment-alt text-gray-500 dark:text-gray-400 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Choose a conversation from the list or start a new one
                  </p>
                  <Button 
                    onClick={() => setNewMessageDialogOpen(true)}
                  >
                    <PencilIcon className="mr-2 h-4 w-4" />
                    New Message
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to group messages by conversation
function groupMessages(messages: Message[], currentUserId?: number) {
  if (!messages || !currentUserId) return [];

  // Create a map of conversations by the other user's ID
  const conversationsMap = new Map<number, { 
    userId: number;
    user: User | undefined;
    messages: Message[];
  }>();

  // Sort messages by date (newest first)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  sortedMessages.forEach(message => {
    // Determine the other user in the conversation
    const otherUserId = message.senderId === currentUserId 
      ? message.receiverId 
      : message.senderId;
    
    const otherUser = message.senderId === currentUserId 
      ? message.receiver 
      : message.sender;
    
    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, {
        userId: otherUserId,
        user: otherUser,
        messages: []
      });
    }
    
    conversationsMap.get(otherUserId)!.messages.push(message);
  });

  // Convert map to array
  return Array.from(conversationsMap.values());
}
