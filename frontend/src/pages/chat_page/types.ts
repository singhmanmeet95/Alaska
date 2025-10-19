export type User = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
};

export type Chat = {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isTyping?: boolean;
};
