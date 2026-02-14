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
      className={`flex items-center p-3 cursor-pointer transition-all border-b border-zinc-900 group ${
        isActive
          ? "bg-zinc-900 border-l-2 border-l-zinc-100"
          : "hover:bg-zinc-900/50 border-l-2 border-l-transparent"
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
          <img
            src={chat.user.avatar}
            alt={chat.user.name}
            className="w-full h-full object-cover"
          />
        </div>
        {chat.user.status === "online" && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full"></span>
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3
            className={`font-medium truncate ${
              isActive
                ? "text-zinc-100"
                : "text-zinc-300 group-hover:text-zinc-200"
            }`}
          >
            {chat.user.name}
          </h3>
          <span className="text-xs text-zinc-500">
            {formatTime(chat.timestamp)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p
            className={`text-sm truncate ${
              chat.unreadCount > 0
                ? "text-zinc-100 font-medium"
                : "text-zinc-500 group-hover:text-zinc-400"
            }`}
          >
            {chat.isTyping ? (
              <span className="text-emerald-400 italic text-xs">Typing...</span>
            ) : (
              chat.lastMessage
            )}
          </p>
          {chat.unreadCount > 0 && (
            <span className="ml-2 bg-zinc-100 text-zinc-950 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
