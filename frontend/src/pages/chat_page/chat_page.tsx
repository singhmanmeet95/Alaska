import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatSidebar, ChatWindow, EmptyChatState } from "./components";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatLogic } from "./hooks/useChatLogic";

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [sidebarWidth, setSidebarWidth] = useState(384);

  const {
    messages,
    activeChat,
    showSidebar,
    activeChatsList,
    activeUser,
    handleSendMessage,
    handleClearChat,
    handleRemoveFriend,
  } = useChatLogic(chatId, navigate);

  // Resize handler
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

  const handleChatSelect = (newChatId: string) => {
    navigate(`/chat/${newChatId}`);
  };

  const handleBackClick = () => {
    navigate("/chat");
  };

  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  if (!user) return null; // Handle unauthenticated edge visually smoothly

  return (
    <div
      className="h-full flex overflow-hidden bg-background font-sans"
      style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
    >
      {/* Sidebar */}
      <div
        className={`${
          showSidebar
            ? "w-full md:w-[var(--sidebar-width)]"
            : "hidden md:flex md:w-[var(--sidebar-width)] flex-col"
        } relative flex-shrink-0 border-r border-border transition-none h-full`}
      >
        <ChatSidebar
          chats={activeChatsList}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-border active:bg-border/80 z-50 hidden md:block transition-colors"
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`${showSidebar ? "hidden md:flex" : "flex"} flex-1 flex-col h-full overflow-hidden`}
      >
        {activeChat ? (
          <ChatWindow
            user={activeUser}
            messages={currentMessages}
            currentUserId={user.id}
            onSendMessage={handleSendMessage}
            onBackClick={handleBackClick}
            showBack={!showSidebar}
            onClearChat={handleClearChat}
            onRemoveFriend={handleRemoveFriend}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
