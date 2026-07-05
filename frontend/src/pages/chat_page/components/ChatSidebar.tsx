import { useState } from "react";
import ChatListItem from "./ChatListItem";
import type { Chat } from "../types";

type ChatSidebarProps = {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
};

import { useNavigate } from "react-router-dom";

export default function ChatSidebar({
  chats,
  activeChat,
  onChatSelect,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-background">
        <h1 className="font-headline text-foreground">
          Messages
        </h1>
        <button 
          onClick={() => navigate('/map')}
          className="text-foreground/70 hover:text-foreground hover:bg-card p-2 rounded-full transition-colors"
          title="Find new connections on the Map"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border bg-background">
        <div className="relative font-body-sm">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-[8px] text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-all"
          />
          <svg
            className="w-4 h-4 text-foreground/50 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => onChatSelect(chat.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-foreground/50">
            <svg
              className="w-12 h-12 mb-3 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="font-body-sm">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
}
