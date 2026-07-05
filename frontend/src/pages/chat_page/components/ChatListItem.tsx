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
      className={`flex items-center p-3 cursor-pointer transition-all border-b border-border group ${
        isActive
          ? "bg-card border-l-2 border-l-primary"
          : "hover:bg-card/50 border-l-2 border-l-transparent"
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-[var(--radius-pill)] overflow-hidden bg-background border border-border">
          <img
            src={chat.user.avatar}
            alt={chat.user.name}
            className="w-full h-full object-cover"
          />
        </div>
        {chat.user.status === "online" && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden font-sans">
        <div className="flex justify-between items-center">
          <h3
            className={`font-headline text-sm truncate ${
              isActive
                ? "text-primary"
                : "text-foreground group-hover:text-foreground/90"
            }`}
          >
            {chat.user.name}
          </h3>
          <span className="font-eyebrow text-[10px] text-foreground/50">
            {formatTime(chat.timestamp)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p
            className={`font-body-sm text-[12px] truncate ${
              chat.unreadCount > 0
                ? "text-foreground font-bold"
                : "text-foreground/70 group-hover:text-foreground/60"
            }`}
          >
            {chat.isTyping ? (
              <span className="text-primary italic">Typing...</span>
            ) : (
              chat.lastMessage
            )}
          </p>
          {chat.unreadCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-[var(--radius-pill)] px-1.5 py-0.5 min-w-[18px] text-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
