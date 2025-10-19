import type { User, Chat } from "../types";

export const mockCurrentUser: User = {
  id: "current-user",
  name: "You",
  avatar: "https://ui-avatars.com/api/?name=You&background=4f46e5&color=fff",
  status: "online",
};

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar:
      "https://ui-avatars.com/api/?name=Alice+Johnson&background=ec4899&color=fff",
    status: "online",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar:
      "https://ui-avatars.com/api/?name=Bob+Smith&background=10b981&color=fff",
    status: "offline",
    lastSeen: "2 hours ago",
  },
  {
    id: "3",
    name: "Carol Williams",
    avatar:
      "https://ui-avatars.com/api/?name=Carol+Williams&background=f59e0b&color=fff",
    status: "online",
  },
  {
    id: "4",
    name: "David Brown",
    avatar:
      "https://ui-avatars.com/api/?name=David+Brown&background=8b5cf6&color=fff",
    status: "away",
    lastSeen: "5 minutes ago",
  },
  {
    id: "5",
    name: "Emma Davis",
    avatar:
      "https://ui-avatars.com/api/?name=Emma+Davis&background=ef4444&color=fff",
    status: "online",
  },
  {
    id: "6",
    name: "Frank Miller",
    avatar:
      "https://ui-avatars.com/api/?name=Frank+Miller&background=06b6d4&color=fff",
    status: "offline",
    lastSeen: "1 day ago",
  },
];

export const mockChats: Chat[] = [
  {
    id: "1",
    user: mockUsers[0],
    lastMessage: "Hey! How are you doing?",
    timestamp: new Date(Date.now() - 5 * 60000),
    unreadCount: 2,
  },
  {
    id: "2",
    user: mockUsers[1],
    lastMessage: "Thanks for your help yesterday!",
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    unreadCount: 0,
  },
  {
    id: "3",
    user: mockUsers[2],
    lastMessage: "Can we schedule a meeting?",
    timestamp: new Date(Date.now() - 24 * 60 * 60000),
    unreadCount: 5,
    isTyping: false,
  },
  {
    id: "4",
    user: mockUsers[3],
    lastMessage: "See you tomorrow!",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
    unreadCount: 0,
  },
  {
    id: "5",
    user: mockUsers[4],
    lastMessage: "That sounds great!",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60000),
    unreadCount: 1,
  },
];
