import { useState } from "react";
import ChatListItem from "./ChatListItem";
import type { Chat } from "../types";

type ChatSidebarProps = {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
};

export default function ChatSidebar({
  chats,
  activeChat,
  onChatSelect,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-950">
        <h1 className="text-zinc-100 text-xl font-bold tracking-tight">
          Messages
        </h1>
        <button className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 p-2 rounded-full transition-colors">
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
      <div className="p-3 border-b border-zinc-800 bg-zinc-950">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all"
          />
          <svg
            className="w-4 h-4 text-zinc-500 absolute left-3 top-3"
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
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <svg
              className="w-12 h-12 mb-3 text-zinc-800"
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
            <p className="text-sm font-medium">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
}
