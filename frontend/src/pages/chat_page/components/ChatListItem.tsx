import type { Chat } from "../types";

type ChatListItemProps = {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
};

export default function ChatListItem({
  chat,
  isActive,
  onClick,
}: ChatListItemProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer transition-all hover:bg-gray-100 border-b border-gray-100 ${
        isActive ? "bg-indigo-50 border-l-4 border-l-indigo-500" : ""
      }`}
    >
      <div className="relative">
        <img
          src={chat.user.avatar}
          alt={chat.user.name}
          className="w-12 h-12 rounded-full"
        />
        {chat.user.status === "online" && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 truncate">
            {chat.user.name}
          </h3>
          <span className="text-xs text-gray-500">
            {formatTime(chat.timestamp)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p
            className={`text-sm truncate ${
              chat.unreadCount > 0
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }`}
          >
            {chat.isTyping ? (
              <span className="text-indigo-500 italic">Typing...</span>
            ) : (
              chat.lastMessage
            )}
          </p>
          {chat.unreadCount > 0 && (
            <span className="ml-2 bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
