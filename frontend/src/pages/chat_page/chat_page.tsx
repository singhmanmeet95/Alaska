import { useState } from "react";
import { ChatSidebar, ChatWindow, EmptyChatState } from "./components";
import { mockChats, mockCurrentUser } from "./data/mockData";
import type { Message } from "./types";

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(384);

  // Using ref for resizing flag to avoid closure staleness if used in global handlers,
  // though we only attach handlers on mousedown.

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setSidebarWidth(Math.max(280, Math.min(newWidth, 600)));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
  };

  // Mock messages for demonstration
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1",
        senderId: "1",
        content: "Hey! How are you doing?",
        timestamp: new Date(Date.now() - 10 * 60000),
        status: "read",
        type: "text",
      },
      {
        id: "2",
        senderId: mockCurrentUser.id,
        content: "I'm doing great! How about you?",
        timestamp: new Date(Date.now() - 8 * 60000),
        status: "read",
        type: "text",
      },
      {
        id: "3",
        senderId: "1",
        content: "Awesome! Just finished a big project.",
        timestamp: new Date(Date.now() - 5 * 60000),
        status: "read",
        type: "text",
      },
      {
        id: "4",
        senderId: mockCurrentUser.id,
        content: "Congratulations! That's amazing news!",
        timestamp: new Date(Date.now() - 3 * 60000),
        status: "delivered",
        type: "text",
      },
    ],
    "2": [
      {
        id: "1",
        senderId: "2",
        content: "Thanks for your help yesterday!",
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        status: "read",
        type: "text",
      },
      {
        id: "2",
        senderId: mockCurrentUser.id,
        content: "No problem! Happy to help anytime.",
        timestamp: new Date(Date.now() - 1 * 60 * 60000),
        status: "read",
        type: "text",
      },
    ],
    "3": [
      {
        id: "1",
        senderId: "3",
        content: "Can we schedule a meeting?",
        timestamp: new Date(Date.now() - 24 * 60 * 60000),
        status: "read",
        type: "text",
      },
      {
        id: "2",
        senderId: mockCurrentUser.id,
        content: "Sure! How about tomorrow at 3 PM?",
        timestamp: new Date(Date.now() - 23 * 60 * 60000),
        status: "delivered",
        type: "text",
      },
      {
        id: "3",
        senderId: "3",
        content: "Perfect! See you then.",
        timestamp: new Date(Date.now() - 22 * 60 * 60000),
        status: "read",
        type: "text",
      },
    ],
  });

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setShowSidebar(false);
  };

  const handleSendMessage = (content: string) => {
    if (!activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: mockCurrentUser.id,
      content,
      timestamp: new Date(),
      status: "sent",
      type: "text",
    };

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeChat]: prev[activeChat].map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "delivered" as const }
            : msg,
        ),
      }));
    }, 1000);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeChat]: prev[activeChat].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" as const } : msg,
        ),
      }));
    }, 2000);
  };

  const handleBackClick = () => {
    setShowSidebar(true);
    setActiveChat(null);
  };

  const activeUser =
    mockChats.find((chat) => chat.id === activeChat)?.user || null;
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  return (
    <div
      className="h-screen flex overflow-hidden bg-zinc-950"
      style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
    >
      {/* Sidebar */}
      <div
        className={`${
          showSidebar
            ? "w-full md:w-[var(--sidebar-width)]"
            : "hidden md:block md:w-[var(--sidebar-width)]"
        } relative flex-shrink-0 border-r border-zinc-800 transition-none`}
      >
        <ChatSidebar
          chats={mockChats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-zinc-600 active:bg-zinc-500 z-50 hidden md:block transition-colors"
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`${showSidebar ? "hidden md:flex" : "flex"} flex-1 flex-col`}
      >
        {activeChat ? (
          <ChatWindow
            user={activeUser}
            messages={currentMessages}
            currentUserId={mockCurrentUser.id}
            onSendMessage={handleSendMessage}
            onBackClick={handleBackClick}
            showBack={!showSidebar}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
